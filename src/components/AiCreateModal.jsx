import React from "react";
import { X, Sparkles, Wand2, Loader2 } from "lucide-react";

const AiCreateModal = ({ isOpen, onClose, aiPrompt, onAiPromptChange, onGenerate, isGenerating }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI 智能创作
            </h3>
            <p className="text-purple-100 text-sm mt-1">告诉 Gemini 你想写什么，稍等片刻即可生成。</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <textarea
            className="w-full h-32 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none bg-gray-50"
            placeholder="例如：帮我写一份关于可持续发展的项目大纲..."
            value={aiPrompt}
            onChange={onAiPromptChange}
            disabled={isGenerating}
          ></textarea>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              disabled={isGenerating}
            >
              取消
            </button>
            <button
              onClick={onGenerate}
              disabled={!aiPrompt.trim() || isGenerating}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-white transition-all ${
                !aiPrompt.trim() || isGenerating
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  开始生成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCreateModal;
