import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  Linkedin,
} from "lucide-react";

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
  _id?: string;
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

export default function AboutApp() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resume`);
      if (!response.ok) throw new Error("Failed to fetch resume");
      const data = await response.json();
      setResumeData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching resume:", err);
      setError("Failed to load resume data");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!resumeData) return;

    // Create a print-friendly HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resumeData.name} - Resume</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 4px; }
          h2 { font-size: 18px; color: #2563eb; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
          h3 { font-size: 16px; font-weight: 600; color: #1a1a1a; }
          .subtitle { font-size: 16px; color: #6b7280; margin-bottom: 16px; }
          .contact-info { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; font-size: 14px; color: #6b7280; }
          .contact-item { display: flex; align-items: center; gap: 4px; }
          .summary { margin-bottom: 24px; color: #4b5563; }
          .section { margin-bottom: 24px; }
          .item { margin-bottom: 16px; }
          .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
          .item-title { font-weight: 600; color: #1a1a1a; }
          .item-meta { font-size: 14px; color: #6b7280; }
          .item-description { font-size: 14px; color: #4b5563; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill-tag { background: #e5e7eb; padding: 4px 12px; border-radius: 16px; font-size: 14px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${resumeData.name}</h1>
        <p class="subtitle">${resumeData.title}</p>

        <div class="contact-info">
          <span class="contact-item">📧 ${resumeData.email}</span>
          <span class="contact-item">📱 ${resumeData.phone}</span>
          <span class="contact-item">📍 ${resumeData.location}</span>
        </div>

        <h2>Summary</h2>
        <p class="summary">${resumeData.summary}</p>

        ${
          resumeData.experience.length > 0
            ? `
        <h2>Experience</h2>
        ${resumeData.experience
          .map(
            (exp) => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${exp.role}</span>
              <span class="item-meta">${exp.period}</span>
            </div>
            <p class="item-meta">${exp.company} • ${exp.location}</p>
            <p class="item-description">${exp.description}</p>
          </div>
        `,
          )
          .join("")}
        `
            : ""
        }

        ${
          resumeData.education.length > 0
            ? `
        <h2>Education</h2>
        ${resumeData.education
          .map(
            (edu) => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${edu.degree}</span>
              <span class="item-meta">${edu.period}</span>
            </div>
            <p class="item-meta">${edu.institution} • Focus: ${edu.focus}</p>
          </div>
        `,
          )
          .join("")}
        `
            : ""
        }

        ${
          resumeData.certifications.length > 0
            ? `
        <h2>Certifications</h2>
        ${resumeData.certifications
          .map(
            (cert) => `
          <div class="item">
            <span class="item-title">${cert.name}</span>
            <span class="item-meta"> - ${cert.issuer}, ${cert.year}</span>
          </div>
        `,
          )
          .join("")}
        `
            : ""
        }

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    // Open new window with resume content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || "Failed to load resume"}
          </div>
          <button
            onClick={fetchResume}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4 flex items-center justify-center bg-gray-700">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {resumeData.name}
          </h1>
          <p className="text-xl text-blue-400 font-medium">
            {resumeData.title}
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-white font-medium">{resumeData.location}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white font-medium">{resumeData.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-white font-medium">{resumeData.phone}</p>
              </div>
            </div>
          </motion.div>

          <motion.a
            href="https://www.linkedin.com/in/sfiso-madonsela-916921397"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">LinkedIn</p>
                <p className="text-white font-medium">sfiso-madonsela</p>
              </div>
            </div>
          </motion.a>
        </div>

        {/* Bio/Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            About Me
          </h2>
          <p className="text-gray-300 leading-relaxed">{resumeData.summary}</p>
        </motion.div>

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Experience
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{exp.role}</h3>
                      <p className="text-gray-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-gray-400 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{edu.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Focus: {edu.focus}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-white font-medium">{cert.name}</span>
                  <span className="text-gray-400 text-sm">
                    {cert.issuer}, {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Resume as PDF
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
