const MAX_DIMENSION = 1280;
const QUALITY = 0.8;
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file doesn't look like an image we can read."));
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes and re-encodes an uploaded photo so it fits comfortably in
 * browser storage. A real backend would upload the original instead.
 */
export async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("That photo is over 12 MB — try a smaller one.");

  const source = await readAsDataUrl(file);
  const img = await loadImage(source);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", QUALITY);
}
