import pg from 'pg';
const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_Fc6ei0IpVfhQ@ep-crimson-heart-b5ixqxaa-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setup() {
  console.log('Initializing database tables...');

  // 1. Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      tagline TEXT,
      location VARCHAR(255),
      email VARCHAR(255),
      phone1 VARCHAR(50),
      phone2 VARCHAR(50),
      github VARCHAR(255),
      linkedin VARCHAR(255),
      bio_summary TEXT,
      education_degree VARCHAR(255),
      education_institution VARCHAR(255),
      education_details TEXT,
      avatar_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      live_url TEXT,
      github_url TEXT,
      tech_stack TEXT,
      image_url TEXT,
      featured BOOLEAN DEFAULT true,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      description TEXT,
      bullets TEXT[],
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skill_groups (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      skills TEXT[] NOT NULL,
      icon_name VARCHAR(50),
      sort_order INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created successfully.');

  // 2. Seed Admin user (Username: huzaifa, Password: Sedil@1234)
  await pool.query(`
    INSERT INTO admin_users (username, password)
    VALUES ('huzaifa', 'Sedil@1234')
    ON CONFLICT (username) 
    DO UPDATE SET password = EXCLUDED.password;
  `);

  // 3. Seed Profile if empty
  const profileCount = await pool.query('SELECT COUNT(*) FROM profile');
  if (parseInt(profileCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO profile (
        full_name,
        title,
        tagline,
        location,
        email,
        phone1,
        phone2,
        github,
        linkedin,
        bio_summary,
        education_degree,
        education_institution,
        education_details,
        avatar_url
      ) VALUES (
        'MUHAMMAD HUZAIFA',
        'Full-Stack & WordPress Developer',
        'Crafting High-Performance Modern Web Applications & Scalable Digital Experiences',
        'Karachi, Pakistan',
        'huzaifamm70@gmail.com',
        '+92 3032130577',
        '+92 3152931751',
        'https://github.com/huzaifa-2006-mh',
        'https://linkedin.com/in/muhammad-huzaifa-mhs',
        'Motivated and detail-oriented Full-Stack & WordPress Developer with hands-on experience designing, customizing, and optimizing responsive web applications and websites using MERN stack (MongoDB, Express, React, Node.js), WordPress, Elementor, and WooCommerce. Skilled in RESTful API development, theme/plugin customization, mobile responsiveness, SEO basics, and performance optimization. Passionate about delivering user-friendly, high-performing digital solutions through real-world client and personal projects.',
        'Bachelor of Computer Science',
        'Virtual University of Pakistan (In Progress)',
        'Focus on software development, databases, and system design. Applying academic knowledge to practical full-stack and modern web development projects.',
        '/huzaifa-profile.jpg'
      );
    `);
    console.log('Profile seeded.');
  }

  // 4. Seed Projects if empty
  const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
  if (parseInt(projectCount.rows[0].count) === 0) {
    const projectsData = [
      {
        title: 'E-commerce Web Application',
        category: 'Full Stack MERN',
        description: 'Developed a complete e-commerce platform with product inventory management, cart operations, responsive UI, and performance tuning.',
        live_url: 'https://e-commerce-pro-six.vercel.app/',
        github_url: 'https://github.com/huzaifa-2006-mh',
        tech_stack: 'React.js, Node.js, Express, MongoDB, Tailwind CSS, Stripe',
        image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 1
      },
      {
        title: 'Learning Management System (LMS)',
        category: 'Full Stack Web App',
        description: 'Built a scalable LMS featuring user authentication, course enrollment/management, RESTful backend APIs, and structured database models.',
        live_url: 'https://mhlms.vercel.app/',
        github_url: 'https://github.com/huzaifa-2006-mh',
        tech_stack: 'React.js, Node.js, Express, REST APIs, MongoDB',
        image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 2
      },
      {
        title: 'Foundation Website',
        category: 'Educational Portal',
        description: 'Created a structured educational portal featuring intuitive navigation, cross-device responsiveness, and accessibility compliance.',
        live_url: 'https://skilldevelopmentfoundation.com/',
        github_url: '',
        tech_stack: 'WordPress, Elementor, PHP, CSS3, SEO',
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 3
      },
      {
        title: 'Saqib Mind Scientist Website',
        category: 'Personal Branding & UX',
        description: 'Designed a personal branding digital presence with engaging UI/UX layout and content readability optimization.',
        live_url: 'https://saqibmindscientist.com/',
        github_url: '',
        tech_stack: 'WordPress, Custom Design, Mobile Responsive, SEO',
        image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 4
      },
      {
        title: 'Circle Six Website',
        category: 'Corporate Web Presence',
        description: 'Engineered a responsive corporate web presence ensuring multi-device consistency and functional plugin integrations.',
        live_url: 'https://circlesix.pk/',
        github_url: '',
        tech_stack: 'WordPress, Custom Plugins, Elementor Pro, Responsive Design',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 5
      },
      {
        title: 'Animal Feed Salt Website',
        category: 'Industrial & Wholesale CMS',
        description: 'Developed a specialized industrial/wholesale WordPress interface with product catalog, wholesale inquiries, FAQ, blog, and contact channels.',
        live_url: 'https://animalfeedsalt.com/',
        github_url: '',
        tech_stack: 'WordPress, WooCommerce Catalog, Custom Inquiries, Performance Tuned',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        sort_order: 6
      }
    ];

    for (const proj of projectsData) {
      await pool.query(
        `INSERT INTO projects (title, category, description, live_url, github_url, tech_stack, image_url, featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [proj.title, proj.category, proj.description, proj.live_url, proj.github_url, proj.tech_stack, proj.image_url, proj.featured, proj.sort_order]
      );
    }
    console.log('Projects seeded.');
  }

  // 5. Seed Experience if empty
  const expCount = await pool.query('SELECT COUNT(*) FROM experiences');
  if (parseInt(expCount.rows[0].count) === 0) {
    const experiencesData = [
      {
        role: 'MERN Stack Developer',
        company: 'Ezitech',
        duration: '5 Months',
        description: 'Developed and maintained full-stack web applications utilizing MongoDB, Express.js, React.js, and Node.js.',
        bullets: [
          'Developed and maintained full-stack web applications utilizing MongoDB, Express.js, React.js, and Node.js, delivering scalable solutions tailored to real-world client requirements.',
          'Designed and implemented RESTful backend services to support seamless data exchange between client and server layers.',
          'Integrated dynamic front-end state management to ensure smooth, responsive, and reliable user experiences across the application.',
          'Optimized database collection queries and schema design to improve overall application performance and reduce response times.',
          'Collaborated closely with team members throughout the development lifecycle, from planning and coding to testing and deployment.'
        ],
        sort_order: 1
      },
      {
        role: 'WordPress Developer',
        company: 'Skill Development Council',
        duration: 'Ongoing / Project',
        description: 'Designed and developed dynamic WordPress websites using Elementor, tailoring themes and plugins.',
        bullets: [
          'Designed and developed dynamic WordPress websites using Elementor, tailoring themes and plugins to align with specific client requirements and branding goals.',
          'Customized existing templates and built new page layouts to enhance usability and visual appeal across multiple client projects.',
          'Ensured full mobile responsiveness so that websites performed consistently across desktop, tablet, and mobile devices.',
          'Implemented on-page SEO fundamentals, including meta tags, structured headings, and optimized content, to improve search visibility.',
          'Monitored and optimized site performance metrics such as load speed and image compression to enhance the overall user experience.'
        ],
        sort_order: 2
      },
      {
        role: 'Full Stack Developer',
        company: 'The Tech Creator',
        duration: '3 Months',
        description: 'Developed and maintained full-stack web solutions built on React frontend and Node.js/Express backend architectures.',
        bullets: [
          'Developed and maintained full-stack web solutions built on React frontend and Node.js/Express backend architectures.',
          'Built reusable React components and structured application state to keep the frontend maintainable and scalable.',
          'Designed and implemented backend routes and controllers using Express.js to handle core business logic.',
          'Managed database connectivity and schema design, ensuring reliable data storage and retrieval for key application features.',
          'Integrated third-party and internal APIs to support live transactional features and real-time data updates.'
        ],
        sort_order: 3
      },
      {
        role: 'WordPress Developer',
        company: 'NovaSeekLLC',
        duration: '3 Months',
        description: 'Built and tailored custom WordPress business sites for clients across different industries.',
        bullets: [
          'Built and tailored custom WordPress business sites for clients across different industries, focusing on clean and professional design.',
          'Focused on responsive layouts that adapt seamlessly across desktop, tablet, and mobile screen sizes.',
          'Ensured strong mobile compatibility by testing and refining site elements across various devices and browsers.',
          'Applied speed optimization techniques, including image compression and caching, to improve page load times.',
          'Worked directly with clients to gather requirements and deliver websites that matched their business goals and branding.'
        ],
        sort_order: 4
      }
    ];

    for (const exp of experiencesData) {
      await pool.query(
        `INSERT INTO experiences (role, company, duration, description, bullets, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [exp.role, exp.company, exp.duration, exp.description, exp.bullets, exp.sort_order]
      );
    }
    console.log('Experiences seeded.');
  }

  // 6. Seed Skills
  const skillsCount = await pool.query('SELECT COUNT(*) FROM skill_groups');
  if (parseInt(skillsCount.rows[0].count) === 0) {
    const skillsGroups = [
      { category: 'Frontend', skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS', 'Next.js'], icon_name: 'Layout', sort_order: 1 },
      { category: 'Backend', skills: ['Node.js', 'Express.js', 'RESTful APIs', '.NET'], icon_name: 'Server', sort_order: 2 },
      { category: 'Databases', skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Oracle'], icon_name: 'Database', sort_order: 3 },
      { category: 'CMS & Platforms', skills: ['WordPress', 'Elementor Pro', 'WooCommerce', 'Plugin Customization', 'Theme Customization'], icon_name: 'Layers', sort_order: 4 },
      { category: 'Tools & DevOps', skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vercel'], icon_name: 'Wrench', sort_order: 5 },
      { category: 'Languages', skills: ['JavaScript', 'TypeScript', 'C#', 'Java', 'PHP (Basic)', 'Python (Basic)'], icon_name: 'Code2', sort_order: 6 }
    ];

    for (const sg of skillsGroups) {
      await pool.query(
        `INSERT INTO skill_groups (category, skills, icon_name, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [sg.category, sg.skills, sg.icon_name, sg.sort_order]
      );
    }
    console.log('Skill groups seeded.');
  }

  console.log('Database initialization completed successfully!');
  await pool.end();
}

setup().catch((e) => {
  console.error('Setup error:', e);
  process.exit(1);
});
