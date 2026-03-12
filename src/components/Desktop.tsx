import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  User,
  Folder,
  Mail,
  FileText,
  Briefcase,
  ExternalLink,
  X,
  Award,
} from "lucide-react";
import { AppConfig } from "../types";

export const apps: AppConfig[] = [
  {
    id: "about",
    title: "About Me",
    icon: <User className="w-6 h-6" />,
    component: "about",
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 100, y: 50 },
  },
  {
    id: "projects",
    title: "My Projects",
    icon: <Folder className="w-6 h-6" />,
    component: "projects",
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 150, y: 80 },
  },
  {
    id: "skills",
    title: "Skills",
    icon: <Code2 className="w-6 h-6" />,
    component: "skills",
    defaultSize: { width: 600, height: 450 },
    defaultPosition: { x: 200, y: 100 },
  },
  {
    id: "contact",
    title: "Contact",
    icon: <Mail className="w-6 h-6" />,
    component: "contact",
    defaultSize: { width: 500, height: 400 },
    defaultPosition: { x: 250, y: 120 },
  },
  {
    id: "resume",
    title: "Resume",
    icon: <FileText className="w-6 h-6" />,
    component: "resume",
    defaultSize: { width: 700, height: 800 },
    defaultPosition: { x: 300, y: 140 },
  },
  {
    id: "portfolio",
    title: "Portfolio",
    icon: <Briefcase className="w-6 h-6" />,
    component: "portfolio",
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 350, y: 160 },
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: <Award className="w-6 h-6" />,
    component: "certificates",
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 400, y: 180 },
  },
];

const iconColors: Record<string, string> = {
  about:        "from-blue-500 to-cyan-500",
  projects:     "from-purple-500 to-pink-500",
  skills:       "from-green-500 to-emerald-500",
  contact:      "from-orange-500 to-red-500",
  resume:       "from-yellow-500 to-amber-500",
  portfolio:    "from-indigo-500 to-violet-500",
  certificates: "from-yellow-500 to-orange-500",
};

interface ContextMenuState {
  appId: string;
  x: number;
  y: number;
}

interface DesktopProps {
  onOpenApp: (appId: string) => void;
}

export default function Desktop({ onOpenApp }: DesktopProps) {
  const [selectedIcon, setSelectedIcon]     = useState<string | null>(null);
  const [contextMenu, setContextMenu]       = useState<ContextMenuState | null>(null);
  const contextMenuRef                      = useRef<HTMLDivElement>(null);

  // ── Close context menu on click-outside ──────────────────────────────────
  useEffect(() => {
    if (!contextMenu) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [contextMenu]);

  // ── Close context menu on Escape ─────────────────────────────────────────
  useEffect(() => {
    if (!contextMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [contextMenu]);

  // ── Deselect icon when clicking blank desktop area ───────────────────────
  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setSelectedIcon(null);
    setContextMenu(null);
  }, []);

  // ── Right-click on icon ───────────────────────────────────────────────────
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, appId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Keep the menu inside the viewport
      const menuWidth  = 200;
      const menuHeight = 110;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const x = e.clientX + menuWidth  > vw ? vw - menuWidth  - 8 : e.clientX;
      const y = e.clientY + menuHeight > vh ? vh - menuHeight - 8 : e.clientY;

      setSelectedIcon(appId);
      setContextMenu({ appId, x, y });
    },
    [],
  );

  const handleOpen = useCallback(() => {
    if (!contextMenu) return;
    onOpenApp(contextMenu.appId);
    setContextMenu(null);
  }, [contextMenu, onOpenApp]);

  return (
    <div
      className="absolute inset-0 pt-14 pb-14 overflow-hidden"
      onClick={handleDesktopClick}
    >
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(74, 85, 104, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
          `,
        }}
      >
        {/* Animated star field */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                opacity: [
                  Math.random() * 0.5 + 0.2,
                  Math.random() * 0.8 + 0.2,
                  Math.random() * 0.5 + 0.2,
                ],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop Icon Grid ───────────────────────────────────────────────── */}
      <div className="relative z-10 p-4 grid grid-cols-6 gap-4 auto-rows-auto">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcon(app.id);
                setContextMenu(null);
                onOpenApp(app.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onOpenApp(app.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, app.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl
                transition-all duration-200 select-none w-full
                ${selectedIcon === app.id
                  ? "bg-white/20 backdrop-blur-sm ring-2 ring-blue-500/50"
                  : "hover:bg-white/10 hover:scale-105"
                }
              `}
            >
              {/* Icon tile */}
              <div
                className={`
                  w-14 h-14 flex items-center justify-center rounded-xl
                  bg-gradient-to-br ${iconColors[app.id] ?? "from-gray-500 to-gray-600"}
                  shadow-lg shadow-black/20
                  transform transition-transform duration-200
                  ${selectedIcon === app.id ? "scale-110" : ""}
                `}
              >
                <div className="text-white drop-shadow-lg">{app.icon}</div>
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium text-center drop-shadow-lg
                  max-w-[80px] truncate leading-tight
                  ${selectedIcon === app.id ? "text-white font-bold" : "text-white/90"}
                `}
              >
                {app.title}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* ── Right-click Context Menu ────────────────────────────────────────── */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            ref={contextMenuRef}
            key="context-menu"
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: -4  }}
            transition={{ duration: 0.1 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-[999] bg-gray-900/98 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl py-1.5 min-w-[200px]"
          >
            {/* Context menu header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/60 mb-1">
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${iconColors[contextMenu.appId]} flex items-center justify-center flex-shrink-0`}>
                <div className="text-white scale-75">
                  {apps.find((a) => a.id === contextMenu.appId)?.icon}
                </div>
              </div>
              <span className="text-white text-sm font-semibold truncate">
                {apps.find((a) => a.id === contextMenu.appId)?.title}
              </span>
              <button
                onClick={() => setContextMenu(null)}
                className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Open */}
            <button
              onClick={handleOpen}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3 text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
              Open
            </button>

            {/* Open & bring to front (same as Open for now) */}
            <button
              onClick={handleOpen}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3 text-sm transition-colors"
            >
              <Folder className="w-4 h-4 text-purple-400" />
              Open in foreground
            </button>

            <div className="border-t border-gray-700/60 my-1" />

            {/* Dismiss */}
            <button
              onClick={() => setContextMenu(null)}
              className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-800 hover:text-gray-300 flex items-center gap-3 text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
