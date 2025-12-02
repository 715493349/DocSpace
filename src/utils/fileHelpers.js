import { FileText, Image as ImageIcon, Music, Video, Code, File } from "lucide-react";
import { FILE_CATEGORIES, DOCUMENT_EXTENSIONS, CODE_EXTENSIONS } from "../constants";

/**
 * 根据文件类型和名称获取对应的图标组件
 * @param {string} type - 文件 MIME 类型
 * @param {string} name - 文件名
 * @returns {JSX.Element} 图标组件
 */
export const getFileIcon = (type, name) => {
  if (type.startsWith("image/")) return <ImageIcon className="w-6 h-6 text-purple-500" />;
  if (type.startsWith("audio/")) return <Music className="w-6 h-6 text-pink-500" />;
  if (type.startsWith("video/")) return <Video className="w-6 h-6 text-red-500" />;

  const ext = name.split(".").pop().toLowerCase();
  if (CODE_EXTENSIONS.includes(ext)) {
    return <Code className="w-6 h-6 text-blue-500" />;
  }
  if (DOCUMENT_EXTENSIONS.includes(ext)) {
    return <FileText className="w-6 h-6 text-orange-500" />;
  }
  return <File className="w-6 h-6 text-gray-500" />;
};

/**
 * 根据文件类型和名称获取文件分类
 * @param {string} type - 文件 MIME 类型
 * @param {string} name - 文件名
 * @returns {string} 文件分类
 */
export const getCategory = (type, name) => {
  if (type.startsWith("image/")) return FILE_CATEGORIES.IMAGES;
  if (type.startsWith("audio/") || type.startsWith("video/")) return FILE_CATEGORIES.MEDIA;

  const ext = name.split(".").pop().toLowerCase();
  if (DOCUMENT_EXTENSIONS.includes(ext)) return FILE_CATEGORIES.DOCUMENTS;

  return FILE_CATEGORIES.OTHERS;
};

/**
 * 读取文件内容（仅支持文本类小文件）
 * @param {File} file - 要读取的文件
 * @returns {Promise<string|null>} 文件内容或 null
 */
export const readFileContent = async (file) => {
  // 限制 500KB 以内才读取
  if (file.size >= 500000) return null;

  const fileExt = file.name.split(".").pop().toLowerCase();
  const isTextFile = file.type.startsWith("text/") || ["md", "js", "json", "ts", "tsx"].includes(fileExt);

  if (!isTextFile) return null;

  try {
    return await file.text();
  } catch (e) {
    console.warn("无法读取文本内容", e);
    return null;
  }
};
