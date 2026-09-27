import { query } from '@/lib/db';
import Link from 'next/link';
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  Terminal,
  Code2,
  CheckCircle2,
  Layers,
  Clock,
  Send,
  Copy,
  Laptop
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from '@/components/Icons';

export const revalidate = 0; // Live fresh data

async function getPortfolioData() {
  try {
    const profileRes = await query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    const projectsRes = await query('SELECT * FROM projects ORDER BY sort_order ASC, id DESC');
    const experiencesRes = await query('SELECT * FROM experiences ORDER BY sort_order ASC, id ASC');
    const skillsRes = await query('SELECT * FROM skill_groups ORDER BY sort_order ASC, id ASC');

    return {
      profile: profileRes.rows[0] || null,
      projects: projectsRes.rows || [],
      experiences: experiencesRes.rows || [],
      skills: skillsRes.rows || [],
    };
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return { profile: null, projects: [], experiences: [], skills: [] };
  }
}

export default async function HomePage() {
  const { profile, projects, experiences, skills } = await getPortfolioData();

  const name = profile?.full_name || 'MUHAMMAD HUZAIFA';
  const title = profile?.title || 'Full-Stack & WordPress Developer';
  const location = profile?.location || 'Karachi, Pakistan';
  const email = profile?.email || 'huzaifamm70@gmail.com';
  
  const whatsappNumber = '923152931751';
  const whatsappDisplay = '03152931751';
  const phoneSecondary = profile?.phone2 || '+92 3032130577';
  
  const github = profile?.github || 'https://github.com/huzaifa-2006-mh';
  const linkedin = profile?.linkedin || 'https://linkedin.com/in/muhammad-huzaifa-mhs';
  const avatarUrl = profile?.avatar_url || '/huzaifa-profile.jpg';
  const bioSummary = profile?.bio_summary || 'Motivated and detail-oriented Full-Stack & WordPress Developer with hands-on experience designing, customizing, and optimizing responsive web applications and websites using MERN stack (MongoDB, Express, React, Node.js), WordPress, Elementor, and WooCommerce.';
  const eduDegree = profile?.education_degree || 'Bachelor of Computer Science';
  const eduInstitution = profile?.education_institution || 'Virtual University of Pakistan (In Progress)';
  const eduDetails = profile?.education_details || 'Focus on software development, databases, and system design. Applying academic knowledge to practical full-stack and modern web development projects.';

  // Real human categorized skills
  const categorizedSkills = [
    {
      label: 'Core Frontend',
      items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3'],
      desc: 'Building responsive, accessible & interactive interfaces'
    },
    {
      label: 'Backend & APIs',
      items: ['Node.js', 'Express.js', 'RESTful APIs', '.NET', 'Authentication', 'Middleware'],
      desc: 'Architecting robust server-side business logic & services'
    },
    {
      label: 'Databases & Storage',
      items: ['MongoDB', 'PostgreSQL (Neon)', 'MySQL', 'Oracle DB', 'Query Optimization'],
      desc: 'Schema design, indexing & reliable transactional storage'
    },
    {
      label: 'WordPress & E-Commerce',
      items: ['WordPress Development', 'Elementor Pro', 'WooCommerce', 'Theme Customization', 'Custom Plugins'],
      desc: 'Full-cycle client branding, shopping carts & CMS portals'
    },
    {
      label: 'DevOps & Workflow',
      items: ['Git & GitHub', 'VS Code', 'Postman API Testing', 'Vercel Deployment', 'Performance & SEO'],
      desc: 'Continuous delivery, clean versioning & site speed tuning'
    },
    {
      label: 'Programming Languages',
      items: ['JavaScript', 'TypeScript', 'C#', 'Java', 'PHP (Basic)', 'Python (Basic)'],
      desc: 'Solid software engineering fundamentals & OOP'
    },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] selection:bg-emerald-500/20 selection:text-emerald-300 font-sans antialiased">
      
      {/* Floating Direct WhatsApp CTA */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-medium text-xs shadow-xl shadow-black/50 border border-emerald-400/30 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <WhatsAppIcon className="w-4 h-4" />
        <span>Chat on WhatsApp</span>
      </a>

      {/* Top Editorial Navbar */}
      <header className="sticky top-0 z-40 bg-[#090b10]/90 backdrop-blur-md border-b border-[#1b2230]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#141923] border border-[#232d3f] flex items-center justify-center font-semibold text-sm text-slate-200 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
              MH
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white group-hover:text-slate-200 transition-colors">
                {name}
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Full-Stack &amp; WordPress Dev
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#work" className="hover:text-white transition-colors">Featured Work</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Header Action */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-medium transition shadow-sm border border-emerald-500/20"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>{whatsappDisplay}</span>
            </a>
            
            <a
              href={`mailto:${email}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#141923] hover:bg-[#1b2230] border border-[#232d3f] text-slate-300 hover:text-white text-xs font-medium transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-24 md:space-y-32">

        {/* HERO SECTION: Human, Grounded & Confident */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-7">
            
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111620] border border-[#1f2937] text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for full-stack &amp; WordPress contracts</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.15]">
                I design &amp; develop modern web applications with speed and precision.
              </h1>
              <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl">
                I&apos;m <span className="text-white font-medium">Muhammad Huzaifa</span>, a developer based in Karachi. I bridge the gap between custom full-stack MERN systems and client-ready WordPress platforms.
              </p>
            </div>

            {/* Quick Human Details (Location, Timezone, Experience) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-[#111622] border border-[#1b2230]">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> Location
                </div>
                <div className="font-semibold text-slate-200 mt-1">Karachi, Pakistan</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#1b2230]">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" /> Timezone
                </div>
                <div className="font-semibold text-slate-200 mt-1">PKT (UTC+5)</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#1b2230] col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Laptop className="w-3 h-3 text-slate-400" /> Focus Stack
                </div>
                <div className="font-semibold text-slate-200 mt-1">MERN &amp; WordPress</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold shadow-md transition flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="#work"
                className="px-5 py-3 rounded-xl bg-[#141923] hover:bg-[#1b2230] border border-[#232d3f] text-slate-200 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>Explore Featured Work</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#141923] hover:bg-[#1b2230] border border-[#232d3f] text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#141923] hover:bg-[#1b2230] border border-[#232d3f] text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Profile Photo Display */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80 md:w-88 rounded-2xl p-2 bg-[#141923] border border-[#232d3f] shadow-2xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0d1017]">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Genuine caption bar */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{name}</div>
                  <div className="text-[11px] text-slate-400">Software Developer</div>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Open for hire
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ABOUT ME SECTION: Real Story & Practical Philosophy */}
        <section id="about" className="pt-8 border-t border-[#1b2230]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                About Me
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Crafting dependable web solutions from Karachi.
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <p>
                {bioSummary}
              </p>
              <p className="text-slate-400 text-sm">
                Whether creating scalable single-page applications with React and Node.js or engineering fast, customized WordPress websites with Elementor and WooCommerce, my focus is always on real business value: clean code architecture, mobile responsiveness, fast loading times, and intuitive user experiences.
              </p>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1b2230]">
                  <div className="text-xs font-bold text-white mb-1">Production-Ready Code</div>
                  <div className="text-xs text-slate-400">Structured controllers, REST APIs, and clean component state.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1b2230]">
                  <div className="text-xs font-bold text-white mb-1">CMS Customization</div>
                  <div className="text-xs text-slate-400">Tailored WordPress themes, WooCommerce catalogs, and custom plugins.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1b2230]">
                  <div className="text-xs font-bold text-white mb-1">Speed &amp; Search (SEO)</div>
                  <div className="text-xs text-slate-400">Optimized asset compression, structured metadata, and responsive layouts.</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURED WORK / PROJECTS: Case-Study Presentation */}
        <section id="work" className="pt-8 border-t border-[#1b2230]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                Portfolio Showcase
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Featured Client &amp; Production Projects
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Each project was built for practical performance, usability, and tailored client branding.
            </p>
          </div>

          {/* Project Cards: Clean, Non-Generic Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: any) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-[#111622] border border-[#1f2937] hover:border-[#374151] transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Browser Window Mockup Frame */}
                  <div className="h-48 w-full bg-[#0d1017] relative overflow-hidden border-b border-[#1b2230]">
                    <img
                      src={proj.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#090b10]/90 border border-white/10 text-[11px] font-medium text-emerald-400">
                      {proj.category || 'Production'}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-4">
                  {/* Tech stack badges */}
                  {proj.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1b2230]">
                      {proj.tech_stack.split(',').map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-[#171e2c] text-[11px] text-slate-300 font-mono"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {proj.live_url ? (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-[#1a2332] hover:bg-[#232f42] text-white text-xs font-medium text-center transition flex items-center justify-center gap-1.5 border border-[#27354a]"
                      >
                        <span>Visit Website</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                    ) : (
                      <span className="flex-1 text-center py-2 text-xs text-slate-500">Internal Project</span>
                    )}

                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#141923] hover:bg-[#1b2230] border border-[#232d3f] text-slate-300 hover:text-white transition"
                        title="View Source Code"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* WORK EXPERIENCE: Clean Editorial Resume Layout */}
        <section id="experience" className="pt-8 border-t border-[#1b2230]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                Career History
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Work Experience &amp; Positions
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Hands-on software development across agencies, startups, and software houses.
            </p>
          </div>

          <div className="space-y-6">
            {experiences.map((exp: any, idx: number) => {
              const bullets = Array.isArray(exp.bullets) ? exp.bullets : (exp.bullets ? exp.bullets.split('\n') : []);

              return (
                <div
                  key={exp.id || idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[#111622] border border-[#1f2937] hover:border-[#2e3b50] transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1b2230]">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-medium text-emerald-400 mt-0.5">
                        {exp.company}
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-[#171e2c] border border-[#243042] px-3 py-1 rounded-full w-fit">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {exp.description}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {bullets.map((point: string, pIdx: number) => (
                        <li key={pIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <span>{point.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* TECHNICAL SKILLS: Authentic Grouping */}
        <section id="skills" className="pt-8 border-t border-[#1b2230]">
          
          <div className="mb-12">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
              Toolkit &amp; Expertise
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Technologies &amp; Competencies
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Tools and technologies used regularly in client deliverables and personal engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categorizedSkills.map((cat, cIdx) => (
              <div
                key={cIdx}
                className="p-5 rounded-2xl bg-[#111622] border border-[#1f2937] space-y-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{cat.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cat.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1b2230]">
                  {cat.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2.5 py-1 rounded-md bg-[#161c28] border border-[#222b3d] text-[11px] font-medium text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* EDUCATION & BACKGROUND */}
        <section id="education" className="pt-8 border-t border-[#1b2230]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                Academic Background
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Education
              </h2>
            </div>

            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#111622] border border-[#1f2937] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-white">{eduDegree}</h3>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded">
                  Currently Enrolled
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-300">{eduInstitution}</div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light pt-1">
                {eduDetails}
              </p>
            </div>
          </div>
        </section>

        {/* DIRECT CONTACT: Practical & Action-Oriented */}
        <section id="contact" className="pt-8 border-t border-[#1b2230]">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-[#1f2937] shadow-2xl space-y-8">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Direct Channels
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Let&apos;s talk about your next project.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                I am actively taking on new development contracts, full-stack projects, and custom WordPress solutions. Message directly on WhatsApp or drop an email.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#141b26] hover:bg-[#1a2332] border border-[#232d3f] hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">WhatsApp / Mobile</div>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {whatsappDisplay}
                </div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                  <span>Chat directly</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${email}`}
                className="p-5 rounded-2xl bg-[#141b26] hover:bg-[#1a2332] border border-[#232d3f] hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Email Address</div>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors break-all">
                  {email}
                </div>
                <div className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1 font-medium">
                  <span>Send an email</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>

              {/* Secondary Phone */}
              <a
                href={`tel:${phoneSecondary}`}
                className="p-5 rounded-2xl bg-[#141b26] hover:bg-[#1a2332] border border-[#232d3f] hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Secondary Contact</div>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">
                  {phoneSecondary}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <span>Voice call</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>

            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1b2230] bg-[#07090d] py-10 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {name}. Built with Next.js &amp; PostgreSQL.
          </div>

          <div className="flex items-center gap-6">
            <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              GitHub
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              LinkedIn
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
              WhatsApp ({whatsappDisplay})
            </a>
            <Link href="/login" className="text-slate-400 hover:text-slate-200 transition">
              Admin
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
