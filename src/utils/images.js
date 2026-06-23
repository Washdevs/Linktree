const maxImageBytes = 2 * 1024 * 1024;
const allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

export function readImageFile(file) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error('Use uma imagem PNG, JPG, WEBP ou GIF.');
  }

  if (file.size > maxImageBytes) {
    throw new Error('A imagem deve ter no maximo 2 MB.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Nao foi possivel ler a imagem.'));
    reader.readAsDataURL(file);
  });
}
