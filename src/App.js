import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, LayoutGrid, List as ListIcon, Trash2, Upload, Folder } from "lucide-react";
import Sidebar from "./components/Sidebar";
import FileCard from "./components/FileCard";
import FileRow from "./components/FileRow";
import PreviewSidebar from "./components/PreviewSidebar";
import AiCreateModal from "./components/AiCreateModal";
import { formatSize } from "./utils/formatters";
import { getCategory, readFileContent } from "./utils/fileHelpers";
import { generateContentWithGemini, getAiDocumentPrompt, getFileAnalysisPrompt } from "./utils/geminiApi";
import { VIEW_MODES, SECTIONS, GEMINI_CONFIG } from "./constants";

export default function DocSpaceApp() {
  // --- State ---
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [currentSection, setCurrentSection] = useState(SECTIONS.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  // AI 相关 State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  // 初始化加载数据
  useEffect(() => {
    const savedFiles = localStorage.getItem("docSpaceFiles");
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        // 恢复时，清空之前会话的临时 URL，避免无效链接
        const cleaned = parsed.map((f) => ({ ...f, tempUrl: null }));
        setFiles(cleaned);
      } catch (e) {
        console.error("Failed to load files", e);
      }
    } else {
      // 默认演示数据
      setFiles([
        {
          id: "1",
          name: "项目计划书.pdf",
          size: 2400000,
          type: "application/pdf",
          date: Date.now() - 10000000,
          isFavorite: true,
          isDeleted: false,
          category: "documents",
          aiSummary: "这是关于项目时间表和资源的详细规划文档。",
          content: null,
        },
        {
          id: "2",
          name: "Logo设计.png",
          size: 1500000,
          type: "image/png",
          date: Date.now() - 5000000,
          isFavorite: false,
          isDeleted: false,
          category: "images",
          content: null,
        },
        {
          id: "3",
          name: "main.tsx",
          size: 4000,
          type: "text/plain",
          date: Date.now(),
          isFavorite: false,
          isDeleted: false,
          category: "others",
          content: "console.log('Hello World');\n// 这是一个演示代码文件",
        },
        {
          id: "4",
          name: "财务报表_Q1.xlsx",
          size: 56000,
          type: "application/vnd.ms-excel",
          date: Date.now() - 20000000,
          isFavorite: true,
          isDeleted: false,
          category: "documents",
          content: null,
        },
      ]);
    }
  }, []);

  // 持久化保存 (只保存元数据和小型文本内容，大文件不保存)
  useEffect(() => {
    const filesToSave = files.map((f) => {
      // 如果内容过大，不保存到 localStorage
      if (f.content && f.content.length > 10000) {
        return { ...f, content: null, tempUrl: null };
      }
      return { ...f, tempUrl: null }; // 永远不保存 blob URL
    });
    localStorage.setItem("docSpaceFiles", JSON.stringify(filesToSave));
  }, [files]);

  // 当选择新文件时，重置 AI 分析结果
  useEffect(() => {
    if (selectedFile) {
      setAiAnalysisResult(selectedFile.aiSummary || null);
    } else {
      setAiAnalysisResult(null);
    }
  }, [selectedFile]);

  // --- 处理逻辑 ---

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files || event.dataTransfer.files);

    // 使用 Promise.all 处理所有文件读取
    const newFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        const content = await readFileContent(file);

        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          date: Date.now(),
          isFavorite: false,
          isDeleted: false,
          category: getCategory(file.type, file.name),
          tempUrl: URL.createObjectURL(file), // 创建当前会话可用的 URL
          content: content, // 保存读取到的文本内容
        };
      })
    );

    setFiles((prev) => [...newFiles, ...prev]);
    setIsDragging(false);
    // 重置 input 以允许重复上传同一文件
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Gemini 功能实现 ---

  // 1. AI 创建文档
  const handleAiCreate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    const fullPrompt = getAiDocumentPrompt(aiPrompt);
    const content = await generateContentWithGemini(fullPrompt, GEMINI_CONFIG.API_KEY);

    // 创建文件
    const blob = new Blob([content], { type: "text/markdown" });
    const newFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `AI_Generated_${Date.now()}.md`,
      size: blob.size,
      type: "text/markdown",
      date: Date.now(),
      isFavorite: false,
      isDeleted: false,
      category: "documents",
      tempUrl: URL.createObjectURL(blob),
      aiSummary: "由 Gemini AI 自动生成的文档。",
      content: content, // 直接保存内容，不依赖 URL
    };

    setFiles((prev) => [newFile, ...prev]);
    setIsGenerating(false);
    setIsAiModalOpen(false);
    setAiPrompt("");
  };

  // 2. AI 分析文件
  const handleAiAnalyze = async () => {
    if (!selectedFile) return;
    setAiAnalysisLoading(true);

    const prompt = getFileAnalysisPrompt(selectedFile, formatSize(selectedFile.size));
    const resultText = await generateContentWithGemini(prompt, GEMINI_CONFIG.API_KEY);

    try {
      const jsonStr = resultText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const result = JSON.parse(jsonStr);

      const analysisData = {
        summary: result.summary,
        tags: result.tags,
      };

      setAiAnalysisResult(analysisData);
      setFiles(files.map((f) => (f.id === selectedFile.id ? { ...f, aiSummary: analysisData } : f)));
      setSelectedFile((prev) => ({ ...prev, aiSummary: analysisData }));
    } catch (e) {
      console.error("Parse Error", e);
      setAiAnalysisResult({ summary: "无法解析 AI 响应", tags: [] });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // --- 拖拽处理 ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  // --- CRUD 操作 ---
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFiles(files.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
    // 更新选中文件的状态
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const moveToTrash = (id, e) => {
    e.stopPropagation();
    setFiles(files.map((f) => (f.id === id ? { ...f, isDeleted: true } : f)));
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
  };

  const restoreFromTrash = (id, e) => {
    e.stopPropagation();
    setFiles(files.map((f) => (f.id === id ? { ...f, isDeleted: false } : f)));
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
  };

  const deletePermanently = (id, e) => {
    e.stopPropagation();
    setFiles(files.filter((f) => f.id !== id));
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
  };

  const emptyTrash = () => {
    setFiles(files.filter((f) => !f.isDeleted));
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);

    // 1. 优先使用已保存的文本内容
    if (file.content) {
      setPreviewContent({ type: "code", content: file.content });
      return;
    }

    // 2. 尝试使用 URL 预览 (如果存在且有效)
    if (file.type.startsWith("image/")) {
      setPreviewContent({ type: "image", url: file.tempUrl });
    } else if (file.type === "application/pdf") {
      setPreviewContent({ type: "pdf", url: file.tempUrl });
    } else if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".js")) {
      // 如果没有保存 content，尝试 fetch blob (仅限当前会话新上传的文件)
      if (file.tempUrl && file.tempUrl.startsWith("blob:")) {
        fetch(file.tempUrl)
          .then((r) => r.text())
          .then((text) => setPreviewContent({ type: "code", content: text }))
          .catch(() => setPreviewContent({ type: "error", info: "无法读取文件内容（可能已过期）" }));
      } else {
        setPreviewContent({ type: "info", info: "此文件内容未在本地保存，无法预览。" });
      }
    } else {
      setPreviewContent({ type: "other", info: "此格式暂不支持在线预览" });
    }
  };

  // --- 过滤与排序 ---
  const filteredFiles = useMemo(() => {
    let result = files;
    if (currentSection === SECTIONS.TRASH) {
      result = result.filter((f) => f.isDeleted);
    } else {
      result = result.filter((f) => !f.isDeleted);
      if (currentSection === SECTIONS.FAVORITES) result = result.filter((f) => f.isFavorite);
      else if (currentSection === SECTIONS.IMAGES) result = result.filter((f) => f.category === "images");
      else if (currentSection === SECTIONS.DOCUMENTS) result = result.filter((f) => f.category === "documents");
      else if (currentSection === SECTIONS.MEDIA) result = result.filter((f) => f.category === "media");
    }
    if (searchQuery) {
      result = result.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result.sort((a, b) => b.date - a.date);
  }, [files, currentSection, searchQuery]);

  const stats = useMemo(() => {
    const totalSize = files.filter((f) => !f.isDeleted).reduce((acc, curr) => acc + curr.size, 0);
    const count = files.filter((f) => !f.isDeleted).length;
    return { size: formatSize(totalSize), count };
  }, [files]);

  // --- 辅助函数 ---
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAiCreateClick = () => {
    setIsAiModalOpen(true);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setSelectedFile(null); // 切换区域时关闭预览
  };

  const handleClosePreview = () => {
    setSelectedFile(null);
  };

  // --- 渲染 ---
  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onUploadClick={handleUploadClick}
        onAiCreateClick={handleAiCreateClick}
        stats={stats}
      />

      {/* 主内容区域 */}
      <main
        className="flex-1 flex flex-col min-w-0 bg-gray-50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 顶部栏 */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode(VIEW_MODES.GRID)}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === VIEW_MODES.GRID ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.LIST)}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === VIEW_MODES.LIST ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
            {currentSection === SECTIONS.TRASH && filteredFiles.length > 0 && (
              <button
                onClick={emptyTrash}
                className="text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> 清空
              </button>
            )}
          </div>
        </header>

        {/* 拖拽上传遮罩 */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm border-4 border-indigo-500 border-dashed m-4 rounded-2xl flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center animate-bounce-slow">
              <Upload className="w-16 h-16 text-indigo-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">释放以上传文件</h3>
              <p className="text-gray-500 mt-2">支持所有格式</p>
            </div>
          </div>
        )}

        {/* 文件列表区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {currentSection === SECTIONS.ALL && "全部文件"}
              {currentSection === SECTIONS.FAVORITES && "我的收藏"}
              {currentSection === SECTIONS.TRASH && "回收站"}
              {currentSection === SECTIONS.IMAGES && "图片"}
              {currentSection === SECTIONS.DOCUMENTS && "文档"}
              {currentSection === SECTIONS.MEDIA && "媒体资源"}
            </h2>
            <span className="text-sm text-gray-400">{filteredFiles.length} 项</span>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Folder className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500">这里空空如也</p>
              <p className="text-sm">点击左上角上传，或者使用 AI 创建</p>
            </div>
          ) : viewMode === VIEW_MODES.GRID ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onToggleFavorite={(e) => toggleFavorite(file.id, e)}
                  onDelete={(e) => moveToTrash(file.id, e)}
                  onClick={() => handleFileClick(file)}
                  isTrash={currentSection === SECTIONS.TRASH}
                  onRestore={(e) => restoreFromTrash(file.id, e)}
                  onPermanentDelete={(e) => deletePermanently(file.id, e)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">名称</th>
                    <th className="px-6 py-4 w-32">大小</th>
                    <th className="px-6 py-4 w-48">修改日期</th>
                    <th className="px-6 py-4 w-20">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFiles.map((file) => (
                    <FileRow
                      key={file.id}
                      file={file}
                      onToggleFavorite={(e) => toggleFavorite(file.id, e)}
                      onDelete={(e) => moveToTrash(file.id, e)}
                      onClick={() => handleFileClick(file)}
                      isTrash={currentSection === SECTIONS.TRASH}
                      onRestore={(e) => restoreFromTrash(file.id, e)}
                      onPermanentDelete={(e) => deletePermanently(file.id, e)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 文件预览侧边栏 */}
      {selectedFile && (
        <PreviewSidebar
          selectedFile={selectedFile}
          onClose={handleClosePreview}
          previewContent={previewContent}
          aiAnalysisResult={aiAnalysisResult}
          aiAnalysisLoading={aiAnalysisLoading}
          onAiAnalyze={handleAiAnalyze}
          onToggleFavorite={toggleFavorite}
          onMoveToTrash={moveToTrash}
          onRestore={restoreFromTrash}
          onPermanentDelete={deletePermanently}
          currentSection={currentSection}
        />
      )}

      {/* AI 创建模态框 */}
      <AiCreateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        aiPrompt={aiPrompt}
        onAiPromptChange={(e) => setAiPrompt(e.target.value)}
        onGenerate={handleAiCreate}
        isGenerating={isGenerating}
      />

      {/* 隐藏的文件输入框 */}
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
    </div>
  );
}
