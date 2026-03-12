import { useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import { WindowState } from "../types";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onDragStop: (id: string, position: { x: number; y: number }) => void;
  onResizeStop: (id: string, size: { width: number; height: number }) => void;
}

const TASKBAR_HEIGHT = 56;
const SNAP_THRESHOLD = 40; // pixels from edge to trigger snap zone

type SnapZone = "left" | "right" | "top" | null;

export default function Window({
  window,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStop,
  onResizeStop,
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(window.isMaximized);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);

  useEffect(() => {
    setIsMaximized(window.isMaximized);
  }, [window.isMaximized]);

  const handleMaximize = () => {
    setIsMaximized((prev) => !prev);
    onMaximize(window.id);
  };

  const handleDrag = useCallback((_e: any, d: { x: number; y: number }) => {
    const viewportWidth = globalThis.innerWidth ?? 1280;
    const viewportHeight = globalThis.innerHeight ?? 800;

    // Detect snap zones
    if (d.x < SNAP_THRESHOLD && d.y > SNAP_THRESHOLD && d.y < viewportHeight - TASKBAR_HEIGHT - SNAP_THRESHOLD) {
      setSnapZone("left");
    } else if (d.x + window.size.width > viewportWidth - SNAP_THRESHOLD && d.y > SNAP_THRESHOLD && d.y < viewportHeight - TASKBAR_HEIGHT - SNAP_THRESHOLD) {
      setSnapZone("right");
    } else if (d.y < SNAP_THRESHOLD) {
      setSnapZone("top");
    } else {
      setSnapZone(null);
    }
  }, [window.size.width]);

  if (!window.isOpen || window.isMinimized) {
    return null;
  }

  const viewportWidth  = globalThis.innerWidth  ?? 1280;
  const viewportHeight = globalThis.innerHeight ?? 800;

  return (
    <Rnd
      default={{
        x: window.position.x,
        y: window.position.y,
        width:  window.size.width,
        height: window.size.height,
      }}
      // When maximised lock to top-left and fill screen minus taskbar
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      size={
        isMaximized
          ? { width: viewportWidth, height: viewportHeight - TASKBAR_HEIGHT }
          : undefined
      }
      minWidth={320}
      minHeight={240}
      // Constrain to viewport so the title-bar is always reachable
      bounds="window"
      // Allow dragging only via the title-bar handle
      dragHandleClassName="window-titlebar"
      enableResizing={!isMaximized}
      enableDragging={!isMaximized}
      // Stack order
      style={{ zIndex: window.zIndex }}
      // Keep pointer events active on the Rnd wrapper itself
      className="pointer-events-auto"
      onDrag={handleDrag}
      onDragStop={(_e, d) => {
        // Handle snap zones
        if (snapZone === "left") {
          onDragStop(window.id, { x: 0, y: 0 });
          onResizeStop(window.id, {
            width: viewportWidth / 2,
            height: viewportHeight - TASKBAR_HEIGHT,
          });
        } else if (snapZone === "right") {
          onDragStop(window.id, { x: viewportWidth / 2, y: 0 });
          onResizeStop(window.id, {
            width: viewportWidth / 2,
            height: viewportHeight - TASKBAR_HEIGHT,
          });
        } else if (snapZone === "top") {
          handleMaximize();
        } else {
          // Normal drag - clamp so the title-bar never hides under the taskbar
          const clampedY = Math.min(d.y, viewportHeight - TASKBAR_HEIGHT - 40);
          onDragStop(window.id, { x: d.x, y: Math.max(0, clampedY) });
        }
        setSnapZone(null);
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        onResizeStop(window.id, {
          width:  parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        onDragStop(window.id, { x: position.x, y: position.y });
      }}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Snap Zone Indicators */}
      <AnimatePresence>
        {snapZone && (
          <>
            {snapZone === "left" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 w-1/2 h-full bg-blue-500 border-4 border-blue-400 pointer-events-none z-[9999]"
                style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
              />
            )}
            {snapZone === "right" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 right-0 w-1/2 h-full bg-blue-500 border-4 border-blue-400 pointer-events-none z-[9999]"
                style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
              />
            )}
            {snapZone === "top" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 w-full h-full bg-blue-500 border-4 border-blue-400 pointer-events-none z-[9999]"
                style={{ height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={window.id}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{   opacity: 0, scale: 0.92, y: 12  }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="w-full h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700/80"
        >
          {/* ── Title Bar ─────────────────────────────────────────────── */}
          <div
            className="window-titlebar flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-850 border-b border-gray-700 cursor-grab active:cursor-grabbing select-none flex-shrink-0"
            onDoubleClick={handleMaximize}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="text-gray-400 flex-shrink-0">{window.icon}</div>
              <span className="text-gray-100 font-medium text-sm truncate">
                {window.title}
              </span>
            </div>

            {/* Traffic-light style controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
              {/* Minimise */}
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-yellow-500/20 transition-colors group"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5 text-gray-500 group-hover:text-yellow-400" />
              </button>

              {/* Maximise / Restore */}
              <button
                onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-green-500/20 transition-colors group"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized
                  ? <Maximize2 className="w-3 h-3 text-gray-500 group-hover:text-green-400" />
                  : <Square    className="w-3 h-3 text-gray-500 group-hover:text-green-400" />
                }
              </button>

              {/* Close */}
              <button
                onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/20 transition-colors group"
                title="Close"
              >
                <X className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400" />
              </button>
            </div>
          </div>

          {/* ── Content ───────────────────────────────────────────────── */}
          <div className="flex-1 overflow-auto bg-gray-800 min-h-0">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </Rnd>
  );
}
