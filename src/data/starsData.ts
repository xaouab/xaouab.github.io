// src/data/starsData.ts

import type { PlanetFeature } from '../scene/PlanetFeatures';
import type { PlanetStyle } from '../scene/planetSurfaces';

type lang = 'fr' | 'en';

interface ContentData {
    
    description: string;
    items: Array<{
        title: string;
        subtitle?: string;
        description: string;
        images?: string[];
        links: Array<{
            text: string;
            link: string;
        }>;
    }>;
}

export interface StarData {
  id: string;
  position: [number, number, number];
  title: {
    en: string;
    fr: string;
  };
  code: string;
  color: string;
  /** Painted surface of the planet. */
  surface: PlanetStyle;
  /** Rings, moons and other decorations. */
  features: PlanetFeature[];
  content: {
    [P in lang]: ContentData;
  };
}

export const starsData: StarData[] = [
  {
    id: 'whoami',
    position: [0, 23, 8],
    title: { en: 'Who am I?', fr: 'Qui suis-je?' },
    code: 'WHOAMI-001',
    color: '#ffcf5f',
    surface: 'dunes',
    features: [{ kind: 'clouds' }],
    content: {
      en: {
        description: "[pulse]Hello and welcome to my orbit.[/pulse] This section is a quick personal briefing before you visit the rest of the system (yes, I still build weird things just because they sound fun).",
        items: [
          {
            title: 'Aouab Admou',
            subtitle: 'Space Systems & Cybersecurity Engineer at JAOPS',
            description: "[img=/img/me.webp]\nHello, I am Aouab (pronounced ah-web, yes, like the web). I am a software engineer and computer science student specializing in cybersecurity, currently working on space mission control systems at JAOPS. I enjoy building systems that are both technical and playful.\n\nI started learning by myself in middle school: first programming, then design, then music. Beyond engineering I still have a strong creative side: music production, audio engineering, design, storytelling and songwriting. That mix shaped how I approach software today. I care about engineering quality, but I also care about user feeling, visual clarity, and personality in products.\n\nMost of my work sits at the intersection of space systems, security, real-time backends and interactive frontends. I enjoy problems where architecture matters: mission control software, secure infrastructure, telemetry pipelines, multiplayer networking and 3D visualization.\n\nOutside coding, I am a big fan of astronomy and aviation, that's probably why this website looks like this :) it is both my style and a reflection of the kind of systems thinking I enjoy.\n\nIf this is your first visit, feel free to explore each planet. Every one of them contains real projects, work missions, and technical details.",
            links: [
              { text: 'Download English Resume', link: '/resume/Aouab Admou - English Resume.pdf' },
              { text: 'Download French Resume', link: '/resume/Aouab Admou - CV FR.pdf' },
            ],
          },
          {
            title: 'Education',
            subtitle: 'INSA Toulouse, 5th year · TLS-SEC & Paul Sabatier',
            description: "I am a fifth-year engineering student at [b]INSA Toulouse[/b] (2022 - 2027), in the Computer Engineering & Networks department.\n\nFor this final year I joined the [b]TLS-SEC[/b] cybersecurity specialty, a program shared between three Toulouse engineering schools ([b]INSA Toulouse[/b], [b]Toulouse INP-ENSEEIHT[/b] and [b]ENAC[/b]), which leads to an engineer's degree specialized in cybersecurity (2026 - 2027).\n\nIn parallel, I am completing a [b]double degree[/b]: a Master's in Cybersecurity & Networks at [b]Université Paul Sabatier Toulouse III[/b] (2026 - 2027).\n\nBefore INSA:\n- [b]ISIS Engineering School[/b], Computer Science and Health Systems (2021 - 2022)\n- [b]Elaraki International School[/b], High School Diploma, Mathematics & Engineering option (2014 - 2021)",
            links: [],
          },
        ],
      },
      fr: {
        description: "[greenpoint] [pulse][color=lightgreen]Bienvenue dans mon univers.[/color][/pulse] Petit briefing avant de visiter le reste du portfolio (oui, je code aussi des trucs juste parce que l'idee est marrante).",
        items: [
          {
            title: 'Aouab Admou',
            subtitle: 'Ingénieur systèmes spatiaux & cybersécurité chez JAOPS',
            description: "[img=/img/me.webp]\nSalut, moi c'est Aouab (prononce ah-web, comme le web). Je suis ingenieur logiciel et etudiant en informatique specialise en cybersecurite, et je travaille actuellement sur des systemes de controle de missions spatiales chez JAOPS. J'aime construire des projets techniques avec une vraie identite visuelle.\n\nJ'ai commence en autodidacte au college: code, dessin, musique. J'ai toujours un vrai cote creatif: production musicale, ingenierie du son, design, storytelling et ecriture de chansons. Ce melange influence encore ma facon de travailler. Je cherche toujours un bon equilibre entre architecture solide, performance, et experience utilisateur.\n\nJe travaille surtout sur des systemes spatiaux, la securite, le backend temps reel et les interfaces interactives: logiciels de controle mission, infrastructures securisees, telemetrie, reseau multijoueur et visualisation 3D.\n\nJe suis aussi passionne d'astronomie et d'aviation, d'ou le theme spatial de ce portfolio. Ce n'est pas juste decoratif: c'est aussi ma maniere de raconter mon parcours.\n\nSi c'est ta premiere visite, explore les planetes: chacune contient des missions concretes, des projets livrables et des details techniques.",
            links: [
              { text: 'Télécharger mon CV en Francais', link: '/resume/Aouab Admou - CV FR.pdf' },
              { text: 'Télécharger mon CV en Anglais', link: '/resume/Aouab Admou - English Resume.pdf' }
            ],
          },
          {
            title: 'Formation',
            subtitle: 'INSA Toulouse, 5e année · TLS-SEC & Paul Sabatier',
            description: "Je suis en cinquieme annee d'ecole d'ingenieur a l'[b]INSA Toulouse[/b] (2022 - 2027), dans le departement Informatique & Reseaux.\n\nPour cette derniere annee, j'ai integre la specialite cybersecurite [b]TLS-SEC[/b], une formation partagee entre trois ecoles d'ingenieurs toulousaines ([b]INSA Toulouse[/b], [b]Toulouse INP-ENSEEIHT[/b] et [b]ENAC[/b]), qui mene a un diplome d'ingenieur specialise en cybersecurite (2026 - 2027).\n\nEn parallele, je suis en [b]double diplome[/b] avec le master Cybersecurite & Reseaux de l'[b]Université Paul Sabatier Toulouse III[/b] (2026 - 2027).\n\nAvant l'INSA:\n- [b]École d'ingénieurs ISIS[/b], Informatique et systemes de sante (2021 - 2022)\n- [b]Elaraki International School[/b], baccalaureat, option Mathematiques & Sciences de l'ingenieur (2014 - 2021)",
            links: [],
          },
        ],
      },
    },
  },
  {
    id: 'experience',
    position: [-12, 10, -8],
    title: { en: 'Work Experience', fr: 'Expérience professionnelle' },
    code: 'WORK-002',
    color: '#ff6b6b',
    surface: 'cratered',
    features: [
      {
        kind: 'moons',
        moons: [
          { radius: 1.75, size: 0.11, speed: 0.35, tilt: 0.5, phase: 0 },
          { radius: 2.3, size: 0.07, speed: -0.22, tilt: -0.35, phase: 2.4 },
        ],
      },
    ],
    content: {
      en: {
        description: "From [b]Tokyo[/b] to [b]Brussels[/b] to [b]Toulouse[/b], I have shipped mission control software, secured ground infrastructure and built products across web, games and data (while trying not to anger production at 3 AM).",
        items: [
          {
            title: 'Space Systems & Cybersecurity Engineer',
            subtitle: 'JAOPS, Tokyo · Sep 2026 - Present',
            description: "[orangepoint][b] MISSION IN PROGRESS[/b]\n\nI work on the development and security of mission-critical software for space mission control systems.\n\n- Developing and improving Yamcs and the Grafana-Yamcs integration, with a focus on performance, reliability, observability and mission-specific capabilities\n- DevOps and DevSecOps deployment of JAOPS software across cloud, mission control center and customer on-premise environments\n- Strengthening software and infrastructure security: security audits, attack-surface reduction, authentication, user management, access control and secure data flows\n- Securing Mission Control Center infrastructure and ground-space communications, including emerging standards such as CySAT encryption\n- Developing and open-sourcing a Robot OS 2 interface for Yamcs Gateway: architecture, Rust/ROS 2 bindings, testing, CI, deployment and validation with partners\n- Contributing to project management and company-level technical decisions, with direct feedback to the CEO and CMO on direction, technology choices and priorities",
            links: [],
          },
          {
            title: 'Space Systems Software Engineer',
            subtitle: 'JAOPS, Tokyo · Jun 2026 - Sep 2026',
            description: "[greenpoint][b] MISSION COMPLETE[/b]\n\n- Design, development and testing of new features for space mission software such as Yamcs and its Grafana integration\n- Built and iterated on the DevSecOps infrastructure, CI/CD pipelines and performance benchmarking\n- Analysed software vulnerabilities, reduced the attack surface and implemented secure protocols and algorithms\n- Deployed software in customer environments and supported them through adoption",
            links: [],
          },
          {
            title: 'Fullstack Software Engineer, Mission Control',
            subtitle: 'JAOPS, Tokyo · Dec 2024 - Jun 2026',
            description: "[greenpoint][b] MISSION COMPLETE[/b]\n\nAs part of my initial contract with JAOPS, I led the development of an open-source Grafana 13 app plugin integrating the modern mission control software Yamcs.\n\n- Fast and reliable telemetry updates\n- A robust commanding panel and a telemetry image panel\n- A set of mission control tools for operators\n\nThe plugin was tested at the Space Robotics Lab in Sendai, Japan, on real operator use cases. It also built directly on my work at Space Apps in Brussels, which let me move fast from day one.\n\n[img=/img/jaops-grafana.webp]",
            links: [
              { text: 'View Project GitHub Repo', link: 'https://github.com/jaops-space/grafana-yamcs-jaops' },
            ],
          },
          {
            title: 'Fullstack Space Software Intern',
            subtitle: 'Space Applications Services, Brussels · Jul 2024 - Oct 2024',
            description: "[greenpoint][b] MISSION COMPLETE[/b]\n\nI contributed to Yamcs core mission control software and observability, across mission operations tooling, telemetry visualization and ground-segment software.\n\n- Developed a Grafana 11 integration for Yamcs, with a custom data source and a real-time 3D spacecraft and Earth visualization\n- Enhanced mission control interfaces and upgraded the Yamcs spacecraft simulator for new operational use cases\n- Contributed to cloud/SaaS infrastructure, containerization and deployment workflows\n- Deployed and validated mission software at the ICE Cubes Mission Control Centre, turning operator feedback into improvements and documentation\n\nTechnologies: Yamcs, Grafana, React, Three.js, Go, Docker, Cloud/SaaS.\n\n[img=/img/spaceapps.webp]",
            links: [],
          },
          {
            title: 'Part-time Freelance Software Engineer',
            subtitle: 'Self-employed · Jan 2023 - Dec 2025',
            description: "[greenpoint][b] MISSION COMPLETE[/b]\n\nThree years of part-time missions for multiple clients, with short iteration cycles and changing requirements:\n\n- Web development with React and native HTML/JS/CSS\n- Desktop apps with Electron, and API bots for Discord and Twitter in TypeScript\n- Back ends with Node Express and Java Spring on MongoDB/PostgreSQL\n- TCP/UDP/WebSocket servers in Java and Node\n- DLL extensions in C++ and C#\n- Game development with GameMaker and Unity\n\nOn one confidential multiplayer mission, I designed a compact data interchange format inspired by Relaxed JSON, with the parser and crawler tooling to make services and game logic interoperate.",
            links: [],
          },
          {
            title: 'AI Pricing Intelligence & Data Engineering Intern',
            subtitle: 'PAARLY, Toulouse · Jun 2023 - Jul 2023',
            description: "[greenpoint][b] MISSION COMPLETE[/b]\n\n- Built web scraping and data extraction pipelines to collect, structure and process large-scale competitive pricing data\n- Developed and integrated AI/ML pricing intelligence tools for product matching, market analysis and price monitoring\n- Data processing, automation and backend development supporting competitive intelligence and dynamic pricing",
            links: [],
          },
          {
            title: 'Production Assistant',
            subtitle: 'ADVEEZ, Toulouse · Jan 2022 - Feb 2022',
            description: "[purplepoint][b] INITIAL MISSION (COMPLETE)[/b]\n\nMy first professional experience, assisting in the production of electronic solutions as well as management and logistics. It gave me a complete view of industrial product delivery beyond pure coding.\n\nI discovered how an electronics company serving major airports coordinates:\n- Inventory and component traceability\n- Production and assembly workflows\n- Shipping and deployment logistics\n- Device preparation, configuration and software touchpoints",
            links: [],
          },
        ],
      },
      fr: {
        description: "De [b]Tokyo[/b] a [b]Bruxelles[/b] en passant par [b]Toulouse[/b], j'ai livre des logiciels de controle mission, securise des infrastructures sol et construit des produits web, jeux et data (avec le moins possible de surprises a 3h du matin).",
        items: [
          {
            title: 'Ingénieur systèmes spatiaux & cybersécurité',
            subtitle: 'JAOPS, Tokyo · sept. 2026 - aujourd’hui',
            description: "[orangepoint][b] MISSION EN COURS[/b]\n\nJe travaille sur le developpement et la securite de logiciels critiques pour les systemes de controle de missions spatiales.\n\n- Developpement et amelioration de Yamcs et de l'integration Grafana-Yamcs: performance, fiabilite, observabilite et fonctionnalites specifiques aux missions\n- Deploiement DevOps et DevSecOps des logiciels JAOPS en cloud, en centre de controle mission et chez les clients (on-premise)\n- Renforcement de la securite logicielle et infrastructure: audits, reduction de la surface d'attaque, authentification, gestion des utilisateurs, controle d'acces et flux de donnees securises\n- Securite de l'infrastructure du Mission Control Center et des communications sol-espace, dont des standards emergents comme le chiffrement CySAT\n- Developpement et publication open source d'une interface Robot OS 2 pour Yamcs Gateway: architecture, bindings Rust/ROS 2, tests, CI, deploiement et validation avec les partenaires\n- Participation a la gestion de projet et aux decisions techniques de l'entreprise, avec des retours directs au CEO et au CMO sur la direction, les choix technologiques et les priorites",
            links: [],
          },
          {
            title: 'Ingénieur logiciel systèmes spatiaux',
            subtitle: 'JAOPS, Tokyo · juin 2026 - sept. 2026',
            description: "[greenpoint][b] MISSION TERMINEE[/b]\n\n- Conception, developpement et tests de nouvelles fonctionnalites pour les logiciels de mission spatiale comme Yamcs et son integration Grafana\n- Mise en place et amelioration continue de l'infrastructure DevSecOps, des pipelines CI/CD et des benchmarks de performance\n- Analyse des vulnerabilites, reduction de la surface d'attaque et mise en oeuvre de protocoles et algorithmes securises\n- Deploiement chez les clients et accompagnement jusqu'a l'adoption",
            links: [],
          },
          {
            title: 'Ingénieur logiciel fullstack, contrôle mission',
            subtitle: 'JAOPS, Tokyo · déc. 2024 - juin 2026',
            description: "[greenpoint][b] MISSION TERMINEE[/b]\n\nDans le cadre de mon premier contrat chez JAOPS, j'ai dirige le developpement d'un plugin open source Grafana 13 integrant le logiciel de controle mission Yamcs.\n\n- Mises a jour de telemetrie rapides et fiables\n- Un panneau de commande robuste et un panneau d'images de telemetrie\n- Plusieurs outils de controle mission pour les operateurs\n\nLe plugin a ete teste au Space Robotics Lab de Sendai, au Japon, sur des cas d'usage operateurs reels. Il prolongeait directement mon travail chez Space Apps a Bruxelles.\n\n[img=/img/jaops-grafana.webp]",
            links: [
              { text: 'Voir le repo GitHub du projet', link: 'https://github.com/jaops-space/grafana-yamcs-jaops' },
            ],
          },
          {
            title: 'Stagiaire logiciel spatial fullstack',
            subtitle: 'Space Applications Services, Bruxelles · juil. 2024 - oct. 2024',
            description: "[greenpoint][b] MISSION TERMINEE[/b]\n\nJ'ai contribue au coeur de Yamcs et a son observabilite: outils d'operations mission, visualisation de telemetrie et logiciels segment sol.\n\n- Developpement d'une integration Grafana 11 pour Yamcs, avec une source de donnees dediee et une visualisation 3D temps reel du vaisseau et de la Terre\n- Amelioration des interfaces de controle mission et du simulateur de vaisseau Yamcs pour de nouveaux cas operationnels\n- Contribution a l'infrastructure cloud/SaaS, a la conteneurisation et aux workflows de deploiement\n- Deploiement et validation au ICE Cubes Mission Control Centre, en transformant les retours operateurs en ameliorations et documentation\n\nTechnologies: Yamcs, Grafana, React, Three.js, Go, Docker, Cloud/SaaS.\n\n[img=/img/spaceapps.webp]",
            links: [],
          },
          {
            title: 'Ingénieur logiciel freelance',
            subtitle: 'Indépendant, temps partiel · janv. 2023 - déc. 2025',
            description: "[greenpoint][b] MISSION TERMINEE[/b]\n\nTrois ans de missions a temps partiel pour plusieurs clients, avec des cycles courts et des besoins qui evoluent vite:\n\n- Developpement web en React et HTML/JS/CSS natif\n- Applications desktop Electron et bots API Discord et Twitter en TypeScript\n- Back-end Node Express et Java Spring sur MongoDB/PostgreSQL\n- Serveurs TCP/UDP/WebSocket en Java et Node\n- Extensions DLL en C++ et C#\n- Developpement de jeux sous GameMaker et Unity\n\nSur un projet multijoueur confidentiel, j'ai concu un format d'echange compact inspire de Relaxed JSON, avec les outils parser/crawler pour faire dialoguer services et logique de jeu.",
            links: [],
          },
          {
            title: 'Stagiaire IA pricing & data engineering',
            subtitle: 'PAARLY, Toulouse · juin 2023 - juil. 2023',
            description: "[greenpoint][b] MISSION TERMINEE[/b]\n\n- Pipelines de web scraping et d'extraction pour collecter, structurer et traiter des donnees de prix concurrentiels a grande echelle\n- Developpement et integration d'outils IA/ML de pricing: rapprochement de produits, analyse de marche et suivi des prix\n- Traitement de donnees, automatisation et developpement backend pour la veille concurrentielle et la tarification dynamique",
            links: [],
          },
          {
            title: 'Assistant de production',
            subtitle: 'ADVEEZ, Toulouse · janv. 2022 - févr. 2022',
            description: "[purplepoint][b] PREMIERE MISSION (TERMINEE)[/b]\n\nMa premiere experience pro: assistance a la production de solutions electroniques, a la gestion et a la logistique. Elle m'a donne une vision complete de la chaine industrielle, au-dela du simple dev.\n\nJ'y ai observe concretement:\n- La gestion de stock et la tracabilite des composants\n- Les etapes de production et d'assemblage\n- Les flux logistiques de preparation et d'expedition\n- La configuration et les aspects software des equipements",
            links: [],
          },
        ],
      },
    }
  },
  {
    id: 'projects',
    position: [2, 0, 0],
    title: { en: 'Projects', fr: 'Projets' },
    code: 'PROJ-003',
    color: '#ffb27a',
    surface: 'gas',
    features: [{ kind: 'ring', inner: 0.64, outer: 0.97, tilt: 0.85 }],
    content: {
      en: {
        description: "A selection of projects I designed and shipped across systems programming, backend architecture, game networking, AI experimentation, and 3D web interfaces. Most of them started as curiosity and ended as production-grade learning labs (and a few started as \"this is probably a bad idea\" moments).",
        items: [
          {
            title: 'Cherry',
            subtitle: "Programming Language",
            description: "Cherry is my own interpreted and typed programming language with a C-style syntax. I built it to deeply understand language design, parsing, interpretation, typing rules, runtime behavior, and tooling constraints.\n\nProject scope includes:\n[color=lightblue]- Lexer, parser, AST pipeline, and execution model[/color]\n[color=lightblue]- Type-aware language features and runtime semantics[/color]\n[color=lightblue]- Error reporting and practical developer ergonomics[/color]\n[color=lightblue]- Open-source distribution with playground support[/color]\n\nThis project is one of my strongest examples of long-form engineering work: architecture decisions, iterative refactors, and attention to developer experience.\n\n[img=/img/cherry.webp]",
            links: [
              { text: 'Online Playground & Compiler', link: 'https://xaouab.github.io/Cherry/' },
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/Cherry' },
            ],
          },
          {
            title: 'Grafana-Yamcs Integration',
            subtitle: "Open-Source space telemetry plugin for Grafana",
            description: "Open-source integration layer for Grafana + Yamcs focused on mission telemetry and telecommand operations.\n\nMain capabilities:\n[color=lightblue]- Real-time telemetry visualization for operational monitoring[/color]\n[color=lightblue]- Telecommand panels with practical operator workflow support[/color]\n[color=lightblue]- Acknowledgement/status handling to reduce ambiguity[/color]\n[color=lightblue]- Multi-operator-friendly behavior for mission room usage[/color]\n\nIt reflects real-world mission software requirements: responsiveness, reliability, readability, and efficient decision support.\n\n[img=/img/jaops-grafana.webp]",
            links: [
              { text: 'GitHub Repository', link: 'https://github.com/yamcs/grafana-yamcs-app' },
            ],
          },
          {
            title: 'Rivalium',
            subtitle: "Multiplayer Competitive Platformer",
            description: "My longest-running project: a competitive multiplayer platformer developed as a full ecosystem rather than a simple game prototype.\n\nSystem architecture includes:\n[color=lightblue]- Account/auth service with WebSocket API[/color]\n[color=lightblue]- MongoDB-backed persistence and player data flows[/color]\n[color=lightblue]- Dual TCP/UDP game networking stack[/color]\n[color=lightblue]- Godot client in C# for gameplay runtime[/color]\n[color=lightblue]- Next.js website plus React admin tooling[/color]\n\nRivalium is where I practiced distributed system thinking, multiplayer synchronization, backend reliability, and product-level integration across many moving parts.\n\n[color=lightgreen]Tech: C#, TypeScript, Express.js, MongoDB, Next.js[/color]\n\n[img=/img/cool.webp]",
            links: [
              { text: 'Official website', link: 'https://rivalium.online' },
            ],
          },
          {
            title: 'MiniGPT',
            subtitle: "AI Library",
            description: "MiniGPT is my from-scratch learning implementation of GPT-style model concepts. The goal was educational depth: not just using AI APIs, but understanding model internals end-to-end.\n\nFocus areas:\n[color=lightblue]- Transformer fundamentals and token flow[/color]\n[color=lightblue]- Training loop concepts and optimization logic[/color]\n[color=lightblue]- Practical experimentation to validate intuition[/color]\n\nThis project strengthened my foundations in ML engineering and helped me reason better about LLM limitations and tradeoffs.",
            links: [
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/MiniGPT' },
            ],
          },
          {
            title: 'Tunewave',
            subtitle: "Online Musical Quiz",
            description: "Open-source browser music quiz with a persistent leaderboard and quick game loop.\n\nHighlights:\n[color=lightblue]- Lightweight front-end architecture for fast sessions[/color]\n[color=lightblue]- Persistent ranking/score logic[/color]\n[color=lightblue]- Friendly casual UX designed for replayability[/color]\n\nBuilt as a clean, approachable web project with production-like polish despite a simple stack.\n\n[color=lightgreen]Tech: HTML, CSS, JavaScript[/color]\n\n[img=/img/tunewave.webp]",
            links: [
              { text: 'Play', link: 'https://xaouab.github.io/Tunewave' },
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/Tunewave' },
            ],
          },
          {
            title: 'VersionFlow',
            subtitle: "CLI Tool",
            description: "CLI automation tool for semantic version workflows integrated with Git and npm.\n\nIt reduces repetitive release tasks by standardizing:\n[color=lightblue]- Version bumping strategy[/color]\n[color=lightblue]- Git tagging and commit flow coordination[/color]\n[color=lightblue]- npm publishing preparation[/color]\n\nDesigned to save time, reduce manual release mistakes, and keep project versioning consistent across teams.\n\n[color=lightgreen]Tech: JavaScript, Node.js[/color]",
            links: [
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/VersionFlow' },
              { text: 'NPM Package', link: 'https://www.npmjs.com/package/versionflow' },
            ],
          },
          {
            title: 'DiscordPresency',
            subtitle: "DLL Extension",
            description: "Native DLL wrapper around the Discord SDK to expose Rich Presence features in GameMaker projects.\n\nWhy it matters:\n[color=lightblue]- Bridges engine-level limitations with native extension code[/color]\n[color=lightblue]- Makes social status integration accessible to GameMaker workflows[/color]\n[color=lightblue]- Demonstrates practical C++ interop for game tooling[/color]\n\nA focused utility project that solves a real developer pain point for indie game pipelines.\n\n[color=lightgreen]Tech: GML, C++[/color]",
            links: [
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/DiscordPresency' },
            ],
          },
          {
            title: 'Blue Pulse',
            subtitle: "3D Web Application (just like this one)",
            description: "3D web experience built for Nuit de l'Informatique 2024 in a constrained 16-hour delivery window.\n\nCore work:\n[color=lightblue]- Interactive 3D body visualization in Three.js[/color]\n[color=lightblue]- Custom GLSL shader work for animated ocean-like effects[/color]\n[color=lightblue]- UI integration for user-friendly exploration[/color]\n\nA rapid-build project where visual experimentation and execution speed had to coexist.\n\n[color=lightgreen]Tech: JavaScript, Three.js, GLSL[/color]\n\n[img=/img/bluepulse.webp]",
            links: [
              { text: 'Live Demo', link: 'https://xaouab.github.io/BluePulse/' },
              { text: 'GitHub Repo', link: 'https://github.com/xaouab/BluePulse'}
            ],
          },
          {
            title: 'Culture Lock',
            subtitle: "Online Interactive Escape Game",
            description: "Interactive browser experience inspired by escape-game mechanics and designed around intercultural learning.\n\nProject intent:\n[color=lightblue]- Turn educational content into active exploration[/color]\n[color=lightblue]- Build progression and puzzle logic for engagement[/color]\n[color=lightblue]- Keep the experience playful without losing learning value[/color]\n\nA good example of design + logic integration for educational products.\n\n[color=lightgreen]Tech: JavaScript, GML[/color]\n\n[img=/img/culturelock.webp]",
            links: [
              { text: 'Play', link: 'https://xaouab.github.io/CultureLock/' },
            ],
          },
        ],
      },
      fr: {
        description: "Une selection de projets concus et livres entre programmation systeme, backend, reseau multijoueur, experimentation IA et interfaces 3D web. La plupart sont nes d'une curiosite technique puis transformes en vrais livrables (souvent apres un \"allez, on tente\" un peu dangereux).",
        items: [
          {
            title: 'Cherry',
            subtitle: 'Langage de programmation',
            description: "Cherry est mon propre langage interprete et type avec syntaxe style C. Je l'ai cree pour comprendre en profondeur le design de langage: parsing, execution, typage, runtime et outillage.\n\nPortee du projet:\n[color=lightblue]- Lexer, parser, AST et moteur d'execution[/color]\n[color=lightblue]- Fonctions de typage et regles semantiques[/color]\n[color=lightblue]- Gestion d'erreurs et ergonomie dev[/color]\n[color=lightblue]- Distribution open-source avec playground[/color]\n\nC'est un de mes meilleurs exemples de travail long terme: decisions d'architecture, refactors iteratifs et attention a l'experience developpeur.\n\n[img=/img/cherry.webp]",
            links: [
              { text: 'Playground & compilateur en ligne', link: 'https://xaouab.github.io/Cherry/' },
              { text: 'Repo GitHub', link: 'https://github.com/xaouab/Cherry' },
            ],
          },
          {
            title: 'Grafana-Yamcs Integration',
            subtitle: 'Plugin open-source télémétrie spatiale pour Grafana',
            description: "Integration open-source Grafana + Yamcs orientee telemetry et telecommandes pour operations mission.\n\nCapacites principales:\n[color=lightblue]- Visualisations telemetry temps reel[/color]\n[color=lightblue]- Panneaux de telecommande orientés operateur[/color]\n[color=lightblue]- Gestion d'acquittements et de statuts[/color]\n[color=lightblue]- Usage multi-operateurs en contexte mission[/color]\n\nLe projet repond a des besoins reellement operationnels: lisibilite, reactivite, fiabilite et support a la prise de decision.\n\n[img=/img/jaops-grafana.webp]",
            links: [
              { text: 'Repo GitHub', link: 'https://github.com/jaops-space/grafana-yamcs-jaops' },
            ],
          },
          {
            title: 'Rivalium',
            subtitle: 'Plateformer compétitif multijoueur',
            description: "Mon projet le plus long: un jeu de plateforme competitif multijoueur pense comme un ecosysteme complet, pas juste un prototype.\n\nArchitecture systeme:\n[color=lightblue]- Service compte/auth avec API WebSocket[/color]\n[color=lightblue]- Persistance MongoDB et gestion des donnees joueur[/color]\n[color=lightblue]- Serveur de jeu reseau dual TCP/UDP[/color]\n[color=lightblue]- Client Godot en C# pour le runtime gameplay[/color]\n[color=lightblue]- Site Next.js + panel admin React[/color]\n\nRivalium m'a permis de travailler en profondeur le design distribue, la synchro multijoueur, la robustesse backend et l'integration produit globale.\n\n[color=lightgreen]Technos : C#, TypeScript, Express.js, MongoDB, Next.js[/color]\n\n[img=/img/cool.webp]",
            links: [
              { text: 'Site officiel', link: 'https://rivalium.online' },
            ],
          },
          {
            title: 'MiniGPT',
            subtitle: 'Librairie IA',
            description: "MiniGPT est mon implementation d'apprentissage from-scratch de concepts GPT. Objectif: comprendre les mecanismes internes plutot que juste consommer une API.\n\nAxes travailles:\n[color=lightblue]- Fondamentaux transformer et flux de tokens[/color]\n[color=lightblue]- Boucle d'entrainement et logique d'optimisation[/color]\n[color=lightblue]- Experimentations pour valider les intuitions[/color]\n\nCe projet a consolide mes bases en IA/LLM et ma capacite a analyser les limites techniques des modeles.",
            links: [
              { text: 'Repo GitHub', link: 'https://github.com/xaouab/MiniGPT' },
            ],
          },
          {
            title: 'Tunewave',
            subtitle: 'Quiz musical en ligne',
            description: "Quiz musical navigateur open-source avec leaderboard persistant et boucle de jeu rapide.\n\nPoints cles:\n[color=lightblue]- Architecture front-end legere pour sessions fluides[/color]\n[color=lightblue]- Logique de score et classement persistant[/color]\n[color=lightblue]- UX casual orientee rejouabilite[/color]\n\nUn projet web simple en stack, mais propre dans l'execution produit.\n\n[color=lightgreen]Technos : HTML, CSS, JavaScript[/color]\n\n[img=/img/tunewave.webp]",
            links: [
              { text: 'Jouer', link: 'https://xaouab.github.io/Tunewave/' },
              { text: 'Repo GitHub', link: 'https://github.com/xaouab/Tunewave' },
            ],
          },
          {
            title: 'VersionFlow',
            subtitle: 'Outil CLI',
            description: "Outil CLI d'automatisation pour les workflows de versionning semantique avec Git et npm.\n\nIl standardise:\n[color=lightblue]- Les increments de version[/color]\n[color=lightblue]- Le flux commits/tags Git[/color]\n[color=lightblue]- La preparation de publication npm[/color]\n\nBut: gagner du temps, reduire les erreurs manuelles et rendre les releases plus coherentes.\n\n[color=lightgreen]Technos : JavaScript, Node.js[/color]",
            links: [
              { text: 'GitHub', link: 'https://github.com/xaouab/VersionFlow' },
              { text: 'NPM Package', link: 'https://www.npmjs.com/package/versionflow' },
            ],
          },
          {
            title: 'DiscordPresency',
            subtitle: 'Extension DLL',
            description: "Wrapper DLL natif autour du SDK Discord pour exposer le Rich Presence dans des projets GameMaker.\n\nInteret technique:\n[color=lightblue]- Contourner les limites moteur via extension native[/color]\n[color=lightblue]- Rendre l'integration sociale accessible en pipeline indie[/color]\n[color=lightblue]- Demontrer l'interop C++/GML sur un cas concret[/color]\n\nPetit projet utilitaire mais a forte valeur pratique pour devs jeu.\n\n[color=lightgreen]Technos : GML, C++[/color]",
            links: [
              { text: 'GitHub', link: 'https://github.com/xaouab/DiscordPresency' },
            ],
          },
          {
            title: 'Blue Pulse',
            subtitle: 'Appli web 3D (comme ce site)',
            description: "Experience web 3D realisee pour la Nuit de l'Informatique 2024 en 16 heures.\n\nTravail principal:\n[color=lightblue]- Visualisation 3D interactive (Three.js)[/color]\n[color=lightblue]- Shader GLSL personnalise pour effet ocean anime[/color]\n[color=lightblue]- Interface utilisateur pour exploration fluide[/color]\n\nUn projet de sprint ou experimentation visuelle et execution rapide devaient coexister.\n\n[color=lightgreen]Technos : JavaScript, Three.js, GLSL[/color]\n\n[img=/img/bluepulse.webp]",
            links: [
              { text: 'Démo live', link: 'https://xaouab.github.io/BluePulse/' },
              { text: 'GitHub', link: 'https://github.com/xaouab/BluePulse' },
            ],
          },
          {
            title: 'Culture Lock',
            subtitle: 'Escape game interactif en ligne',
            description: "Experience navigateur inspiree des mecaniques d'escape game, centree sur l'apprentissage interculturel.\n\nObjectifs produit:\n[color=lightblue]- Transformer du contenu educatif en exploration active[/color]\n[color=lightblue]- Construire progression et logique d'enigmes engageantes[/color]\n[color=lightblue]- Conserver un ton ludique sans perdre le fond pedagogique[/color]\n\nBon exemple d'integration design + logique pour un projet edtech interactif.\n\n[color=lightgreen]Technos : JavaScript, GML[/color]\n\n[img=/img/culturelock.webp]",
            links: [
              { text: 'Jouer', link: 'https://xaouab.github.io/CultureLock/' },
            ],
          },
        ],
      },
    },
  },
  {
    id: 'skills',
    position: [-12, -20, -12],
    title: { en: 'Technical Skills', fr: 'Compétences Techniques' },
    code: 'TECH-004',
    color: '#b8a4ff',
    surface: 'crystal',
    features: [],
    content: {
      en: {
        description: "My practical engineering toolbox, built through internships, freelance missions, and long personal projects. I focus on tools that help me ship reliable systems end-to-end (and yes, I actually use what's listed).",
        items: [
          {
            title: 'Languages I Actually Use',
            description: "C++, C, Rust, Java, C#, JavaScript, TypeScript, Python, Go, GML.\n\nI use these depending on problem constraints: performance-critical runtime, backend APIs, gameplay logic, scripting, and fast prototyping. I care less about language fashion and more about choosing the right execution model for the task.",
            links: [],
          },
          {
            title: 'Front-End Magic',
            description: "React, Next.js, Tailwind CSS, Vue, Bootstrap, Three.js, Electron.\n\nI build responsive interfaces, component systems, and interactive 3D web experiences. My front-end focus is usability + performance + visual clarity, especially for data-heavy or real-time products.",
            links: [],
          },
          {
            title: 'Back-End Wizardry',
            description: "Express.js, Java Spring, MongoDB, PostgreSQL, TCP/UDP, WebSockets, REST APIs.\n\nThis is my core engineering zone: service design, API contracts, data modeling, state synchronization, and production-safe behavior. I am comfortable with both conventional web backends and real-time communication systems.",
            links: [],
          },
          {
            title: 'Space & Mission Systems',
            description: "Yamcs, Yamcs Gateway, Grafana, ROS 2, telemetry and telecommand, spacecraft simulators.\n\nI build and deploy mission control software used by real operators, from data sources and commanding panels to ground-space links and robotics interfaces.",
            links: [],
          },
          {
            title: 'Security',
            description: "Security audits, attack-surface reduction, authentication and access control, secure protocols and data flows, space link encryption (CySAT), DevSecOps.\n\nI am specializing in cybersecurity, and I apply it directly to mission control centers and the software that runs them.",
            links: [],
          },
          {
            title: 'DevOps & Tools',
            description: "Git, GitHub Actions, Docker, Kubernetes, CI/CD, DevSecOps, Linux, Jira, Agile.\n\nI use these to make delivery predictable: reproducible environments, automated checks, deployment consistency, and team-friendly workflows. Not flashy, but essential for stable products.",
            links: [],
          },
          {
            title: 'Specialized Skills',
            description: "Real-time systems, distributed architectures, spacecraft telemetry tooling, multiplayer networking, and 3D graphics programming.\n\nI am especially motivated by systems where timing, state consistency, and human-readable visualization all matter at once.",
            links: [],
          },
        ],
      },
      fr: {
        description: "Ma boite a outils d'ingenierie, construite via stages, missions freelance et projets perso long terme. Je privilegie les technos qui permettent de livrer des systemes fiables de bout en bout (et oui, je m'en sers vraiment).",
        items: [
          {
            title: 'Langages que j’utilise vraiment',
            description: "C++, C, Rust, Java, C#, JavaScript, TypeScript, Python, Go, GML.\n\nJe les choisis selon le contexte: runtime haute perf, APIs backend, logique gameplay, scripting ou prototypage rapide. Je privilegie le bon outil pour le bon probleme.",
            links: [],
          },
          {
            title: 'Front-end',
            description: "React, Next.js, Tailwind CSS, Vue, Bootstrap, Three.js, Electron.\n\nJe developpe des interfaces responsive, des architectures composants, et des experiences 3D web interactives. Mon objectif: UX claire, perf solide, rendu propre.",
            links: [],
          },
          {
            title: 'Back-end',
            description: "Express.js, Java Spring, MongoDB, PostgreSQL, TCP/UDP, WebSockets, APIs REST.\n\nC'est mon coeur de metier: conception de services, contrats API, modelisation des donnees, synchronisation d'etat et robustesse production.",
            links: [],
          },
          {
            title: 'Systèmes spatiaux & mission',
            description: "Yamcs, Yamcs Gateway, Grafana, ROS 2, telemetrie et telecommande, simulateurs de vaisseau.\n\nJe developpe et deploie des logiciels de controle mission utilises par de vrais operateurs, des sources de donnees aux panneaux de commande, jusqu'aux liens sol-espace et aux interfaces robotiques.",
            links: [],
          },
          {
            title: 'Sécurité',
            description: "Audits de securite, reduction de la surface d'attaque, authentification et controle d'acces, protocoles et flux de donnees securises, chiffrement des liens spatiaux (CySAT), DevSecOps.\n\nJe me specialise en cybersecurite et je l'applique directement aux centres de controle mission et aux logiciels qui les font tourner.",
            links: [],
          },
          {
            title: 'DevOps & outils',
            description: "Git, GitHub Actions, Docker, Kubernetes, CI/CD, DevSecOps, Linux, Jira, Agile.\n\nJe m'en sers pour fiabiliser la livraison: environnements reproductibles, controles automatiques, deploiements coherents et workflow equipe propre.",
            links: [],
          },
          {
            title: 'Compétences spéciales',
            description: "Systemes temps reel, architectures distribuees, telemetry spatiale, reseau multijoueur et programmation 3D.\n\nJe suis particulierement attire par les projets ou il faut gerer precision technique + lisibilite operationnelle + rendu visuel.",
            links: [],
          },
        ],
      },
    },
  },
  {
    id: 'contact',
    position: [8, -35, -12],
    title: { en: 'Get In Touch', fr: 'Contact' },
    code: 'COMM-005',
    color: '#a4f3ff',
    surface: 'ice',
    features: [{ kind: 'satellite', radius: 0.8, tilt: 1.05 }],
    content: {
      en: {
        description: "If you are building something technical and ambitious, I would love to discuss it. I am comfortable with both product implementation and deep engineering tasks (including the unglamorous debugging parts).",
        items: [
          {
            title: 'Email',
            description: "Best direct channel for opportunities, collaborations, or technical discussions. I usually reply quickly when the message includes clear context.",
            links: [
              { text: 'aouabadmou@gmail.com', link: 'mailto:aouabadmou@gmail.com' },
            ],
          },
          {
            title: 'LinkedIn',
            description: "Professional profile with experience timeline and project context. Ideal for recruiters, hiring managers, and technical networking.",
            links: [
              { text: 'linkedin.com/in/aouab', link: 'https://linkedin.com/in/aouab' },
            ],
          },
          {
            title: 'GitHub',
            description: "Main public code portfolio. You can review repositories, project history, and how I structure real implementations over time.",
            links: [
              { text: 'github.com/xaouab', link: 'https://github.com/xaouab' },
            ],
          },
          {
            title: 'Location',
            description: "Based in Toulouse, France. Open to remote collaboration and relocation depending on mission fit, team quality, and project scope.",
            links: [],
          },
          {
            title: 'Availability',
            description: "Open to opportunities and freelance work.\n\nPreferred domains:\n[color=lightblue]- Space systems and mission control software[/color]\n[color=lightblue]- Cybersecurity and DevSecOps[/color]\n[color=lightblue]- Software engineering (backend/fullstack)[/color]\n[color=lightblue]- AI engineering and applied ML[/color]\n[color=lightblue]- Embedded and systems programming[/color]\n[color=lightblue]- Distributed and real-time applications[/color]\n[color=lightblue]- 3D graphics or simulation-heavy products[/color]",
            links: [],
          },
          {
            title: 'Resume (CV)',
            description: "If you need a concise overview of my background, technical stack, and mission history, download the resume below.",
            links: [
              { text: 'Download French Resume', link: '/resume/Aouab Admou - CV FR.pdf' },
              { text: 'Download English Resume', link: '/resume/Aouab Admou - English Resume.pdf' }
            ],
          },
        ],
      },
      fr: {
        description: "Si tu construis un produit technique ambitieux, je serai ravi d'en parler. Je suis a l'aise autant sur l'implementation produit que sur les sujets d'ingenierie profonde (meme quand il faut debloquer un bug ingrat).",
        items: [
          {
            title: 'Email',
            description: "Le meilleur canal direct pour opportunites, collaborations ou echanges techniques. Je reponds rapidement quand le contexte est clair.",
            links: [
              { text: 'aouabadmou@gmail.com', link: 'mailto:aouabadmou@gmail.com' },
            ],
          },
          {
            title: 'LinkedIn',
            description: "Profil pro avec parcours, experiences et contexte de mission. Ideal pour recrutement, networking et prises de contact qualifiees.",
            links: [
              { text: 'linkedin.com/in/aouab', link: 'https://linkedin.com/in/aouab' },
            ],
          },
          {
            title: 'GitHub',
            description: "Mon portfolio code principal. Tu peux y voir les repos publics, l'historique et ma facon de structurer des implementations concretes.",
            links: [
              { text: 'github.com/xaouab', link: 'https://github.com/xaouab' },
            ],
          },
          {
            title: 'Localisation',
            description: "Base a Toulouse, France. Ouvert au travail remote et a la relocalisation selon la mission, l'equipe et le scope technique.",
            links: [],
          },
          {
            title: 'Disponibilité',
            description: "Ouvert aux opportunites et aux missions freelance.\n\nDomaines recherches:\n[color=lightblue]- Systemes spatiaux et logiciels de controle mission[/color]\n[color=lightblue]- Cybersecurite et DevSecOps[/color]\n[color=lightblue]- Ingenierie logicielle (backend/fullstack)[/color]\n[color=lightblue]- IA appliquee et machine learning[/color]\n[color=lightblue]- Systemes embarques et programmation bas niveau[/color]\n[color=lightblue]- Architectures distribuees et temps reel[/color]\n[color=lightblue]- Produits 3D, simulation ou visualisation avancee[/color]",
            links: [
              { text: 'Download English Resume', link: '/resume/Aouab Admou - English Resume.pdf' },
              { text: 'Download French Resume', link: '/resume/Aouab Admou - CV FR.pdf' },
            ],
          },
          {
            title: 'CV',
            description: "Si tu veux une version compacte de mon parcours, stack technique et experiences, tu peux telecharger mon CV ici.",
            links: [
              { text: 'Télécharger mon CV en Francais', link: '/resume/Aouab Admou - CV FR.pdf' },
              { text: 'Télécharger mon CV en Anglais', link: '/resume/Aouab Admou - English Resume.pdf' }
            ],
          },
        ],
      },
    },
  },
];

