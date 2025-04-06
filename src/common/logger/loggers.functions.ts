import { Logger } from "@nestjs/common";
import { performance } from "perf_hooks";
import {
  HttpLoggerApiRest,
  ILoggerClient,
  LogContext,
  LogExecutionTimeOptions,
} from "src/interfaces/log-context";
import { v4 as uuidv4 } from "uuid";

function getEnhancedContext(): LogContext {
  const error = new Error();
  const stack = error.stack?.split("\n") || [];

  if (stack.length > 2) {
    const match = stack[2].match(
      /at (?:(.+?)\.)?([^\.]+?) \(?(.+?):(\d+):\d+\)?/
    );
    if (match) {
      return {
        className: match[1] || "Global",
        functionName: match[2],
        filePath: match[3],
        lineNumber: parseInt(match[4]),
      };
    }
  }

  return { className: "Global", functionName: "anonymous" };
}

export function LogExecutionTime(options: LogExecutionTimeOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const logger = new Logger(target.constructor.name);
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const uuid = uuidv4();
      const start = performance.now();
      const startTime = new Date().toISOString();
      const context = getEnhancedContext();

      // Destructuración con valores por defecto
      const {
        layer = "default",
        refuuid,
        timeFormat = "ms",
        client, // ILoggerClient obligatorio
        callback, // Opcional
      } = options;

      logger.log(
        `[${layer}] [${context.functionName}] [${uuid}] Inicio ejecución`
      );

      try {
        const result = await originalMethod.apply(this, args);

        const end = performance.now();
        const durationMs = end - start;
        const duration = calculateDuration(durationMs, timeFormat);

        logger.log(
          `[${layer}] [${context.functionName}] [${uuid}] Ejecución completada (${duration}${timeFormat})`
        );

        // Preparar datos del log
        const logData: HttpLoggerApiRest = {
          endpoint: "your-log-api-endpoint",
          method: "POST",
          body: {
            layer,
            uuid,
            refuuid,
            functionName: context.functionName,
            startTime,
            endTime: new Date().toISOString(),
            duration: durationMs,
            durationUnit: timeFormat,
            status: "success",
          },
        };
        // Manejo del envío
        if (client) await handleLogDelivery(client, logData, callback, logger);

        return result;
      } catch (error: any) {
        const end = performance.now();
        const durationMs = end - start;
        const duration = calculateDuration(durationMs, timeFormat);

        logger.error(
          `[${layer}] [${context.functionName}] [${uuid}] Error en ejecución (${duration}${timeFormat}): ${error.message}`,
          error.stack
        );

        // Preparar datos del log de error
        const errorLogData: HttpLoggerApiRest = {
          endpoint: "your-log-api-endpoint",
          method: "POST",
          body: {
            layer,
            uuid,
            refuuid,
            functionName: context.functionName,
            startTime,
            endTime: new Date().toISOString(),
            duration: durationMs,
            durationUnit: timeFormat,
            status: "error",
            error: {
              message: error.message,
              stack: error.stack,
            },
          },
        };

        // Manejo del envío del error
        if (client)
          await handleLogDelivery(client, errorLogData, callback, logger);

        throw error;
      }
    };

    return descriptor;
  };
}

// Función auxiliar para manejar el envío de logs
async function handleLogDelivery(
  client: ILoggerClient,
  logData: HttpLoggerApiRest,
  callback:
    | ((data: HttpLoggerApiRest, client: ILoggerClient) => Promise<boolean>)
    | undefined,
  logger: Logger
) {
  try {
    const connected = await client.connect();

    if (connected && callback) {
      // Si hay callback, usarlo como canal principal
      const success = await callback(logData, client);
      if (!success) {
        logger.warn("Callback ejecutado pero devolvió false");
      }
    } else {
      // Si no hay callback, usar el client directamente
      if (connected) {
        await client.send(logData);
        return client.close();
      }
      return false;
    }
  } catch (err: any | unknown) {
    logger.error(`Error en el envío del log: ${err.message}`);
  } finally {
    try {
      return await client.close();
    } catch (closeError: any | unknown) {
      logger.error(`Error cerrando conexión del logger: ${closeError.message}`);
    }
  }
}

function calculateDuration(
  durationMs: number,
  format: "s" | "ms" | "m"
): number {
  switch (format) {
    case "s":
      return parseFloat((durationMs / 1000).toFixed(3));
    case "m":
      return parseFloat((durationMs / 60000).toFixed(3));
    case "ms":
    default:
      return parseFloat(durationMs.toFixed(3));
  }
}

// Versión para funciones independientes (no métodos de clase)
export function withLogging<T extends (...args: any[]) => any>(
  fn: T,
  contextName = "Global"
): T {
  const logger = new Logger(contextName);
  const functionName = fn.name || "anonymous";

  return async function (...args: Parameters<T>) {
    const start = performance.now();

    logger.log(`[${functionName}] Inicio ejecución`);

    try {
      const result = await fn(...args);

      const end = performance.now();
      const duration = (end - start).toFixed(3);

      logger.log(`[${functionName}] Ejecución completada (${duration} ms)`);

      return result;
    } catch (error: any | unknown) {
      const end = performance.now();
      const duration = (end - start).toFixed(3);
      logger.error(
        `[${functionName}] Error en ejecución (${duration} ms): ${error.message}`,
        error.stack
      );
      throw error;
    }
  } as T;
}
