import { GEMINI_CONFIG } from "../constants";

/**
 * 调用 Gemini API 生成内容
 * @param {string} prompt - 提示词
 * @param {string} apiKey - API 密钥
 * @returns {Promise<string>} 生成的内容
 */
export const generateContentWithGemini = async (prompt, apiKey) => {
  if (!apiKey) {
    console.error("Gemini API Key 未配置");
    return "API 密钥未配置，请检查 constants.js。";
  }

  try {
    const response = await fetch(
      `${GEMINI_CONFIG.API_URL}?key=${apiKey}`, // 使用配置的 API_URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    // 处理 API 错误响应
    if (!response.ok) {
      console.error("Gemini API Error:", data.error);
      return GEMINI_CONFIG.API_ERROR_MESSAGE;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || GEMINI_CONFIG.DEFAULT_ERROR_MESSAGE;
  } catch (error) {
    console.error("Gemini API 网络错误:", error);
    return GEMINI_CONFIG.API_ERROR_MESSAGE;
  }
};

/**
 * 生成 AI 文档创建的提示词
 * @param {string} userPrompt - 用户需求
 * @returns {string} 完整提示词
 */
export const getAiDocumentPrompt = (userPrompt) => {
  const systemPrompt = `你是一个文档助手。请根据用户的需求生成一份Markdown格式的文档内容。
不要包含任何Markdown代码块标记（如\`\`\`markdown），直接返回文档内容。`;

  return `${systemPrompt}\n\n用户需求: ${userPrompt}`;
};

/**
 * 生成文件分析的提示词
 * @param {Object} file - 文件信息对象
 * @param {string} formatSize - 格式化后的文件大小
 * @returns {string} 完整提示词
 */
export const getFileAnalysisPrompt = (file, formatSize) => {
  const contentPreview = file.content ? `文件前200个字符内容预览: "${file.content.substring(0, 200)}..."` : "";

  return `我有一个文件，文件名为 "${file.name}"，文件类型为 "${file.type}"，大小为 ${formatSize}。
    ${contentPreview}
    请根据这些元数据（文件名通常包含重要信息）：
    1. 推测这个文件可能包含什么内容（简短的1句话摘要）。
    2. 给出3个相关的分类标签。
    请以JSON格式返回，格式为: { "summary": "...", "tags": ["tag1", "tag2", "tag3"] }。`;
};
