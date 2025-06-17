// utils/downloadFile.ts

/**
 * Downloads a file from a given URL. Falls back to direct download if fetch fails.
 * @param url The URL of the file to download
 * @param filename The name to save the file as
 */
export async function downloadFile(
  url: string,
  filename: string = "file"
): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    // Fallback to direct download if fetch fails
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
