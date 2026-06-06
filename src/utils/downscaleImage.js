/**
 * Downscales a base64 / object-URL image so its longest side is at most `maxDim`,
 * re-encoding as JPEG at `quality`. Keeps photos stored in localStorage small
 * enough to stay well under the ~5 MB quota. Resolves to the original string
 * unchanged if the image cannot be loaded or re-encoded.
 *
 * @param {string} src                 data URL or object URL of the source image
 * @param {Object} [opts]
 * @param {number} [opts.maxDim=1024]   max width/height of the result
 * @param {number} [opts.quality=0.85]  JPEG quality (0–1)
 * @returns {Promise<string>}
 */
export function downscaleDataUrl(src, { maxDim = 1024, quality = 0.85 } = {}) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(src);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const longest = Math.max(img.width, img.height) || 1;
      const scale = Math.min(1, maxDim / longest);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(src); // tainted canvas or unsupported — keep original
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}
