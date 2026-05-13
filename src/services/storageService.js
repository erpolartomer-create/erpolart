import { supabase } from '../lib/supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {string} bucket - The name of the bucket (e.g., 'logos')
 * @param {string} path - The path inside the bucket (e.g., 'order-123/logo.png')
 * @param {File|Blob|string} file - The file body (can be a base64 string or File object)
 */
export const uploadToStorage = async (bucket, path, fileBody) => {
  try {
    let body = fileBody;

    // Handle Base64 strings (data:image/png;base64,...)
    if (typeof fileBody === 'string' && fileBody.includes('base64,')) {
      const base64Data = fileBody.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      body = new Blob([byteArray], { type: fileBody.split(';')[0].split(':')[1] });
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, body, {
        upsert: true,
        contentType: body instanceof Blob ? body.type : undefined
      });

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Storage Upload Error:', error);
    throw error;
  }
};
