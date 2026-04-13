import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Star,
  GitFork,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  forks: number;
  language: string;
  url: string;
  demoUrl?: string;
  image: string;
}

interface Experience {
  id?: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  period: string;
  focus: string;
}

interface Certification {
  id?: string;
  name: string;
  issuer: string;
  year: string;
}

interface ResumeData {
  _id?: string;
  id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function MobileFallback() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [_expandedProject, _setExpandedProject] = useState<string | null>(null);

  const skills = [
    "Python",
    "JavaScript",
    "Java",
    "C# (.NET)",
    "Django",
    "Kivy",
    "Docker",
    "Kubernetes",
    "Git & GitHub",
    "Linux",
    "Apache Kafka",
    "Hadoop",
    "Bash",
    "React",
    "TypeScript",
    "Node.js",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, resumeRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/resume`),
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (resumeRes.ok) {
        const resumeData = await resumeRes.json();
        setResume(resumeData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 safe-area-top"
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {resume?.name?.charAt(0) || "S"}
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white leading-tight">
                {resume?.name?.split(" ")[0] || "Sifiso"}
              </h1>
              <p className="text-xs text-blue-400">Portfolio</p>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors touch-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden bg-gray-800/50 border-t border-gray-700"
        >
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all touch-target ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.nav>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="safe-area-x pb-8"
      >
        {/* Hero Section */}
        <motion.section
          id="home"
          variants={itemVariants}
          className="px-4 pt-8 pb-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-500/50"
            >
              {resume?.name?.charAt(0) || "S"}
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white mb-2">
              {resume?.name || "Sifiso Madonsela"}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-blue-400 mb-4 font-medium">
              {resume?.title || "IT Student & Full Stack Developer"}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto"
            >
              {resume?.summary ||
                "Passionate developer with expertise in building modern applications."}
            </motion.p>

            {/* CTA Button */}
            <motion.a
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              onClick={() => scrollToSection("projects")}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all shadow-lg shadow-blue-500/30 touch-target"
            >
              View My Work
              <ChevronDown className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.section>

        {/* Contact Info */}
        <motion.section variants={itemVariants} className="px-4 pb-6">
          <div className="space-y-3">
            <motion.a
              whileTap={{ scale: 0.98 }}
              href={`mailto:${resume?.email || "sfisomadonsela274@gmail.com"}`}
              className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 transition-all touch-card"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white text-sm truncate font-medium">
                  {resume?.email || "sfisomadonsela274@gmail.com"}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </motion.a>

            <motion.a
              whileTap={{ scale: 0.98 }}
              href={`tel:${resume?.phone || "0820487434"}`}
              className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 transition-all touch-card"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-white text-sm truncate font-medium">
                  {resume?.phone || "082 048 7434"}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </motion.a>

            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 touch-card"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-white text-sm truncate font-medium">
                  {resume?.location || "Bronkhorstspruit, Gauteng, SA"}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section variants={itemVariants} className="px-4 pb-6">
          <div className="flex gap-3">
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="https://github.com/sfisomadonsela274-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 transition-all touch-target font-medium text-sm"
            >
              <Github className="w-5 h-5 text-gray-400" />
              <span className="text-white hidden xs:inline">GitHub</span>
            </motion.a>

            <motion.a
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/sfiso-madonsela-916921397"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 transition-all touch-target font-medium text-sm"
            >
              <Linkedin className="w-5 h-5 text-blue-400" />
              <span className="text-white hidden xs:inline">LinkedIn</span>
            </motion.a>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section id="skills" variants={itemVariants} className="px-4 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-2 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600 rounded-lg text-gray-200 text-xs sm:text-sm font-medium hover:border-blue-500 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        {projects.length > 0 && (
          <motion.section id="projects" variants={itemVariants} className="px-4 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                Projects ({projects.length})
              </h2>
            </div>

            <div className="space-y-3">
              {projects.map((project) => {
                const projectId = project._id || project.id;
                const _isExpanded = _expandedProject === projectId;

                return (
                  <motion.div
                    key={projectId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all touch-card"
                  >
                    {/* Project Image */}
                    {project.image && (
                      <motion.img
                        layoutId={`project-image-${projectId}`}
                        src={project.image}
                        alt={project.title}
                        className="w-full h-40 object-cover"
                      />
                    )}

                    {/* Project Content */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 text-base">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats and Link */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          {project.stars > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {project.stars}
                            </span>
                          )}
                          {project.forks > 0 && (
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" />
                              {project.forks}
                            </span>
                          )}
                        </div>
                        <motion.a
                          whileTap={{ scale: 0.95 }}
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-semibold touch-target"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {resume?.experience && resume.experience.length > 0 && (
          <motion.section id="experience" variants={itemVariants} className="px-4 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">Experience</h2>
            </div>

            <div className="space-y-3">
              {resume.experience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all touch-card"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base">{exp.role}</h3>
                      <p className="text-gray-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {resume?.education && resume.education.length > 0 && (
          <motion.section variants={itemVariants} className="px-4 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Education</h2>
            </div>

            <div className="space-y-3">
              {resume.education.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all touch-card"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base">{edu.degree}</h3>
                      <p className="text-gray-400 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">Focus: {edu.focus}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certifications Section */}
        {resume?.certifications && resume.certifications.length > 0 && (
          <motion.section variants={itemVariants} className="px-4 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Certifications</h2>
            </div>

            <div className="space-y-2">
              {resume.certifications.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 flex items-start justify-between gap-2 hover:border-gray-600 transition-all touch-card"
                >
                  <div>
                    <h3 className="text-white font-semibold text-sm">{cert.name}</h3>
                    <p className="text-gray-400 text-xs">{cert.issuer}</p>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">{cert.year}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact Section */}
        <motion.section id="contact" variants={itemVariants} className="px-4 pb-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Let's Connect</h2>
            <p className="text-gray-300 text-sm mb-4">
              Feel free to reach out for collaboration or opportunities
            </p>
            <div className="flex flex-col gap-2">
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={`mailto:${resume?.email || "sfisomadonsela274@gmail.com"}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all touch-button"
              >
                Send Email
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={`tel:${resume?.phone || "0820487434"}`}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-all touch-button"
              >
                Call Me
              </motion.a>
            </div>
          </div>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900/50 border-t border-gray-800 py-6 px-4 safe-area-bottom text-center"
      >
        <p className="text-gray-500 text-sm">
          © 2025 {resume?.name || "Sifiso Madonsela"}. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Optimized for mobile & desktop devices
        </p>
      </motion.footer>
    </div>
  );
}
