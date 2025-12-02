/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的大小字符串
 */
export const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 格式化日期
 * @param {number} timestamp - 时间戳
 * @returns {string} 本地化日期字符串
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

/**
 * 格式化文件类型显示
 * @param {string} type - MIME 类型
 * @returns {string} 简化后的类型名称
 */
export const formatFileType = (type) => {
  return type.split("/")[1] || "Unknown";
};
