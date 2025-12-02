import React from "react";
import { Folder, LayoutGrid, Star, ImageIcon, FileText, Music, Trash2, Plus, Sparkles, PieChart } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { SECTIONS } from "../constants";

const Sidebar = ({ currentSection, onSectionChange, onUploadClick, onAiCreateClick, stats }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Folder className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">DocSpace</span>
      </div>

      <div className="px-4 mb-2 space-y-2">
        <button
          onClick={onUploadClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">上传文件</span>
        </button>

        <button
          onClick={onAiCreateClick}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-purple-200"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI 智能创作</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 mt-4">
        <SidebarItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label="全部文件"
          active={currentSection === SECTIONS.ALL}
          onClick={() => onSectionChange(SECTIONS.ALL)}
        />
        <SidebarItem
          icon={<Star className="w-5 h-5" />}
          label="我的收藏"
          active={currentSection === SECTIONS.FAVORITES}
          onClick={() => onSectionChange(SECTIONS.FAVORITES)}
        />
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">分类浏览</div>
        <SidebarItem
          icon={<ImageIcon className="w-5 h-5" />}
          label="图片"
          active={currentSection === SECTIONS.IMAGES}
          onClick={() => onSectionChange(SECTIONS.IMAGES)}
        />
        <SidebarItem
          icon={<FileText className="w-5 h-5" />}
          label="文档"
          active={currentSection === SECTIONS.DOCUMENTS}
          onClick={() => onSectionChange(SECTIONS.DOCUMENTS)}
        />
        <SidebarItem
          icon={<Music className="w-5 h-5" />}
          label="媒体"
          active={currentSection === SECTIONS.MEDIA}
          onClick={() => onSectionChange(SECTIONS.MEDIA)}
        />
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">系统</div>
        <SidebarItem
          icon={<Trash2 className="w-5 h-5" />}
          label="回收站"
          active={currentSection === SECTIONS.TRASH}
          onClick={() => onSectionChange(SECTIONS.TRASH)}
        />
      </nav>

      <div className="p-4 bg-gray-50 border-t border-gray-100 m-2 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">存储空间</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "35%" }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>已用: {stats.size}</span>
          <span>共 {stats.count} 个文件</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
