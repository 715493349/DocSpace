import { useState } from "react";

export function useAi() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFile = async (fileName, prompt) => {
    setIsGenerating(true);
    try {
      // 模拟 AI 创建文件逻辑
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const content = `AI 生成内容: ${prompt}`;
      return { name: `AI_${fileName}`, content, type: "text/plain", size: content.length, date: Date.now() };
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateFile };
}
