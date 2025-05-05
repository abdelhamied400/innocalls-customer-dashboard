export const SOUND_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
export const CSV_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

export const fileSizeToString = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let formattedSize = size;

  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }

  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
};
