import { useState, useEffect, useMemo } from "react";
import { formatSize, getCategory } from "../utils/fileUtils";

export function useFileManager() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const savedFiles = localStorage.getItem("docSpaceFiles");
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        setFiles(parsed.map((f) => ({ ...f, tempUrl: null })));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const filesToSave = files.map((f) => ({ ...f, tempUrl: null, content: f.content?.length > 10000 ? null : f.content }));
    localStorage.setItem("docSpaceFiles", JSON.stringify(filesToSave));
  }, [files]);

  const filteredFiles = (currentSection, searchQuery) => {
    return files
      .filter((f) => (currentSection === "trash" ? f.isDeleted : !f.isDeleted))
      .filter((f) => {
        if (currentSection === "favorites") return f.isFavorite;
        if (["images", "documents", "media"].includes(currentSection)) return f.category === currentSection;
        return true;
      })
      .filter((f) => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.date - a.date);
  };

  const stats = useMemo(() => {
    const totalSize = files.filter((f) => !f.isDeleted).reduce((acc, curr) => acc + curr.size, 0);
    return { size: formatSize(totalSize), count: files.filter((f) => !f.isDeleted).length };
  }, [files]);

  return { files, setFiles, filteredFiles, stats };
}
