import { motion } from 'framer-motion';
import { Code2, Server, Database, Terminal, Box, Cpu, Languages } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

export default function SkillsApp() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Programming Languages',
      icon: <Code2 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'Python', level: 85 },
        { name: 'JavaScript', level: 80 },
        { name: 'Java', level: 75 },
        { name: 'C# (.NET)', level: 70 },
        { name: 'Bash Scripting', level: 65 },
      ],
    },
    {
      title: 'Frameworks & Libraries',
      icon: <Server className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Django', level: 80 },
        { name: 'Kivy', level: 75 },
        { name: 'Web Design (HTML/CSS)', level: 78 },
        { name: 'REST APIs', level: 72 },
      ],
    },
    {
      title: 'Data & Big Data',
      icon: <Database className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Apache Kafka', level: 65 },
        { name: 'Apache Hadoop', level: 60 },
        { name: 'Apache Spark', level: 60 },
        { name: 'Data Pipelines', level: 62 },
      ],
    },
    {
      title: 'DevOps & Infrastructure',
      icon: <Terminal className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Git & GitHub', level: 85 },
        { name: 'Docker', level: 72 },
        { name: 'Kubernetes', level: 60 },
        { name: 'Linux (Ubuntu)', level: 75 },
        { name: 'Networking Basics', level: 68 },
      ],
    },
    {
      title: 'Productivity & Tools',
      icon: <Box className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-500',
      skills: [
        { name: 'MS Office Suite', level: 90 },
        { name: 'Windows OS', level: 92 },
        { name: 'Cloud Storage Systems', level: 70 },
        { name: 'Agile / Scrum', level: 78 },
      ],
    },
    {
      title: 'Human Languages',
      icon: <Languages className="w-6 h-6" />,
      color: 'from-indigo-500 to-violet-500',
      skills: [
        { name: 'English', level: 95 },
        { name: 'Afrikaans', level: 75 },
        { name: 'IsiZulu', level: 90 },
        { name: 'SiSwati', level: 85 },
        { name: 'Sepedi', level: 70 },
      ],
    },
  ];

  const currentlyLearning = [
    'React & TypeScript',
    'Node.js & Express',
    'MongoDB',
    'Mobile App Development',
    'Game Development',
  ];

  const certifications = [
    { name: 'IBM Full Stack Software Development', issuer: 'IBM' },
    { name: 'IBM Data Architecture Professional', issuer: 'IBM' },
    { name: 'Code 10 Driver\'s Licence', issuer: 'SA Transport' },
  ];

  return (
    <div className="h-full bg-gray-900 p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Skills & Expertise</h1>
        <p className="text-gray-400">Technologies, tools, and languages I work with</p>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className={`px-4 py-3 bg-gradient-to-r ${category.color}`}>
              <div className="flex items-center gap-2 text-white">
                {category.icon}
                <span className="font-semibold">{category.title}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      className={`h-full bg-gradient-to-r ${category.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mb-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-yellow-400" />
          Certifications & Licences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
            >
              <p className="text-yellow-300 font-medium text-sm">{cert.name}</p>
              <p className="text-gray-400 text-xs mt-1">{cert.issuer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Currently Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          Currently Learning & Building
        </h2>
        <div className="flex flex-wrap gap-2">
          {currentlyLearning.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-lg text-sm border border-blue-500/30"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
