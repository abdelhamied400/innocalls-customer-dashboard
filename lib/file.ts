// converts to kb, mb, gb
export const formatFileSize = (bytes?: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};
