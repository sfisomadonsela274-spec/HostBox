import { motion } from "framer-motion";
import { Award, Calendar, Building2, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  description: string;
  credentialUrl?: string;
  icon: string;
  color: string;
}

export default function CertificatesApp() {
  const certificates: Certificate[] = [
    {
      id: "ibm-fullstack",
      name: "IBM Full Stack Software Development Professional Certificate",
      issuer: "IBM",
      year: "2024",
      description:
        "Comprehensive full-stack development certification covering front-end and back-end technologies, databases, DevOps, and modern development practices.",
      credentialUrl: "https://www.ibm.com/training/certification",
      icon: "💻",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "ibm-data-arch",
      name: "IBM Data Architecture Professional Certificate",
      issuer: "IBM",
      year: "2024",
      description:
        "Professional certification in data architecture covering data modeling, database design, big data technologies, and cloud data solutions.",
      credentialUrl: "https://www.ibm.com/training/certification",
      icon: "🗄️",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "drivers-license",
      name: "Code 10 Driver's Licence",
      issuer: "South African Transport Department",
      year: "2024",
      description:
        "Valid South African Code 10 driver's licence for light motor vehicles, demonstrating mobility and independence for work-related travel.",
      icon: "🚗",
      color: "from-green-500 to-green-700",
    },
  ];

  const stats = [
    {
      label: "Total Certifications",
      value: certificates.length,
      icon: <Award className="w-5 h-5" />,
      color: "text-blue-400",
    },
    {
      label: "Most Recent",
      value: "2024",
      icon: <Calendar className="w-5 h-5" />,
      color: "text-purple-400",
    },
    {
      label: "Professional Certs",
      value: "2",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-green-400",
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Certifications & Licenses
              </h1>
              <p className="text-gray-400 text-sm">
                Professional qualifications and achievements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Certificate Icon/Badge */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}
                  >
                    {cert.icon}
                  </div>

                  {/* Certificate Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {cert.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Building2 className="w-4 h-4" />
                            <span>{cert.issuer}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{cert.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Actions */}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm font-medium border border-blue-500/30"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Credential
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className={`h-1 bg-gradient-to-r ${cert.color}`} />
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">
                Commitment to Learning
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                I continuously invest in professional development to stay current with
                industry trends and best practices. These certifications demonstrate my
                dedication to mastering both technical skills and professional
                competencies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
