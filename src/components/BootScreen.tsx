import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const bootMessages = [
    "Initializing HostBox OS v1.0...",
    "Loading system components...",
    "Mounting file systems...",
    "Starting network services...",
    "Loading user profile...",
    "System ready!",
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Boot messages cycling
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    // Complete boot after progress reaches 100%
    const completeTimer = setTimeout(() => {
      onBootComplete();
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <div className="max-w-2xl w-full px-8">
        {/* HostBox Logo/Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-blue-400 mb-2 font-mono">
            HostBox OS
          </h1>
          <p className="text-gray-500 text-sm font-mono">Version 1.0.0</p>
        </motion.div>

        {/* Boot Messages */}
        <div className="mb-8 h-32">
          <AnimatePresence mode="wait">
            {bootMessages.slice(0, currentMessage + 1).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: idx === currentMessage ? 1 : 0.4, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`font-mono text-sm mb-1 ${
                  idx === currentMessage ? "text-green-400" : "text-gray-600"
                }`}
              >
                <span className="text-gray-500 mr-2">
                  [{new Date().toLocaleTimeString()}]
                </span>
                {msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-gray-400">Loading system...</span>
            <span className="text-blue-400">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-xs font-mono">
            Powered by React • TypeScript • Vite
          </p>
          <p className="text-gray-700 text-xs font-mono mt-1">
            © 2025 Sifiso Madonsela
          </p>
        </motion.div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent animate-scan" />
      </div>
    </div>
  );
}
