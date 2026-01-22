import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export function toNodeReadable(body: any): Readable {
  // Node.js Readable stream
  if (body instanceof Readable) {
    return body;
  }

  // Web ReadableStream (Node 18+)
  if (body instanceof ReadableStream) {
    return Readable.fromWeb(body);
  }

  // Uint8Array / Buffer
  if (body instanceof Uint8Array) {
    return Readable.from(body);
  }

  // Blob (rare in backend, but safe)
  if (body instanceof Blob) {
    return Readable.from(body.stream());
  }

  throw new Error("Unsupported S3 body type");
}
