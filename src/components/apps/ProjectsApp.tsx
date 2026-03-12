import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  Code2,
  Globe,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

interface Project {
  _id?: string;
  id?: number;
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

const defaultProjectImage =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop";

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "C++",
  "C#",
];

interface ProjectFormData {
  title: string;
  description: string;
  tags: string;
  stars: string;
  forks: string;
  language: string;
  url: string;
  demoUrl: string;
  image: string;
}

const defaultFormData: ProjectFormData = {
  title: "",
  description: "",
  tags: "",
  stars: "0",
  forks: "0",
  language: "TypeScript",
  url: "",
  demoUrl: "",
  image: defaultProjectImage,
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ProjectsAppProps {
  onRequestAdminLogin?: () => void;
}

export default function ProjectsApp({ onRequestAdminLogin }: ProjectsAppProps) {
  const { isAdmin, adminPassword } = useAuth();



  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = [
    "all",
    "React",
    "Vue.js",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
  ];

  // Fetch projects from API on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchGitHubRepos = async (): Promise<Project[]> => {
    try {
      const response = await fetch(
        "https://api.github.com/users/sfisomadonsela274-spec/repos?sort=updated&per_page=10"
      );
      if (!response.ok) return [];

      const repos = await response.json();

      return repos.map((repo: any) => ({
        _id: `github-${repo.id}`,
        title: repo.name,
        description: repo.description || "No description provided",
        tags: repo.topics || [repo.language].filter(Boolean),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Unknown",
        url: repo.html_url,
        demoUrl: repo.homepage || undefined,
        image: repo.owner.avatar_url || defaultProjectImage,
      }));
    } catch (err) {
      console.error("Error fetching GitHub repos:", err);
      return [];
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // Fetch from both sources in parallel
      const [dbResponse, githubRepos] = await Promise.all([
        fetch(`${API_URL}/projects`).catch(() => null),
        fetchGitHubRepos(),
      ]);

      let dbProjects: Project[] = [];
      if (dbResponse && dbResponse.ok) {
        dbProjects = await dbResponse.json();
      }

      // Merge projects, prioritizing manually added ones
      const allProjects = [...dbProjects];

      // Add GitHub repos that aren't already in the database
      githubRepos.forEach((ghRepo) => {
        const exists = dbProjects.some(
          (p) => p.url === ghRepo.url || p.title.toLowerCase() === ghRepo.title.toLowerCase()
        );
        if (!exists) {
          allProjects.push(ghRepo);
        }
      });

      setProjects(allProjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(
        "Failed to load projects. Make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) =>
          p.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase()),
          ),
        );

  const handleOpenModal = (project?: Project) => {
    // Check if user is admin when trying to add new project
    if (!project) {
      if (!isAdmin && onRequestAdminLogin) {
        onRequestAdminLogin();
        return;
      }
    }

    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        tags: project.tags.join(", "),
        stars: project.stars.toString(),
        forks: project.forks.toString(),
        language: project.language,
        url: project.url,
        demoUrl: project.demoUrl || "",
        image: project.image,
      });
    } else {
      setEditingProject(null);
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      stars: parseInt(formData.stars) || 0,
      forks: parseInt(formData.forks) || 0,
      language: formData.language,
      url: formData.url || "#",
      demoUrl: formData.demoUrl || undefined,
      image: formData.image || defaultProjectImage,
    };

    try {
      let response;
      if (editingProject?._id) {
        // Update existing project
        response = await fetch(`${API_URL}/projects/${editingProject._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPassword || "",
          },
          body: JSON.stringify(projectData),
        });
      } else {
        // Create new project
        response = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPassword || "",
          },
          body: JSON.stringify(projectData),
        });
      }

      if (!response.ok) throw new Error("Failed to save project");

      const savedProject = await response.json();

      if (editingProject?._id) {
        setProjects(
          projects.map((p) =>
            p._id === editingProject._id ? savedProject : p,
          ),
        );
      } else {
        setProjects([savedProject, ...projects]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": adminPassword || "",
        },
      });

      if (!response.ok) throw new Error("Failed to delete project");

      setProjects(projects.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchProjects}
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
          <h1 className="text-2xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-gray-400">
            A collection of my open source projects and applications
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
            isAdmin
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
          }`}
          title={isAdmin ? "Add a new project" : "Login as admin to add projects"}
        >
          {isAdmin ? (
            <Plus className="w-4 h-4" />
          ) : (
            <span className="text-xs">🔒</span>
          )}
          Add Project
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group relative"
            >
              {/* Edit/Delete Actions - Admin only */}
              {isAdmin ? (
                <div className="absolute top-3 left-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal(project)}
                    className="p-2 bg-gray-900/90 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Edit Project"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteConfirm(project._id!)}
                    className="p-2 bg-gray-900/90 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : null}

              {/* Project Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={project.image || defaultProjectImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

                {/* Language Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-gray-900/80 rounded-md text-xs text-gray-300 flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  {project.language}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats & Links */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {project.forks}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Live Demo"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your filter or add a new project
          </p>
          <button
            onClick={() => handleOpenModal()}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
              isAdmin
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
            }`}
            title={isAdmin ? "Add a new project" : "Login as admin to add projects"}
          >
            {isAdmin ? (
              <Plus className="w-4 h-4" />
            ) : (
              <span className="text-xs">🔒</span>
            )}
            {isAdmin ? "Add Your First Project" : "Login to Add Projects"}
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="My Awesome Project"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="A brief description of your project..."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://myproject.demo.com"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stars
                    </label>
                    <input
                      type="number"
                      name="stars"
                      value={formData.stars}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Forks
                    </label>
                    <input
                      type="number"
                      name="forks"
                      value={formData.forks}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingProject ? "Save Changes" : "Add Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Project?
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
