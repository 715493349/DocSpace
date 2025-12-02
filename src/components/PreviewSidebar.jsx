import React from "react";
import { X, Bot, Loader2, Eye, File, Sparkles, Star } from "lucide-react";
import { getFileIcon } from "../utils/fileHelpers";
import { formatSize, formatFileType } from "../utils/formatters";

const PreviewSidebar = ({
  selectedFile,
  onClose,
  previewContent,
  aiAnalysisResult,
  aiAnalysisLoading,
  onAiAnalyze,
  onToggleFavorite,
  onMoveToTrash,
  onRestore,
  onPermanentDelete,
  currentSection,
}) => {
  const isTrash = currentSection === "trash";

  const onDownload = () => {
    // ui组件提示：暂未开发
    alert("功能尚未开发");
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 shadow-2xl flex flex-col absolute right-0 top-0 bottom-0 z-20 animate-slide-in-right">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          文件详情
          {selectedFile.aiSummary && <Sparkles className="w-4 h-4 text-purple-500" />}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner mb-4">
            {getFileIcon(selectedFile.type, selectedFile.name)}
          </div>
          <h2 className="text-center font-bold text-gray-800 text-lg break-all px-2">{selectedFile.name}</h2>
          <span className="text-sm text-gray-400 mt-1 uppercase">{formatFileType(selectedFile.type)}</span>
        </div>

        {/* AI 分析区域 */}
        <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-purple-600 uppercase flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI 智能洞察
            </h4>
            {!aiAnalysisResult && !aiAnalysisLoading && (
              <button
                onClick={onAiAnalyze}
                className="text-xs bg-white text-purple-600 px-2 py-1 rounded-md border border-purple-200 hover:bg-purple-50 transition-colors shadow-sm"
              >
                ✨ 点击分析
              </button>
            )}
          </div>

          {aiAnalysisLoading ? (
            <div className="flex items-center justify-center py-4 text-purple-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-xs">Gemini 正在思考...</span>
            </div>
          ) : aiAnalysisResult ? (
            <div className="animate-fade-in">
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {typeof aiAnalysisResult === "string" ? aiAnalysisResult : aiAnalysisResult.summary}
              </p>
              {aiAnalysisResult.tags && (
                <div className="flex flex-wrap gap-2">
                  {aiAnalysisResult.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full border border-purple-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">点击按钮，让 AI 根据文件名和元数据为您生成智能摘要和标签。</p>
          )}
        </div>

        {/* 预览区域 */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">预览</h4>
          <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 min-h-[150px] flex items-center justify-center overflow-hidden relative">
            {previewContent?.type === "image" && previewContent.url ? (
              <img src={previewContent.url} alt="Preview" className="max-w-full max-h-[200px] rounded object-contain" />
            ) : previewContent?.type === "pdf" && previewContent.url ? (
              <div className="w-full h-[200px] relative">
                <iframe src={previewContent.url} className="w-full h-full rounded border-none" title="PDF Preview" />
                {/* 遮挡层防止 iframe 捕获所有点击 */}
                <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
              </div>
            ) : previewContent?.type === "code" ? (
              <div className="text-xs font-mono text-gray-600 bg-gray-100 p-2 rounded w-full h-full whitespace-pre-wrap overflow-auto max-h-[200px] text-left">
                {previewContent.content}
              </div>
            ) : previewContent?.type === "info" || previewContent?.type === "error" ? (
              <div className="text-center text-gray-400 text-xs px-2">
                <Eye className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                {previewContent.info}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm">
                <File className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                无法预览此文件内容
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">大小</h4>
            <p className="text-sm font-medium text-gray-700">{formatSize(selectedFile.size)}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">位置</h4>
            <p className="text-sm font-medium text-gray-700 capitalize flex items-center">
              {selectedFile.category}
              {selectedFile.isDeleted && <span className="ml-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">已删除</span>}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">创建时间</h4>
            <p className="text-sm font-medium text-gray-700">{new Date(selectedFile.date).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
        {!isTrash ? (
          <>
            <button
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              onClick={onDownload}
            >
              下载文件
            </button>
            <div className="flex space-x-2">
              <button
                onClick={(e) => onToggleFavorite(selectedFile.id, e)}
                className={`flex-1 py-2 border rounded-lg font-medium transition-colors flex items-center justify-center ${
                  selectedFile.isFavorite
                    ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                    : "border-gray-200 text-gray-600 hover:bg-white"
                }`}
              >
                <Star className={`w-4 h-4 mr-1 ${selectedFile.isFavorite ? "fill-current" : ""}`} />
                {selectedFile.isFavorite ? "已收藏" : "收藏"}
              </button>
              <button
                onClick={(e) => onMoveToTrash(selectedFile.id, e)}
                className="flex-1 py-2 border border-gray-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                删除
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={(e) => onRestore(selectedFile.id, e)}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              恢复
            </button>
            <button
              onClick={(e) => onPermanentDelete(selectedFile.id, e)}
              className="flex-1 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              彻底删除
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PreviewSidebar;
