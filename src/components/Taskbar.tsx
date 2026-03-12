import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wifi, Volume2, Battery, ChevronUp, Monitor, Shield, User } from 'lucide-react';
import { WindowState } from '../types';
import { useAuth } from '../context/AuthContext';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
  onShowDesktop?: () => void;
}

export default function Taskbar({
  windows,
  onWindowClick,
  onToggleStartMenu,
  isStartMenuOpen,
  onShowDesktop,
}: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isAdmin } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  const openWindows = windows.filter((w) => w.isOpen);
  const maxVisibleWindows = 6;
  const visibleWindows = openWindows.slice(0, maxVisibleWindows);
  const hiddenCount = openWindows.length - maxVisibleWindows;

  const getFocusedWindowId = () => {
    if (openWindows.length === 0) return null;
    return openWindows.reduce((prev, curr) =>
      (curr.zIndex > prev.zIndex ? curr : prev)
    ).id;
  };

  const focusedId = getFocusedWindowId();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute bottom-0 left-0 right-0 h-14 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 flex items-center justify-between px-2 z-50"
    >
      {/* Left Side: Start Button + Show Desktop + Window Buttons */}
      <div className="flex items-center gap-1 min-w-0 flex-1">

        {/* Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
            isStartMenuOpen
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-800 text-gray-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">Start</span>
        </button>

        {/* Show Desktop Button */}
        <button
          onClick={onShowDesktop}
          title="Show Desktop (minimize all windows)"
          className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-700 mx-1 flex-shrink-0" />

        {/* Open Windows */}
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          {visibleWindows.map((win) => {
            const isFocused = win.id === focusedId && !win.isMinimized;
            return (
              <motion.button
                key={win.id}
                onClick={() => onWindowClick(win.id)}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ duration: 0.15 }}
                title={win.title}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  max-w-[160px] flex-shrink-0 relative
                  ${isFocused
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                    : win.isMinimized
                    ? 'hover:bg-gray-800 text-gray-500 border border-transparent'
                    : 'bg-gray-800/60 text-gray-300 border border-gray-700 hover:border-gray-500'
                  }
                `}
              >
                {/* Focused indicator dot */}
                {isFocused && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}

                <div className="w-4 h-4 flex-shrink-0 opacity-80">
                  {win.icon}
                </div>
                <span className="text-xs truncate font-medium">
                  {win.title}
                </span>
                {win.isMinimized && (
                  <ChevronUp className="w-3 h-3 ml-auto flex-shrink-0 opacity-50" />
                )}
              </motion.button>
            );
          })}

          {/* Overflow Badge */}
          {hiddenCount > 0 && (
            <div className="flex-shrink-0 px-2 py-1 bg-gray-700 rounded-lg text-xs text-gray-400 font-medium">
              +{hiddenCount}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: System Tray + Clock */}
      <div className="flex items-center gap-2 px-3 flex-shrink-0">

        {/* Admin Status Badge */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 border border-green-500/30 rounded-lg"
              title="Logged in as Admin"
            >
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Admin</span>
            </motion.div>
          )}
          {!isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg"
              title="Viewing as Guest"
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 text-xs">Guest</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-700" />

        {/* System Icons */}
        <div className="flex items-center gap-1 text-gray-400">
          <button
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title="Network"
          >
            <Wifi className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title="Volume"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title="Battery"
          >
            <Battery className="w-4 h-4" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Clock */}
        <div className="flex flex-col items-end text-gray-300 min-w-[72px]">
          <span className="text-sm font-semibold leading-tight">
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {currentTime.toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
