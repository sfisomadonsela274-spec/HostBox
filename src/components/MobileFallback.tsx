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
  Monitor,
  ExternalLink,
  Star,
  GitFork,
} from "lucide-react";

interface Project {
  _id?: string;
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
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  focus: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface ResumeData {
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

export default function MobileFallback() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

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
        setProjects(projectsData.slice(0, 6)); // Show top 6 projects
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Desktop View Notice */}
      <div className="bg-blue-600/20 border-b border-blue-500/30 p-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <p className="text-blue-300 text-xs">
              Best viewed on desktop
            </p>
          </div>
          <a
            href="?force-desktop=true"
            className="text-blue-400 text-xs underline"
          >
            View anyway
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-8 px-6"
      >
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
            {resume?.name?.charAt(0) || "S"}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {resume?.name || "Sifiso Madonsela"}
          </h1>
          <p className="text-xl text-blue-400 mb-4">
            {resume?.title || "IT Student & Full Stack Developer"}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {resume?.summary || "Passionate developer with expertise in building modern applications."}
          </p>
        </div>
      </motion.section>

      {/* Contact Info */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 pb-8"
      >
        <div className="max-w-lg mx-auto grid grid-cols-1 gap-3">
          <a
            href={`mailto:${resume?.email || "sfisomadonsela274@gmail.com"}`}
            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-white text-sm truncate">
                {resume?.email || "sfisomadonsela274@gmail.com"}
              </p>
            </div>
          </a>

          <a
            href={`tel:${resume?.phone || "0820487434"}`}
            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-white text-sm truncate">
                {resume?.phone || "082 048 7434"}
              </p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-white text-sm truncate">
                {resume?.location || "Bronkhorstspruit, Gauteng, SA"}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Social Links */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 pb-8"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <a
            href="https://github.com/sfisomadonsela274-spec"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-500"
          >
            <Github className="w-5 h-5 text-gray-400" />
            <span className="text-white text-sm">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sfiso-madonsela-916921397"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500"
          >
            <Linkedin className="w-5 h-5 text-blue-400" />
            <span className="text-white text-sm">LinkedIn</span>
          </a>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-8"
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects */}
      {projects.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 pb-8"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Projects</h2>
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {project.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {project.forks}
                        </span>
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 text-sm"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Experience */}
      {resume?.experience && resume.experience.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 pb-8"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">Experience</h2>
            </div>
            <div className="space-y-4">
              {resume.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{exp.role}</h3>
                      <p className="text-gray-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Education */}
      {resume?.education && resume.education.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="px-6 pb-8"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Education</h2>
            </div>
            <div className="space-y-4">
              {resume.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-gray-400 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{edu.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Focus: {edu.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Certifications */}
      {resume?.certifications && resume.certifications.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-6 pb-12"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Certifications</h2>
            </div>
            <div className="space-y-3">
              {resume.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 flex items-start justify-between"
                >
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {cert.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{cert.issuer}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-6 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Sifiso Madonsela. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            View on desktop for the full interactive experience
          </p>
        </div>
      </footer>
    </div>
  );
}
