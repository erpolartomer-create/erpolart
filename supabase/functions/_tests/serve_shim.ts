// std/http serve() yerine: handler'ı sunucu açmadan yakalar (test içinde doğrudan çağrılır).
// deno-lint-ignore no-explicit-any
const g = globalThis as any;
export function serve(handler: (req: Request) => Response | Promise<Response>) {
  (g.__edgeHandlers ??= []).push(handler);
}
