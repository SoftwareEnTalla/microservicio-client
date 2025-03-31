import { createHash } from "crypto";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

// Sobrecarga de la función
export function generateCacheKey<Type>(
  prefijo: string,
  id: string,
  partialEntity: Partial<Type>
): string;
export function generateCacheKey<Type>(prefijo: string, id: string): string;

// Implementación de la función
export function generateCacheKey<Type>(
  prefijo: string,
  id: string,
  partialEntity?: Partial<Type>
): string {
  if (partialEntity) {
    const hash = createHash("sha256")
      .update(JSON.stringify(partialEntity))
      .digest("hex");
    return `${prefijo}:${id}:${hash}`;
  }
  return `${prefijo}:${id}`;
}

export async function transformAndValidate<T>(
  partialDto: Partial<T>
): Promise<T> {
  const cls = {} as T;
  const dto = plainToClass(ClassCo, partialDto);
  await validateOrReject(dto); // Lanza un error si la validación falla
  return dto;
}
