'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  UserCircle,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences' | 'profile'>('projects');

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Project Modal State (Create / Edit)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    description: '',
    live_url: '',
    github_url: '',
    tech_stack: '',
    image_url: '',
  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>('');

  // Experience Modal State (Create / Edit)
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    duration: '',
    description: '',
    bullets: '',
  });

  // Profile Avatar Upload State
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>('');

  // Notification helper
  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Check auth and fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const [profRes, projRes, expRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/experiences')
      ]);

      const profData = await profRes.json();
      const projData = await projRes.json();
      const expData = await expRes.json();

      if (profData.profile) {
        setProfile(profData.profile);
        setAvatarPreview(profData.profile.avatar_url || '/huzaifa-profile.jpg');
        setAvatarUrlInput(profData.profile.avatar_url || '');
      }
      if (projData.projects) setProjects(projData.projects);
      if (expData.experiences) setExperiences(expData.experiences);
    } catch (err: any) {
      console.error(err);
      notify('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Avatar Upload / Update
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setAvatarPreview(data.url);
      setAvatarUrlInput(data.url);
      setProfile((prev: any) => ({ ...prev, avatar_url: data.url }));
      notify('Profile image updated successfully!');
    } catch (err: any) {
      notify(err.message || 'Image upload error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUrlUpdate = async () => {
    if (!avatarUrlInput) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: avatarUrlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAvatarPreview(avatarUrlInput);
      setProfile((prev: any) => ({ ...prev, avatar_url: avatarUrlInput }));
      notify('Avatar URL updated successfully!');
    } catch (err: any) {
      notify(err.message || 'Error updating avatar URL', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Profile Save
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify('Profile information saved successfully!');
    } catch (err: any) {
      notify(err.message || 'Error saving profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Project Modal
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Full Stack MERN',
      description: '',
      live_url: '',
      github_url: '',
      tech_stack: 'React.js, Node.js, Express, MongoDB, Tailwind CSS',
      image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    });
    setProjectImageFile(null);
    setProjectImagePreview('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: any) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || '',
      description: proj.description || '',
      live_url: proj.live_url || '',
      github_url: proj.github_url || '',
      tech_stack: proj.tech_stack || '',
      image_url: proj.image_url || '',
    });
    setProjectImageFile(null);
    setProjectImagePreview(proj.image_url || '');
    setIsProjectModalOpen(true);
  };

  // Upload Project Image
  const handleProjectImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProjectImageFile(file);
    // local preview
    const reader = new FileReader();
    reader.onload = () => setProjectImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save Project (Add or Edit)
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = projectForm.image_url;

      // If user selected an image file, upload it first
      if (projectImageFile) {
        const formData = new FormData();
        formData.append('file', projectImageFile);
        formData.append('type', 'project');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          finalImageUrl = uploadData.url;
        }
      }

      const payload = {
        ...projectForm,
        image_url: finalImageUrl,
      };

      if (editingProject) {
        // Update
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? data.project : p)));
        notify('Project updated successfully!');
      } else {
        // Create
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProjects((prev) => [data.project, ...prev]);
        notify('Project added successfully!');
      }

      setIsProjectModalOpen(false);
    } catch (err: any) {
      notify(err.message || 'Error saving project', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      notify('Project deleted successfully!');
    } catch (err: any) {
      notify(err.message || 'Error deleting project', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Experience Modal
  const openNewExpModal = () => {
    setEditingExp(null);
    setExpForm({
      role: '',
      company: '',
      duration: '',
      description: '',
      bullets: '',
    });
    setIsExpModalOpen(true);
  };

  const openEditExpModal = (exp: any) => {
    setEditingExp(exp);
    const bulletsText = Array.isArray(exp.bullets) ? exp.bullets.join('\n') : (exp.bullets || '');
    setExpForm({
      role: exp.role || '',
      company: exp.company || '',
      duration: exp.duration || '',
      description: exp.description || '',
      bullets: bulletsText,
    });
    setIsExpModalOpen(true);
  };

  // Save Experience (Add or Edit)
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const bulletsArr = expForm.bullets
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        role: expForm.role,
        company: expForm.company,
        duration: expForm.duration,
        description: expForm.description,
        bullets: bulletsArr,
      };

      if (editingExp) {
        const res = await fetch(`/api/experiences/${editingExp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setExperiences((prev) => prev.map((item) => (item.id === editingExp.id ? data.experience : item)));
        notify('Experience updated successfully!');
      } else {
        const res = await fetch('/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setExperiences((prev) => [...prev, data.experience]);
        notify('Experience added successfully!');
      }

      setIsExpModalOpen(false);
    } catch (err: any) {
      notify(err.message || 'Error saving experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Experience
  const handleDeleteExp = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setExperiences((prev) => prev.filter((item) => item.id !== id));
      notify('Experience deleted successfully!');
    } catch (err: any) {
      notify(err.message || 'Error deleting experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080e] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-4" />
        <p className="text-sm">Connecting to Neon PostgreSQL & loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 flex items-center justify-center font-bold">
              H
            </div>
            <div>
              <div className="font-bold text-white text-base flex items-center gap-2">
                <span>Muhammad Huzaifa</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  Admin Control
                </span>
              </div>
              <div className="text-xs text-slate-400">PostgreSQL Live Cloud Sync</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Preview Live Portfolio</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-800/40 hover:bg-red-900/60 text-red-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'projects'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Manage Projects</span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experiences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'experiences'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20">
                {experiences.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span>Profile & Image</span>
            </button>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md text-center">
            <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-3 border-2 border-cyan-500/40">
              <img
                src={avatarPreview || '/huzaifa-profile.jpg'}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-semibold text-white text-sm">{profile?.full_name}</div>
            <div className="text-xs text-cyan-400 mt-0.5">{profile?.title}</div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">{profile?.location}</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Notification Alert */}
          {message && (
            <div
              className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                message.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                  : 'bg-red-950/80 border border-red-800 text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold text-white">Project Showcase Management</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, or remove live projects, descriptions, tech stacks, and demo URLs.
                  </p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl bg-slate-900/70 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition shadow-lg"
                  >
                    <div>
                      {/* Image preview */}
                      <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
                        <img
                          src={proj.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                          alt={proj.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-slate-950/80 text-[11px] font-medium text-cyan-400 border border-white/10">
                          {proj.category || 'Web App'}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-base text-white mb-1.5">{proj.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light mb-3">
                          {proj.description}
                        </p>
                        <div className="text-[11px] text-slate-400 font-mono line-clamp-1 mb-2">
                          <span className="text-cyan-400">Tech:</span> {proj.tech_stack}
                        </div>
                        {proj.live_url && (
                          <a
                            href={proj.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                          >
                            <span>{proj.live_url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditProjectModal(proj)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition flex items-center gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold text-white">Experience & Career History</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage roles, companies, duration, and bullet points displayed on the timeline.
                  </p>
                </div>
                <button
                  onClick={openNewExpModal}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between gap-6 group hover:border-cyan-500/40 transition"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                          {exp.duration}
                        </span>
                        <span className="text-sm font-semibold text-slate-400">{exp.company}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      {exp.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                      )}

                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2">
                          {exp.bullets.map((b: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex md:flex-col items-center justify-end gap-2">
                      <button
                        onClick={() => openEditExpModal(exp)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition flex items-center gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & IMAGE CHANGE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Photo Change Card */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Portfolio Profile Image</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a new photo from your device or specify an image URL.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-xl bg-slate-950">
                      <img
                        src={avatarPreview || '/huzaifa-profile.jpg'}
                        alt="Current Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">Active Portfolio Avatar</span>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    {/* File Upload Button */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Upload New Image from Computer
                      </label>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={saving}
                        className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition flex items-center gap-2 shadow-lg shadow-cyan-600/20"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Photo & Upload</span>
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Quick Preset Switch
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrlInput('/huzaifa-profile.jpg');
                            setAvatarPreview('/huzaifa-profile.jpg');
                            fetch('/api/profile', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ avatar_url: '/huzaifa-profile.jpg' }),
                            });
                            notify('Switched to Studio Professional Portrait');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          Studio Suit Portrait
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrlInput('/huzaifa-original.png');
                            setAvatarPreview('/huzaifa-original.png');
                            fetch('/api/profile', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ avatar_url: '/huzaifa-original.png' }),
                            });
                            notify('Switched to Original Photo');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          Original Photo
                        </button>
                      </div>
                    </div>

                    {/* Or URL input */}
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Or Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={avatarUrlInput}
                          onChange={(e) => setAvatarUrlInput(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={handleAvatarUrlUpdate}
                          disabled={saving}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
                        >
                          Save URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Contact Information Form */}
              <form onSubmit={handleProfileSave} className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Edit Profile & Contact Details</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Updates sync directly to your live portfolio.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile?.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Title</label>
                    <input
                      type="text"
                      value={profile?.title || ''}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={profile?.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Phone</label>
                    <input
                      type="text"
                      value={profile?.phone1 || ''}
                      onChange={(e) => setProfile({ ...profile, phone1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Secondary Phone</label>
                    <input
                      type="text"
                      value={profile?.phone2 || ''}
                      onChange={(e) => setProfile({ ...profile, phone2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
                    <input
                      type="text"
                      value={profile?.github || ''}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile?.linkedin || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={profile?.bio_summary || ''}
                    onChange={(e) => setProfile({ ...profile, bio_summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold transition shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* PROJECT ADD / EDIT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern E-commerce Platform"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack MERN / WordPress"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Express, MongoDB"
                    value={projectForm.tech_stack}
                    onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of features, stack, and outcomes..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://e-commerce-pro-six.vercel.app/"
                    value={projectForm.live_url}
                    onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/huzaifa-2006-mh/repo"
                    value={projectForm.github_url}
                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Project Image: File or URL */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Project Image (Upload from Computer or Paste URL)
                </label>
                
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={projectImageInputRef}
                    accept="image/*"
                    onChange={handleProjectImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => projectImageInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>

                  <span className="text-xs text-slate-500">or enter image URL below</span>
                </div>

                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or uploaded path"
                  value={projectForm.image_url}
                  onChange={(e) => {
                    setProjectForm({ ...projectForm, image_url: e.target.value });
                    setProjectImagePreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />

                {projectImagePreview && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 mt-2 bg-black">
                    <img
                      src={projectImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold transition flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProject ? 'Update Project' : 'Add Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE ADD / EDIT MODAL */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingExp ? 'Edit Experience' : 'Add Work Experience'}
              </h3>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MERN Stack Developer"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ezitech / NovaSeekLLC"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Months / 3 Months"
                    value={expForm.duration}
                    onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="Developed full-stack web applications..."
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bullet Points (Enter one point per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Developed scalable REST APIs...&#10;Integrated dynamic front-end state management...&#10;Optimized database schema..."
                  value={expForm.bullets}
                  onChange={(e) => setExpForm({ ...expForm, bullets: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold transition flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingExp ? 'Update Experience' : 'Add Experience'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
