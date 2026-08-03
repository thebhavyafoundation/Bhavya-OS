"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ArrowRight,
  FileText,
  FolderGit2,
  Brain,
  Zap,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
    };

    const timer = setTimeout(fetchResults, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose();
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "repository":
        return <FolderGit2 size={16} className="text-[#3b82f6]" />;
      case "knowledge":
        return <Brain size={16} className="text-[#a855f7]" />;
      case "workflow":
        return <Zap size={16} className="text-[#eab308]" />;
      default:
        return <FileText size={16} className="text-[#71717a]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[640px] bg-[#111111] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#27272a]">
          <Search size={18} className="text-[#71717a]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-[15px] text-[#fafafa] placeholder-[#71717a] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#71717a] hover:text-[#fafafa]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#1a1a1a] transition-colors"
                  onClick={onClose}
                >
                  {getIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#fafafa] truncate">
                      {result.title}
                    </div>
                    <div className="text-[12px] text-[#71717a] truncate">
                      {result.description}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-[#71717a]" />
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center text-[#71717a] text-sm">
              No results found
            </div>
          ) : (
            <div className="py-4">
              <div className="px-5 py-2 text-[11px] font-medium text-[#71717a] uppercase tracking-wider">
                Quick Actions
              </div>
              {[
                { label: "Create Issue", shortcut: "⌘I" },
                { label: "Create Pull Request", shortcut: "⌘P" },
                { label: "Install MCP Server", shortcut: "⌘M" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-sm text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-[#fafafa] transition-colors"
                  onClick={onClose}
                >
                  <span>{action.label}</span>
                  <span className="ml-auto text-[11px] text-[#71717a] font-mono">
                    {action.shortcut}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
