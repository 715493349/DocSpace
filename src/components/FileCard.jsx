import React from "react";
import { Star, Trash2, X, RefreshCw, Sparkles } from "lucide-react";
import { getFileIcon } from "../utils/fileHelpers";
import { formatSize } from "../utils/formatters";

const FileCard = ({ file, onToggleFavorite, onDelete, onClick, isTrash, onRestore, onPermanentDelete }) => (
  <div
    onClick={onClick}
    className="group relative bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col items-center aspect-[4/5] justify-between"
  >
    <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      {!isTrash && (
        <button
          onClick={onToggleFavorite}
          className="p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:text-yellow-500 text-gray-400"
        >
          <Star className={`w-4 h-4 ${file.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </button>
      )}
    </div>

    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      {isTrash ? (
        <div className="flex space-x-1">
          <button onClick={onRestore} className="p-1.5 bg-green-50 rounded-full text-green-600 hover:bg-green-100" title="恢复">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={onPermanentDelete} className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-100" title="彻底删除">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={onDelete}
          className="p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>

    <div className="flex-1 flex items-center justify-center w-full relative">
      {/* 缩略图逻辑 - 优先使用 blob URL (图片)，否则使用图标 */}
      {file.type.startsWith("image/") && file.tempUrl ? (
        <div className="w-full h-24 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
          <img src={file.tempUrl} alt={file.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 transform transition-transform group-hover:scale-110 duration-200">
          {getFileIcon(file.type, file.name)}
        </div>
      )}
      {/* AI 生成标识 */}
      {file.aiSummary && file.name.startsWith("AI_Generated") && (
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 shadow-sm border border-white">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
    </div>

    <div className="w-full mt-3 text-center">
      <h3 className="text-sm font-medium text-gray-700 truncate px-1" title={file.name}>
        {file.name}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{formatSize(file.size)}</p>
    </div>

    {file.isFavorite && !isTrash && (
      <div className="absolute bottom-3 right-3">
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
      </div>
    )}
  </div>
);

export default FileCard;
