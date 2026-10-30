// Edge Function'ların (Deno) https:// importlarını yerel stub'lara yönlendiren Node yükleyicisi.
// Hiçbir şey indirilmez; gerçek fonksiyon kodu Node'un yerleşik tip kaldırmasıyla çalışır.
const STUBS = {
  'https://deno.land/std@0.168.0/http/server.ts': './stubs/serve.mjs',
  'https://esm.sh/@supabase/supabase-js@2': './stubs/supabase.mjs',
  'https://esm.sh/standardwebhooks@1.0.0': './stubs/standardwebhooks.mjs',
};

export async function resolve(specifier, context, next) {
  if (STUBS[specifier]) return { url: new URL(STUBS[specifier], import.meta.url).href, shortCircuit: true };
  if (specifier.startsWith('https://') || specifier.startsWith('http://')) {
    throw new Error(`Testte stub'lanmamış uzak import: ${specifier}`);
  }
  return next(specifier, context);
}
