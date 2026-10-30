// std/http serve() yerine: handler'ı kaydeder, sunucu açmaz.
export const serve = (handler) => {
  globalThis.__edgeHandlers ??= [];
  globalThis.__edgeHandlers.push(handler);
};
