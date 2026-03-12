import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Pencil,
  X,
  Plus,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface ResumeAppProps {
  onRequestAdminLogin?: () => void;
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

const defaultResumeData: ResumeData = {
  name: "Sifiso Sbongiseni Madonsela",
  title: "IT Student & Full Stack Developer",
  email: "sfisomadonsela274@gmail.com",
  phone: "0820487434",
  location: "Bronkhorstspruit, Gauteng, South Africa",
  summary:
    "Ambitious and motivated IT student with hands-on experience in both IT-related work and academic invigilation. Strong foundation in programming, networking, and computer systems. Passionate about mobile app development, game design, and hardware optimization. Skilled communicator with multilingual abilities.",
  experience: [
    {
      company: "Reneilwe Community Learning Center",
      role: "Work Integrated Learning (IT)",
      period: "2025",
      location: "South Africa",
      description:
        "Assisted with IT-related tasks and projects as part of academic WIL program. Applied programming and networking basics in practical scenarios. Gained exposure to real-world IT systems and community-based technology support.",
    },
    {
      company: "Reneilwe Community Learning Center",
      role: "Invigilator",
      period: "2025",
      location: "South Africa",
      description:
        "Supervised examinations and assessments. Ensured compliance with testing procedures and maintained academic integrity. Supported learners during exam sessions.",
    },
  ],
  education: [
    {
      institution: "Richfield Graduate Institute of Technology",
      degree: "BSc Information Technology",
      period: "Completed 2025",
      focus: "Information Technology",
    },
    {
      institution: "Hoërskool Silverton",
      degree: "Grade 12 (National Senior Certificate)",
      period: "2022",
      focus: "Matric",
    },
  ],
  certifications: [
    {
      name: "IBM Full Stack Software Development Professional Certificate",
      issuer: "IBM",
      year: "2024",
    },
    {
      name: "IBM Data Architecture Professional Certificate",
      issuer: "IBM",
      year: "2024",
    },
  ],
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function ResumeApp({ onRequestAdminLogin }: ResumeAppProps) {
  const { isAdmin, adminPassword } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<
    "basic" | "experience" | "education" | "certifications"
  >("basic");

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
      setFormData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching resume:", err);
      setError(
        "Failed to load resume. Make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/resume`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword || "",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      const savedData = await response.json();
      setResumeData(savedData);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving resume:", err);
      alert("Failed to save resume. Please try again.");
    }
  };

  const openModal = () => {
    if (!isAdmin && onRequestAdminLogin) {
      onRequestAdminLogin();
      return;
    }
    setFormData(resumeData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(resumeData);
  };

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", period: "", location: "", description: "" },
      ],
    }));
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", period: "", focus: "" },
      ],
    }));
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "" },
      ],
    }));
  };

  const handleUpdateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading resume...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
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
    <div className="h-full bg-gray-900 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Resume</h1>
          <p className="text-gray-400">
            Your professional profile and work history
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit Resume
        </button>
      </div>

      {/* Resume Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{resumeData.name}</h1>
            <p className="text-xl opacity-90 mb-4">{resumeData.title}</p>
            <div className="flex flex-wrap gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {resumeData.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {resumeData.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {resumeData.location}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 text-white"
      >
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <p>{resumeData.summary}</p>
      </motion.div>

      {/* Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Experience</h2>
        {resumeData.experience.length === 0 ? (
          <p className="text-gray-400">No experience added yet</p>
        ) : (
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-4 text-white"
              >
                <h3 className="text-lg font-semibold mb-1">{exp.role}</h3>
                <p className="text-gray-300 mb-1">{exp.company}</p>
                <p className="text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {exp.period} • {exp.location}
                </p>
                <p className="text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Education</h2>
        {resumeData.education.length === 0 ? (
          <p className="text-gray-400">No education added yet</p>
        ) : (
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-4 text-white"
              >
                <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
                <p className="text-gray-300 mb-1">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  {edu.institution}
                </p>
                <p className="text-sm text-gray-400">
                  {edu.period} • Focus: {edu.focus}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gray-800 rounded-xl p-6 mb-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Certifications</h2>
        {resumeData.certifications.length === 0 ? (
          <p className="text-gray-400">No certifications added yet</p>
        ) : (
          <div className="space-y-4">
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-4 text-white"
              >
                <h3 className="text-lg font-semibold mb-1">{cert.name}</h3>
                <p className="text-gray-300">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Resume</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section Tabs */}
              <div className="flex gap-2 p-4 border-b border-gray-700 overflow-x-auto">
                {[
                  { key: "basic", label: "Basic Info" },
                  { key: "experience", label: "Experience" },
                  { key: "education", label: "Education" },
                  { key: "certifications", label: "Certifications" },
                ].map((section) => (
                  <button
                    key={section.key}
                    onClick={() =>
                      setActiveSection(section.key as typeof activeSection)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeSection === section.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info Section */}
                {activeSection === "basic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Summary
                      </label>
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {activeSection === "experience" && (
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-white font-medium">
                            Experience {index + 1}
                          </h4>
                          <button
                            onClick={() => handleRemoveExperience(index)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "company",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "role",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g., 2020 - Present)"
                          value={exp.period}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "period",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "location",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) =>
                            handleUpdateExperience(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddExperience}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>
                )}

                {/* Education Section */}
                {activeSection === "education" && (
                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-white font-medium">
                            Education {index + 1}
                          </h4>
                          <button
                            onClick={() => handleRemoveEducation(index)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "institution",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "degree",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g., 2015 - 2018)"
                          value={edu.period}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "period",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Focus/Major"
                          value={edu.focus}
                          onChange={(e) =>
                            handleUpdateEducation(
                              index,
                              "focus",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddEducation}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>
                )}

                {/* Certifications Section */}
                {activeSection === "certifications" && (
                  <div className="space-y-4">
                    {formData.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-white font-medium">
                            Certification {index + 1}
                          </h4>
                          <button
                            onClick={() => handleRemoveCertification(index)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) =>
                            handleUpdateCertification(
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Issuer"
                          value={cert.issuer}
                          onChange={(e) =>
                            handleUpdateCertification(
                              index,
                              "issuer",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={cert.year}
                          onChange={(e) =>
                            handleUpdateCertification(
                              index,
                              "year",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddCertification}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="sticky bottom-0 bg-gray-800 border-t border-gray- p-6 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
