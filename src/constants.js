// 文件分类相关常量
export const FILE_CATEGORIES = {
  IMAGES: "images",
  DOCUMENTS: "documents",
  MEDIA: "media",
  OTHERS: "others",
};

// 文档类型相关常量
export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx", "txt", "md", "xls", "xlsx", "ppt"];

// 代码文件扩展名
export const CODE_EXTENSIONS = ["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "c", "cpp"];

// 视图模式
export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

// 应用区域
export const SECTIONS = {
  ALL: "all",
  FAVORITES: "favorites",
  TRASH: "trash",
  IMAGES: "images",
  DOCUMENTS: "documents",
  MEDIA: "media",
};

// Gemini API 配置
export const GEMINI_CONFIG = {
  API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent",
  API_KEY: "AIzaSyB-SbOOZiS_s7Lrq-AihoiZiamXsRVMIVQ",
  DEFAULT_ERROR_MESSAGE: "无法生成内容，请稍后再试。",
  API_ERROR_MESSAGE: "AI 服务暂时不可用。",
};
