export const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (type, name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("audio/")) return "🎵";
  if (type.startsWith("video/")) return "🎬";
  if (["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "c", "cpp"].includes(ext)) return "💻";
  if (["pdf", "doc", "docx", "txt", "md"].includes(ext)) return "📄";
  return "📁";
};

export const getCategory = (type, name) => {
  if (type.startsWith("image/")) return "images";
  if (type.startsWith("audio/") || type.startsWith("video/")) return "media";
  const ext = name.split(".").pop().toLowerCase();
  if (["pdf", "doc", "docx", "txt", "md", "xls", "xlsx", "ppt"].includes(ext)) return "documents";
  return "others";
};
