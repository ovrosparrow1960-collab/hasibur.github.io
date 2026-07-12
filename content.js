/* ==========================================================================
   YOUR PORTFOLIO CONTENT  —  edit THIS file to change your website.
   --------------------------------------------------------------------------
   • You only ever edit the text between the quotes "like this".
   • To add an item to a list, copy one { ... } block, paste it below,
     and put a comma between blocks.
   • To remove something, delete its { ... } block (and the extra comma).
   • Images: put your image files in the "images" folder, then reference them
     as "images/your-file-name.png".
   • Icons come from Font Awesome — browse names at https://fontawesome.com/icons
     (use the class shown, e.g. "fas fa-rocket" or "fab fa-github").
   • Save the file and refresh your browser to see changes.
   ========================================================================== */

const CONTENT = {

  /* ===== 1. BASIC SITE INFO ===== */
  meta: {
    siteTitle: "Hasibur Rahman Shakil — SciML · CFD · Gas Turbines · Energy Systems",
    description: "Md. Hasibur Rahman Shakil — Mechanical Engineer (BUET) and Assistant Engineer at EGCB, seeking a funded MS/PhD in scientific machine learning, computational fluid mechanics, and energy systems.",
    initials: "HR",                                // small logo in navbar + footer
  },

  /* ===== 2. NAVIGATION MENU ===== */
  nav: [
    { label: "Home",        target: "home" },
    { label: "About",       target: "about" },
    { label: "Research",    target: "research" },
    { label: "Skills",      target: "skills" },
    { label: "Projects",    target: "projects" },
    { label: "Experience",  target: "experience" },
    { label: "Credentials", target: "credentials" },
    { label: "Contact",     target: "contact" },
  ],

  /* ===== 3. HERO (the big intro at the top) ===== */
  hero: {
    greeting: "Hello, I'm",
    name: "Hasibur Rahman Shakil",
    // These titles rotate with a typing animation. Add or remove as you like.
    titles: [
      "Assistant Engineer (Mechanical)",
      "Power Generation Engineer",
      "CFD & Machine Learning Enthusiast",
      "BUET Graduate",
    ],
    description: "Mechanical Engineer (BUET) and Assistant Engineer at EGCB, seeking a funded MS/PhD position. " +
                 "My research bridges physics-based simulation — CFD and energy systems — with scientific machine " +
                 "learning (physics-informed neural networks, neural operators, and equation discovery) to build " +
                 "predictive, data-efficient models for engineering systems.",
    photo: "images/profile.jpg",     // <-- replace with your own photo (see note in chat)
    resumeFile: "",                  // put your CV PDF in this folder, e.g. "resume.pdf", to show a download button
    primaryButtonLabel: "View My Research",
    resumeButtonLabel: "Download CV",
    // Social icons under the intro.
    socials: [
      { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/in/hasibur-rahman-shakil-b261aa150/", label: "LinkedIn" },
      { icon: "fas fa-envelope",    url: "mailto:ovrosparrow1960@gmail.com", label: "Email" },
    ],
  },

  /* ===== 4. ABOUT ===== */
  about: {
    title: "About",
    subtitle: "Mechanical engineering meets scientific machine learning",
    heading: "Mechanical Engineer • Researcher • Prospective MS/PhD Candidate",
    paragraphs: [
      "I am a Mechanical Engineer (BSc, BUET) and Assistant Engineer at Electricity Generation Company of " +
      "Bangladesh (EGCB), where I work on power plant operations and reliable electricity generation. Alongside " +
      "my engineering role, I actively pursue research at the intersection of computational mechanics, machine learning, optimization, and energy.",
      "My research focuses on scientific machine learning — physics-informed neural networks (PINNs), neural " +
      "operators, and data-driven equation discovery — applied to fluid mechanics, energy, and thermofluid systems. " +
      "I am currently seeking a funded MS/PhD position where I can contribute to and grow this research.",
    ],
    photo: "images/profile.jpg",
    // Little animated stats. EDIT these numbers to match you (or set stats: [] to hide).
    stats: [
      { number: 5, suffix: "+", label: "Years Experience" },
      { number: 5, suffix: "",  label: "Certifications" },
      { number: 1, suffix: "",  label: "BUET Degree" },
      { number: 3, suffix: "",  label: "Core Specialties" },
    ],
    ctaLabel: "Let's Connect",
  },

  /* ===== 5. SKILLS =====
     Based on your LinkedIn top skills, certifications, and role.
     EDIT any titles, descriptions, or tags to match yourself. */
  skills: {
    title: "Core Skills",
    subtitle: "Engineering, computation, and machine learning",
    cards: [
      {
        icon: "fas fa-wind",
        title: "Computational Fluid Mechanics",
        desc: "Modeling and simulation of fluid flow and heat transfer.",
        tags: ["CFD", "FEM", "Numerical Methods", "Heat Transfer"],
      },
      {
        icon: "fas fa-brain",
        title: "Machine Learning & AI",
        desc: "Deep learning and neural networks for engineering problems.",
        tags: ["Deep Learning", "Transformers", "Reinforcement Learning", "Keras", "Neural Networks", "DDPM"],
      },
      {
        icon: "fas fa-atom",
        title: "Scientific Machine Learning",
        desc: "Physics-informed and differential-equation-based learning.",
        tags: ["PINN", "Neural ODE", "SINDy (Sparse Regression)", "Diffusion Models", "Universal Differential Equations"],
      },
      {
        icon: "fas fa-dna",
        title: "Optimization",
        desc: "Design and process optimization techniques.",
        tags: ["Genetic Algorithms", "Design Optimization"],
      },
      {
        icon: "fas fa-bolt",
        title: "Power Generation",
        desc: "Operation and control of power plant systems.",
        tags: ["Mark VI Control System", "TCS", "SCADA", "PLC", "Max DNA", "DLN Combustion", "Turbines", "Time Series Analysis"],
      },
      {
        icon: "fas fa-leaf",
        title: "Energy",
        desc: "Sustainable and clean energy technologies.",
        tags: ["Sustainable Energy", "Hydrogen Fuel", "H2 Energy", "NOx Emission"],
      },
      {
        icon: "fas fa-code",
        title: "Programming & Tools",
        desc: "Scientific computing and ML frameworks for engineering.",
        tags: ["Python", "Julia", "C", "PyTorch", "JAX", "NVIDIA PhysicsNeMo", "DeepXDE", "MATLAB"],
      },
      {
        icon: "fas fa-cubes",
        title: "Design & Simulation",
        desc: "CAD, multiphysics simulation, and manufacturing.",
        tags: ["SolidWorks", "Autodesk", "ANSYS Fluent", "COMSOL Multiphysics", "Material Extrusion", "3D Printing"],
      },
    ],
  },

  /* ===== 6. EXPERIENCE ===== */
  experience: {
    title: "Experience",
    subtitle: "Where I've worked",
    items: [
      {
        role: "Assistant Engineer (Mechanical)",
        date: "Mar 2021 – Present",
        company: "Electricity Generation Company of Bangladesh Limited (EGCB) — Dhaka",
        points: [
          "Support power plant operations and maintenance for reliable electricity generation.",
          "Core member of major gas turbine inspections — Hot Gas Path Inspection (HGPI) and Combustion Inspection (CI).",
          "Successfully performed DCT and borescopic inspections.",
          "Designed and implemented a startup interlock for the GBC lube oil pump in the MaxDNA DCS to prevent dry starts.",
        ],
      },
      {
        role: "Plant Engineer",
        date: "Oct 2018",
        company: "Square Pharmaceuticals Limited — Gazipur, Dhaka",
        points: [
          "Plant engineering role supporting manufacturing operations.",
        ],
      },
    ],
  },

  /* ===== 7. PROJECTS / WORK =====
     Replace these with your real projects (CFD studies, ML work, plant
     projects, thesis, etc.). Drop images into the "images" folder and
     reference them, or keep the icon tile for now. */
  projects: {
    title: "Projects",
    subtitle: "Research projects and engineering work",
    items: [
      {
        title: "Activation Function Visualization App",
        desc: "An interactive Streamlit web app to visualize common neural-network activation " +
              "functions and explore how they behave.",
        image: "images/activation-app.svg",
        tags: ["Streamlit", "Python", "Machine Learning", "Visualization"],
        links: [
          { icon: "fas fa-external-link-alt", url: "https://activation-functions-3vz6ofbrsksmqdbipaw2kc.streamlit.app/", title: "Open App" },
        ],
      },
      {
        title: "Double Pipe Heat Exchanger — Design & Fabrication",
        desc: "Designed and built a double-pipe heat exchanger, from CAD modeling through " +
              "fabrication, with heat-transfer analysis.",
        icon: "fas fa-temperature-high",
        tags: ["SolidWorks", "Heat Transfer", "Mechanical Engineering", "MS Excel"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
      {
        title: "Heat Sink Simulation (COMSOL Multiphysics)",
        desc: "Thermal simulation of a heat sink for cooling using COMSOL Multiphysics to " +
              "evaluate heat dissipation performance.",
        images: ["images/heat-sink-1.svg", "images/heat-sink-2.svg"],
        tags: ["COMSOL Multiphysics", "Heat Transfer", "Thermal Simulation"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
      {
        title: "Fluid–Structure Interaction Study",
        desc: "A multiphysics project modeling the fluid–solid structure interface " +
              "(fluid–structure interaction) and its coupled behavior.",
        images: ["images/fsi-1.svg", "images/fsi-2.svg"],
        tags: ["FSI", "Multiphysics", "CFD", "Simulation"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
      {
        title: "Automated Waiter",
        desc: "An automated waiter built for the Electromechanical Design & Practice sessional " +
              "course (Level 3, Term 1), combining mechanical design with Arduino-controlled actuation.",
        icon: "fas fa-robot",
        video: "images/automated-waiter.mp4",
        tags: ["SolidWorks", "Arduino", "Servo Motor", "Belt-Pulley", "Mechanical Engineering"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
      {
        title: "COVID-19 Infection Prediction using SciML",
        desc: "Modeled and predicted COVID-19 infection dynamics using scientific machine learning — " +
              "combining epidemiological models with universal differential equations, and using SINDy " +
              "to discover the unknown governing equations from data.",
        icon: "fas fa-virus-covid",
        tags: ["Scientific ML", "Universal Differential Equations", "SINDy", "Neural ODE", "Julia"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
      {
        title: "Black Hole Dynamics using SciML",
        desc: "Modeled black hole dynamics and gravitational waveforms using scientific machine " +
              "learning, employing universal differential equations to learn the missing physics from data.",
        icon: "fas fa-hurricane",
        tags: ["Scientific ML", "Universal Differential Equations", "Neural ODE", "Gravitational Waves", "Julia"],
        links: [
          { icon: "fas fa-envelope", url: "#contact", title: "Ask me about it" },
        ],
      },
    ],
    ctaLabel: "Connect on LinkedIn",
    ctaUrl: "https://www.linkedin.com/in/hasibur-rahman-shakil-b261aa150/",
  },

  /* ===== 7b. RESEARCH (publications + interests) =====
     Add each paper as a { } block under "publications". "url" links to the
     full paper (ResearchGate, journal, DOI, etc.). Set publications: [] or
     interests: [] to hide either part. */
  research: {
    title: "Research",
    subtitle: "Research statement, interests, and publications",
    // A short research statement — the first thing a prospective supervisor reads.
    statement: "I am a Mechanical Engineer (BUET) seeking a funded MS/PhD position in scientific machine " +
               "learning and computational mechanics. My research bridges physics-based modeling — computational " +
               "fluid mechanics and energy systems — with modern machine learning: physics-informed neural " +
               "networks (PINNs), neural operators (FNO, DeepONet), and data-driven discovery of governing " +
               "equations (SINDy, universal differential equations). My goal is to develop predictive, " +
               "data-efficient surrogate models and digital twins for thermofluid and energy systems, with a " +
               "focus on uncertainty quantification (UQ) and inverse problems. I have a peer-reviewed " +
               "conference publication and am eager to contribute to a research group advancing these directions.",
    interests: [
      "Scientific Machine Learning (PINNs, Neural Operators)",
      "Computational Fluid Mechanics (CFD)",
      "Data-Driven Equation Discovery (SINDy, UDEs)",
      "Uncertainty Quantification (UQ)",
      "Surrogate Modeling",
      "Inverse Problems",
      "Digital Twins & Reduced-Order Modeling",
      "Energy Systems & Exergy Analysis",
      "Optimization with Genetic Algorithms",
    ],
    publications: [
      {
        title: "Performance Enhancement and Economic Assessment of a Fire Tube Boiler Based on Energy and Exergy Analysis",
        venue: "7th International Conference on Mechanical Engineering and Renewable Energy (ICMERE) 2023",
        date: "November 2023",
        location: "Chittagong, Bangladesh",
        url: "https://www.researchgate.net/publication/375828356_PERFORMANCE_ENHANCEMENT_AND_ECONOMIC_ASSESSMENT_OF_A_FIRE_TUBE_BOILER_BASED_ON_ENERGY_AND_EXERGY_ANALYSIS",
      },
    ],
  },

  /* ===== 8. CREDENTIALS (certifications, education, etc.) =====
     Note: a card can show a LOGO image instead of an icon — use "logo".  */
  credentials: {
    title: "Credentials",
    subtitle: "Education, certifications, and training",
    cards: [
      {
        logo: "images/buet-logo.svg",     // shows the BUET logo instead of an icon
        title: "Education",
        items: [
          "BSc in Mechanical Engineering — BUET (2015 – 2019)",
        ],
      },
      {
        icon: "fas fa-certificate",
        title: "Certifications",
        // An item can be plain text, OR { text, url } to make it a clickable link.
        items: [
          { text: "AI for Mechanical Engineers — University of Michigan (Coursera)", url: "https://coursera.org/share/b9ac48dcf34c7e94633d2b6de4921990" },
          "Programming for Everybody (Getting Started with Python)",
          "Introduction to Deep Learning & Neural Networks with Keras",
          "Build Machine Learning Fundamentals",
          "Material Extrusion",
          "Next-Gen Energy Storage — Battery and Hydrogen Technology",
        ],
      },
      {
        icon: "fas fa-star",
        title: "Top Skills",
        items: [
          "Scientific Machine Learning",
          "Neural Operators",
          "Fourier Neural Operator (FNO)",
          "DeepONet",
          "Diffusion Models",
          "Computational Fluid Mechanics",
          "Energy Storage",
          "Power Generation Time Series Analysis",
          "Digital Twins",
        ],
      },
    ],

    /* ---- CERTIFICATE UPLOADS (optional image gallery) ----
       Want to show pictures of your certificates? Do this for each one:
         1) Save the certificate image (or a screenshot) into the "images" folder.
         2) Copy a { } block below and set "image" to your file name.
         3) "url" (optional) links to the credential online (e.g. Coursera/LinkedIn).
       Clicking a certificate opens the full image. Delete the samples once
       you've added your own. Set certificates: [] to hide this whole area. */
    certificates: [
      { title: "Diffusion Models: Introduction to DDPM — Vizuara",              image: "images/certificates/vizuara-ddpm.png",           url: "" },
      { title: "Reinforcement Learning from Scratch: Basics of RL — Vizuara",    image: "images/certificates/vizuara-rl.png",             url: "" },
      { title: "Physics-Informed Neural Networks (PINN) — Vizuara",             image: "images/certificates/pinn-navid.jpeg",            url: "" },
      { title: "Hands-on Deep Learning (MIT)",                                   image: "images/certificates/deep-learning-mit.jpeg",     url: "" },
      { title: "Machine Learning Projects for Industry 4.0 — Udemy",            image: "images/certificates/udemy-1.jpg",                url: "images/certificates/udemy-1.pdf" },
      { title: "Build Self-Driving Cars: AI Genetic Algorithms from Scratch — Udemy", image: "images/certificates/self-driving-ga.jpg",  url: "images/certificates/self-driving-ga.pdf" },
      { title: "Time Series Mastery: Forecasting with ETS, ARIMA & Python — Coursera", image: "images/certificates/time-series-forecasting.jpg", url: "images/certificates/time-series-forecasting.pdf" },
      { title: "Python for Data Analysis: Pandas & NumPy — Coursera",           image: "images/certificates/pandas-numpy.jpg",           url: "images/certificates/pandas-numpy.pdf" },
      { title: "Computational Fluid Mechanics: Airflow Around a Spoiler — Coursera", image: "images/certificates/cfd-spoiler.jpg",       url: "images/certificates/cfd-spoiler.pdf" },
      { title: "Mastering Digital Twins — Coursera",                            image: "images/certificates/digital-twins.jpg",          url: "images/certificates/digital-twins.pdf" },
      { title: "Introduction to Additive Manufacturing Processes — Arizona State University", image: "images/certificates/additive-manufacturing-asu.jpg", url: "images/certificates/additive-manufacturing-asu.pdf" },
      { title: "Next-Gen Energy Storage: Battery & Hydrogen Technology — L&T EduTech", image: "images/certificates/energy-storage-h2.jpg", url: "images/certificates/energy-storage-h2.pdf" },
      { title: "Sodium-ion Batteries: Overview Lecture — Udemy",                image: "images/certificates/udemy-2.jpg",                url: "images/certificates/udemy-2.pdf" },
      { title: "MATLAB Onramp — MathWorks",                                      image: "images/certificates/matlab-onramp.jpg",          url: "images/certificates/matlab-onramp.pdf" },
      { title: "Code in Place — Stanford University",                           image: "images/certificates/code-in-place.jpg",          url: "images/certificates/code-in-place.pdf" },
    ],
  },

  /* ===== 9. CONTACT ===== */
  contact: {
    title: "Contact",
    subtitle: "Open to funded MS/PhD positions and research collaborations. Let's talk.",
    email: "ovrosparrow1960@gmail.com",
    location: "Dhaka, Bangladesh",
    phone: "",                       // add your phone number to show it, e.g. "+880 1XXX XXXXXX"
    socials: [
      { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/in/hasibur-rahman-shakil-b261aa150/", label: "LinkedIn" },
      { icon: "fas fa-envelope",    url: "mailto:ovrosparrow1960@gmail.com", label: "Email" },
    ],
    firstName: "Hasibur",            // used in the auto-filled email: "Hi Hasibur,"
  },

  /* ===== 10. FOOTER ===== */
  footer: {
    text: "Built by Hasibur Rahman Shakil",
  },

};

/* Keep this line at the very bottom — it hands your content to the website.
   (Don't delete it, or the page will show up blank.) */
window.CONTENT = CONTENT;
