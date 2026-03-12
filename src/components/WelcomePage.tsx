import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Code, Sparkles } from "lucide-react";

interface WelcomePageProps {
  onEnter: () => void;
  name?: string;
  title?: string;
  summary?: string;
}

export default function WelcomePage({
  onEnter,
  name = "Sifiso Madonsela",
  title = "IT Student & Full Stack Developer",
  summary = "Ambitious and motivated IT student with hands-on experience in IT-related work and academic invigilation. Passionate about mobile app development, game design, and hardware optimization.",
}: WelcomePageProps) {
  const skills = [
    "Python",
    "JavaScript",
    "Java",
    "C# (.NET)",
    "Django",
    "Docker",
    "Git & GitHub",
    "Linux",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium">
            Welcome to my Portfolio
          </span>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-6"
        >
          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Hi, I'm {name} 👋
            </h1>
            <p className="text-xl text-blue-400 font-medium">{title}</p>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-sm font-medium">
                Technical Skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>BSc IT Graduate 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Full Stack & Data</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <span>Enter Desktop</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Explore my projects, skills, and experience
        </motion.p>
      </motion.div>
    </div>
  );
}
