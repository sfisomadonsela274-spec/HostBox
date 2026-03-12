import { useState } from "react";
import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onUserEnter: () => void;
}

export default function LandingPage({ onUserEnter }: LandingPageProps) {
  const [isHoveringUser, setIsHoveringUser] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 text-sm font-medium mb-4"
          >
            Portfolio
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-white mb-3"
          >
            Sifiso Madonsela
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-blue-400 font-medium mb-2"
          >
            IT Student & Full Stack Developer
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-gray-400 text-sm"
          >
            Bronkhorstspruit, Gauteng, South Africa
          </motion.p>
        </div>

        <div className="flex justify-center">
          {/* User View Card */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHoveringUser(true)}
            onMouseLeave={() => setIsHoveringUser(false)}
            onClick={onUserEnter}
            className={`w-full text-left bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 p-8 cursor-pointer transition-all ${
              isHoveringUser
                ? "border-blue-500 shadow-2xl shadow-blue-500/20"
                : "border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-600/20 rounded-xl">
                <User className="w-12 h-12 text-blue-400" />
              </div>
              <ArrowRight
                className={`w-6 h-6 text-gray-400 transition-transform ${isHoveringUser ? "translate-x-2" : ""}`}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">User View</h2>
            <p className="text-gray-400 mb-6">
              Browse projects, view skills, and download the resume. Perfect for
              exploring the portfolio.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                View all projects
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Browse skills & experience
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Download resume
              </div>
              <div className="flex items-center gap-2 text-sm text-red-400">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                No editing access
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 mt-8 text-sm"
        >
          Click to explore the portfolio
        </motion.p>
      </motion.div>
    </div>
  );
}
