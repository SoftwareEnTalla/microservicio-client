import * as https from "https";
import { ILoggerClient } from "src/interfaces/log-context";

export class HttpLoggerClient implements ILoggerClient {
  constructor(private baseUrl: string) {}

  async connect(): Promise<boolean> {
    console.log("Connecting to HTTP Logger at", this.baseUrl);
    return true;
  }

  async send(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const requestData = JSON.stringify(data);
      const url = new URL(`${this.baseUrl}/logs`);

      const options = {
        hostname: url.hostname,
        port: url.port || 443, // Usa 443 para HTTPS
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestData),
        },
      };

      const req = https.request(options, (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 201) {
            resolve(true);
          } else {
            console.error("HTTP Logger Error:", responseBody);
            resolve(false);
          }
        });
      });

      req.on("error", (error) => {
        console.error("HTTP Logger Error:", error);
        reject(false);
      });

      req.write(requestData);
      req.end();
    });
  }

  async close(): Promise<boolean> {
    console.log("Closing HTTP Logger connection");
    return true;
  }
}
