import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Desktop, { apps } from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import Window from "./components/Window";
import { WindowState } from "./types";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import LandingPage from "./components/LandingPage";
import WelcomePage from "./components/WelcomePage";
import BootScreen from "./components/BootScreen";
import MobileFallback from "./components/MobileFallback";

import AboutApp from "./components/apps/AboutApp";
import ProjectsApp from "./components/apps/ProjectsApp";
import SkillsApp from "./components/apps/SkillsApp";
import ContactApp from "./components/apps/ContactApp";
import ResumeApp from "./components/apps/ResumeApp";
import PortfolioApp from "./components/apps/PortfolioApp";
import CertificatesApp from "./components/apps/CertificatesApp";

const appIconColors: Record<string, string> = {
  about:        "from-blue-500 to-cyan-500",
  projects:     "from-purple-500 to-pink-500",
  skills:       "from-green-500 to-emerald-500",
  contact:      "from-orange-500 to-red-500",
  resume:       "from-yellow-500 to-amber-500",
  portfolio:    "from-indigo-500 to-violet-500",
  certificates: "from-yellow-500 to-orange-500",
};

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeZIndex, setActiveZIndex] = useState(1);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPowerOffConfirm, setShowPowerOffConfirm] = useState(false);
  const { isAdmin, login, logout } = useAuth();

  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // ── Click-outside to close start menu ──────────────────────────────────────
  useEffect(() => {
    if (!isStartMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const menuEl   = startMenuRef.current;
      const buttonEl = startButtonRef.current;
      if (menuEl && !menuEl.contains(target) && buttonEl && !buttonEl.contains(target)) {
        setIsStartMenuOpen(false);
      }
    };

    // Small delay so the same click that opens the menu doesn't immediately close it
    const id = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStartMenuOpen]);

  // ── Escape key closes start menu ───────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStartMenuOpen) {
        setIsStartMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isStartMenuOpen]);

  // ── Mobile detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const forceDesktop = new URLSearchParams(window.location.search).get('force-desktop') === 'true';
      setIsMobile(mobile && !forceDesktop);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── App component map ───────────────────────────────────────────────────────
  const appComponents: Record<string, React.ReactNode> = {
    about:        <AboutApp />,
    projects:     <ProjectsApp onRequestAdminLogin={() => setIsLoginModalOpen(true)} />,
    skills:       <SkillsApp />,
    contact:      <ContactApp />,
    resume:       <ResumeApp onRequestAdminLogin={() => setIsLoginModalOpen(true)} />,
    portfolio:    <PortfolioApp />,
    certificates: <CertificatesApp />,
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getAppConfig = (appId: string) => apps.find((a) => a.id === appId);

  // ── Window management ───────────────────────────────────────────────────────
  const handleOpenApp = useCallback(
    (appId: string) => {
      const appConfig = getAppConfig(appId);
      if (!appConfig) return;

      setWindows((prev) => {
        const existing = prev.find((w) => w.id === appId);
        if (existing) {
          return prev.map((w) =>
            w.id === appId
              ? { ...w, isMinimized: false, zIndex: activeZIndex + 1 }
              : w,
          );
        }
        const newWindow: WindowState = {
          id: appId,
          title: appConfig.title,
          icon: appConfig.icon,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: activeZIndex + 1,
          position: appConfig.defaultPosition,
          size: appConfig.defaultSize,
        };
        return [...prev, newWindow];
      });

      setActiveZIndex((z) => z + 1);
      setIsStartMenuOpen(false);
    },
    [activeZIndex],
  );

  const handleCloseWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const handleMinimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const handleMaximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const handleFocusWindow = useCallback(
    (windowId: string) => {
      setActiveZIndex((z) => z + 1);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? { ...w, zIndex: activeZIndex + 1, isMinimized: false }
            : w,
        ),
      );
    },
    [activeZIndex],
  );

  const handleDragStop = useCallback(
    (windowId: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, position } : w)),
      );
    },
    [],
  );

  const handleResizeStop = useCallback(
    (windowId: string, size: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, size } : w)),
      );
    },
    [],
  );

  const handleTaskbarWindowClick = useCallback(
    (windowId: string) => {
      const win = windows.find((w) => w.id === windowId);
      if (!win) return;

      if (win.isMinimized) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === windowId
              ? { ...w, isMinimized: false, zIndex: activeZIndex + 1 }
              : w,
          ),
        );
        setActiveZIndex((z) => z + 1);
      } else {
        const maxZ = Math.max(...windows.map((w) => w.zIndex));
        if (win.zIndex === maxZ) {
          // It's already focused — minimise it
          setWindows((prev) =>
            prev.map((w) =>
              w.id === windowId ? { ...w, isMinimized: true } : w,
            ),
          );
        } else {
          // Bring it to front
          setWindows((prev) =>
            prev.map((w) =>
              w.id === windowId ? { ...w, zIndex: activeZIndex + 1 } : w,
            ),
          );
          setActiveZIndex((z) => z + 1);
        }
      }
    },
    [windows, activeZIndex],
  );

  const handleToggleStartMenu = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  // ── Show Desktop: minimise every open window ────────────────────────────────
  const handleShowDesktop = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    setIsStartMenuOpen(false);
  }, []);

  // ── Entry flow ──────────────────────────────────────────────────────────────
  const handleUserEnter = () => {
    logout();
    setTimeout(() => setHasEntered(true), 100);
  };

  const handleLoginSuccess = () => {
    // Stay on desktop after admin login — just close the modal
    setTimeout(() => {
      if (!hasEntered) setHasEntered(true);
    }, 100);
  };

  const handleAdminLogout = () => {
    logout();                      // clear admin status
    setIsStartMenuOpen(false);     // close start menu
    // ✅  Stay on the desktop — do NOT reset hasEntered
  };

  const handlePowerOff = () => {
    setShowPowerOffConfirm(false);
    setIsStartMenuOpen(false);
    setWindows([]);               // close all windows
    logout();                     // clear admin status
    setHasEntered(false);         // go back to landing page
    setHasSeenWelcome(false);     // reset welcome screen too
  };

  // ── Routing ─────────────────────────────────────────────────────────────────
  if (!hasBooted) return <BootScreen onBootComplete={() => setHasBooted(true)} />;
  if (isMobile) return <MobileFallback />;
  if (!hasEntered) return <LandingPage onUserEnter={handleUserEnter} />;
  if (!hasSeenWelcome) return <WelcomePage onEnter={() => setHasSeenWelcome(true)} />;

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900">
      <Desktop onOpenApp={handleOpenApp} />

      {/* Windows layer */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <AnimatePresence>
          {windows.map((window) => (
            <Window
              key={window.id}
              window={window}
              onClose={handleCloseWindow}
              onMinimize={handleMinimizeWindow}
              onMaximize={handleMaximizeWindow}
              onFocus={handleFocusWindow}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
            >
              {appComponents[window.id] ?? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>App not found</p>
                </div>
              )}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowClick={handleTaskbarWindowClick}
        onToggleStartMenu={handleToggleStartMenu}
        isStartMenuOpen={isStartMenuOpen}
        onShowDesktop={handleShowDesktop}
      />

      {/* ── Start Menu ── */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <motion.div
            ref={startMenuRef}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-16 left-2 bg-gray-900/98 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-80 z-[60] overflow-hidden"
          >
            {/* ── User / Admin Banner ── */}
            <div className={`px-4 py-3 flex items-center gap-3 border-b border-gray-700 ${
              isAdmin ? "bg-green-500/10" : "bg-gray-800/50"
            }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold ${
                isAdmin ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"
              }`}>
                {isAdmin ? "🛡" : "👤"}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  {isAdmin ? "Sifiso Madonsela" : "Guest Viewer"}
                </p>
                <p className={`text-xs leading-tight ${isAdmin ? "text-green-400" : "text-gray-500"}`}>
                  {isAdmin ? "Admin — full access" : "Read-only access"}
                </p>
              </div>
            </div>

            {/* ── App Grid ── */}
            <div className="p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold px-1 mb-2">
                Applications
              </p>
              <div className="grid grid-cols-2 gap-1">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleOpenApp(app.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${appIconColors[app.id]} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                      {app.icon}
                    </div>
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors truncate">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Footer Actions ── */}
            <div className="px-3 pb-3 pt-1 border-t border-gray-700/60 space-y-1">
              {isAdmin ? (
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-colors text-left w-full group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-sm">⏏</span>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm font-medium group-hover:text-red-300">
                      Logout
                    </p>
                    <p className="text-gray-500 text-xs">Switch to guest mode</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsStartMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-500/10 hover:border-green-500/30 border border-transparent transition-colors text-left w-full group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">🔒</span>
                  </div>
                  <div>
                    <p className="text-green-400 text-sm font-medium group-hover:text-green-300">
                      Admin Login
                    </p>
                    <p className="text-gray-500 text-xs">Unlock editing access</p>
                  </div>
                </button>
              )}

              {/* Power Off Button */}
              <div className="border-t border-gray-700/60 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowPowerOffConfirm(true);
                    setIsStartMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-colors text-left w-full group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-sm">⏻</span>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm font-medium group-hover:text-red-300">
                      Power Off
                    </p>
                    <p className="text-gray-500 text-xs">Shut down HostBox OS</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power Off Confirmation Modal */}
      <AnimatePresence>
        {showPowerOffConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4"
            onClick={() => setShowPowerOffConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl w-full max-w-md p-6 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-2xl">⏻</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Power Off HostBox OS?
                  </h2>
                  <p className="text-gray-400 text-sm">
                    This will close all open applications and return you to the welcome screen.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPowerOffConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePowerOff}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Power Off
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
