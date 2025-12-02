import React from "react";
import { Star, Trash2, X, RefreshCw, Sparkles } from "lucide-react";
import { getFileIcon } from "../utils/fileHelpers";
import { formatSize, formatDate } from "../utils/formatters";

const FileRow = ({ file, onToggleFavorite, onDelete, onClick, isTrash, onRestore, onPermanentDelete }) => (
  <tr onClick={onClick} className="group bg-white hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 relative">
          {getFileIcon(file.type, file.name)}
          {file.aiSummary && file.name.startsWith("AI_Generated") && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-0.5 shadow-sm border border-white">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 truncate max-w-[200px] group-hover:text-indigo-600 transition-colors">
            {file.name}
          </p>
          <p className="text-xs text-gray-400 sm:hidden">{formatSize(file.size)}</p>
        </div>
        {file.isFavorite && !isTrash && <Star className="w-3 h-3 text-yellow-400 fill-current ml-2" />}
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{formatSize(file.size)}</td>
    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(file.date)}</td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isTrash ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(e);
              }}
              className="text-green-600 hover:bg-green-100 p-1.5 rounded"
              title="恢复"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPermanentDelete(e);
              }}
              className="text-red-600 hover:bg-red-100 p-1.5 rounded"
              title="彻底删除"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded hover:bg-yellow-50 ${file.isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
            >
              <Star className={`w-4 h-4 ${file.isFavorite ? "fill-current" : ""}`} />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
);

export default FileRow;
