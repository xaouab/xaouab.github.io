// src/data/starsData.ts

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
  metalness?: number;
  roughness?: number;
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
    content: {
      en: {
        description: "[pulse]Hello and welcome to my orbit.[/pulse] This section is a quick personal briefing before you visit the rest of the system (yes, I still build weird things just because they sound fun).",
        items: [
          {
            title: 'Aouab Admou',
            subtitle: 'Computer Science Student',
            description: "[img=/img/me.webp]\nHello, I am Aouab (pronounced ah-web, yes, like the web). I am a Computer Science student who enjoys building systems that are both technical and playful.\n\nI started learning by myself in middle school: first programming, then design, then music. That mix shaped how I approach software today. I care about engineering quality, but I also care about user feeling, visual clarity, and personality in products.\n\nMost of my work sits at the intersection of backend, real-time systems, and interactive frontends. I enjoy problems where architecture matters: APIs, multiplayer networking, telemetry pipelines, and 3D visualization.\n\nOutside coding, I am a big fan of astronomy and aviation, that's probably why this website looks like this :) it is both my style and a reflection of the kind of systems thinking I enjoy.\n\nIf this is your first visit, feel free to explore each planet. Every one of them contains real projects, work missions, and technical details.",
            links: [
              { text: 'Download English Resume', link: '/resume/Aouab Admou - English Resume.pdf' },
              { text: 'Download French Resume', link: '/resume/Aouab Admou - CV FR.pdf' },
            ],
          },
        ],
      },
      fr: {
        description: "[greenpoint] [pulse][color=lightgreen]Bienvenue dans mon univers.[/color][/pulse] Petit briefing avant de visiter le reste du portfolio (oui, je code aussi des trucs juste parce que l'idee est marrante).",
        items: [
          {
            title: 'Aouab Admou',
            subtitle: 'Étudiant en informatique',
            description: "[img=/img/me.webp]\nSalut, moi c'est Aouab (prononce ah-web, comme le web). Je suis etudiant en informatique et j'aime construire des projets techniques avec une vraie identite visuelle.\n\nJ'ai commence en autodidacte au college: code, dessin, musique. Ce melange influence encore ma facon de travailler. Je cherche toujours un bon equilibre entre architecture solide, performance, et experience utilisateur.\n\nJe travaille surtout sur des sujets backend, temps reel et interfaces interactives: APIs, reseau multijoueur, telemetry, visualisation 3D et outils web.\n\nJe suis aussi passionne d'astronomie et d'aviation, d'ou le theme spatial de ce portfolio. Ce n'est pas juste decoratif: c'est aussi ma maniere de raconter mon parcours.\n\nSi c'est ta premiere visite, explore les planetes: chacune contient des missions concretes, des projets livrables et des details techniques.",
            links: [
              { text: 'Télécharger mon CV en Francais', link: '/resume/Aouab Admou - CV FR.pdf' },
              { text: 'Télécharger mon CV en Anglais', link: '/resume/Aouab Admou - English Resume.pdf' }
            ],
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
    content: {
      en: {
        description: "From [color=lightgreen]Tokyo[/color] to [color=lightgreen]Brussels[/color] to [color=lightgreen]remote freelance teams[/color], I shipped production code across different domains: telemetry, web platforms, games, and backend infrastructure (while trying not to anger production at 3 AM).",
        items: [
          {
            title: 'Freelance Software Engineer',
            subtitle: 'Part-time, Online',
            description: "[orangepoint][color=orange] MISSION IN PROGRESS[/color]\n\nSince January 2023, I have been collaborating part-time with multiple freelance clients on software and web missions with short iteration cycles and changing requirements.\n\nTypical responsibilities include:\n[color=lightblue]- Backend architecture and API design for feature-heavy products[/color]\n[color=lightblue]- Database modeling, query optimization, and data flow design[/color]\n[color=lightblue]- Integration support between game clients, services, and admin tools[/color]\n[color=lightblue]- Delivery hardening: error handling, logging, and maintainability[/color]\n\nOn one confidential multiplayer mission, I designed and implemented a compact custom data interchange format inspired by Relaxed JSON, then built associated parser/crawler tooling to support interoperability across services and game logic.\n\nI also contribute to deployment and scaling discussions so teams can keep shipping without architectural debt exploding over time.",
            images: [""],
            links: [],
          },
          {
            title: 'Fullstack Space Mission Control Software Engineer',
            subtitle: 'JAOPS, Tokyo, Japan',
            description: "[greenpoint][color=lightgreen] MISSION COMPLETE[/color]\n\nAt JAOPS, I worked on mission-control software for space telemetry and telecommand operations, with a focus on reliability, operator usability, and real-time data visibility.\n\nMain contributions:\n[color=lightblue]- Built and extended a Grafana 11 plugin for telemetry and command workflows[/color]\n[color=lightblue]- Implemented command panels and operational UI blocks for mission operators[/color]\n[color=lightblue]- Improved real-time visualization to reduce interpretation friction during operations[/color]\n[color=lightblue]- Supported practical operator workflows: acknowledgement paths, quick checks, and clear status feedback[/color]\n\n[color=#2774d9][pulse]HIGHLIGHT[/pulse][/color] [color=lightblue]This role built directly on the work I had done at Space Apps in Brussels. The continuity between both missions let me move faster and deliver production-ready tooling quickly.[/color]\n\n[img=/img/jaops-grafana.webp]",
            links: [
                { text: 'View Project GitHub Repo', link: 'https://github.com/jaops-space/grafana-yamcs-jaops' },
            ],
          },
          {
            title: 'Fullstack Software Intern',
            subtitle: 'Space Apps, Brussels, Belgium',
            description: "[greenpoint][color=lightgreen] MISSION COMPLETE[/color]\n\nAt Space Apps, I developed mission software components around Yamcs + Grafana for satellite telemetry and command operations.\n\nKey work delivered:\n[color=lightblue]- Grafana 11 plugin integration with Yamcs telemetry/command streams[/color]\n[color=lightblue]- Operational data views tailored to real mission needs[/color]\n[color=lightblue]- Real-time 3D spacecraft visualization in Three.js for stronger spatial understanding[/color]\n[color=lightblue]- Practical UX improvements to help operators interpret state faster[/color]\n\nThe 3D component was introduced to complement charts and raw coordinate feeds with an immediate visual context that teams could use during monitoring and analysis.\n\n[img=/img/spaceapps.webp]",
            links: [],
          },
          {
            title: 'Production Assistant',
            subtitle: 'ADVEEZ, Toulouse, France',
            description: "[purplepoint][color=violet] INITIAL MISSION (COMPLETE)[/color]\n\nThis was my first professional internship and it gave me a complete view of industrial product delivery beyond pure coding.\n\nI discovered how an electronics company serving major airports coordinates:\n[color=lightblue]- Inventory and component traceability[/color]\n[color=lightblue]- Production and assembly workflows[/color]\n[color=lightblue]- Shipping and deployment logistics[/color]\n[color=lightblue]- Device preparation, configuration, and embedded/software touchpoints[/color]\n\nThat mission gave me early discipline around process quality, execution consistency, and cross-team communication.",
            links: [],
          },
        ],
      },
      fr: {
        description: "De [color=lightgreen]Tokyo[/color] a [color=lightgreen]Bruxelles[/color] puis en [color=lightgreen]freelance remote[/color], j'ai livre du code en production sur des sujets varies: telemetry spatiale, plateformes web, jeux et backend (avec le moins possible de surprises a 3h du matin).",
        items: [
          {
            title: 'Freelance Software Engineer',
            subtitle: 'À temps partiel, en ligne',
            description: "[orangepoint][color=orange] MISSION EN COURS[/color]\n\nDepuis janvier 2023, je collabore a temps partiel avec plusieurs clients freelance sur des missions software et web avec cycles de livraison courts et besoins qui evoluent vite.\n\nMissions recurrentes:\n[color=lightblue]- Conception backend et architecture d'API[/color]\n[color=lightblue]- Modelisation de base de donnees et organisation des flux de donnees[/color]\n[color=lightblue]- Integration entre clients de jeu, services backend et outils internes[/color]\n[color=lightblue]- Renforcement de la qualite de livraison: gestion d'erreurs, logs, maintenabilite[/color]\n\nSur un projet multijoueur confidentiel, j'ai concu un format d'echange compact inspire de Relaxed JSON, puis les outils parser/crawler associes pour faciliter l'interoperabilite entre composants.\n\nJe participe aussi aux choix de deploiement et de scalabilite pour garder une base technique propre a mesure que le produit grandit.",
            links: [],
          },
          {
            title: 'Fullstack Space Mission Control Software Engineer',
            subtitle: 'JAOPS, Tokyo, Japon',
            description: "[greenpoint][color=lightgreen] MISSION TERMINEE[/color]\n\nChez JAOPS, j'ai travaille sur des outils de controle mission pour la telemetry et les telecommandes spatiales, avec un focus sur la fiabilite et l'efficacite operateur.\n\nContributions principales:\n[color=lightblue]- Developpement et evolution d'un plugin Grafana 11 pour telemetry/commandes[/color]\n[color=lightblue]- Mise en place de panneaux de commande et blocs UI operationnels[/color]\n[color=lightblue]- Amelioration des visualisations temps reel pour la prise de decision[/color]\n[color=lightblue]- Optimisation des flux operateur: acquittements, verifications, lisibilite d'etat[/color]\n\n[color=#2774d9][pulse]HIGHLIGHT[/pulse][/color] [color=lightblue]Cette mission prolongeait directement mon travail chez Space Apps, ce qui m'a permis de livrer rapidement des fonctionnalites robustes et exploitables en contexte mission.[/color]\n\n[img=/img/jaops-grafana.webp]",
            links: [
              { text: 'Voir le repo GitHub du projet', link: 'https://github.com/jaops-space/grafana-yamcs-jaops' },
            ],
          },
          {
            title: 'Stagiaire fullstack',
            subtitle: 'Space Apps, Bruxelles, Belgique',
            description: "[greenpoint][color=lightgreen] MISSION TERMINEE[/color]\n\nChez Space Apps, j'ai developpe des briques logicielles pour l'exploitation mission autour de Yamcs et Grafana.\n\nLivrables cles:\n[color=lightblue]- Integration d'un plugin Grafana 11 avec les flux telemetry et telecommande[/color]\n[color=lightblue]- Ecrans operationnels orientes usage salle de controle[/color]\n[color=lightblue]- Visualisation 3D temps reel du vaisseau en Three.js[/color]\n[color=lightblue]- Ajustements UX pour accelerer l'interpretation des etats mission[/color]\n\nLa visualisation 3D a apporte un contexte spatial immediat en complement des courbes et valeurs numeriques.\n\n[img=/img/spaceapps.webp]",
            links: [],
          },
          {
            title: 'Assitant en Production',
            subtitle: 'ADVEEZ, Toulouse, France',
            description: "[purplepoint][color=violet] PREMIERE MISSION (TERMINEE)[/color]\n\nMon premier stage m'a donne une vision complete de la chaine industrielle, au-dela du simple dev.\n\nJ'y ai observe concretement:\n[color=lightblue]- La gestion de stock et la tracabilite des composants[/color]\n[color=lightblue]- Les etapes de production et d'assemblage[/color]\n[color=lightblue]- Les flux logistiques de preparation et d'expedition[/color]\n[color=lightblue]- La configuration et les aspects software des equipements[/color]\n\nCette mission m'a apporte des bases solides en rigueur process, coordination d'equipe et qualite d'execution.",
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
    metalness: 1,
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
    content: {
      en: {
        description: "My practical engineering toolbox, built through internships, freelance missions, and long personal projects. I focus on tools that help me ship reliable systems end-to-end (and yes, I actually use what's listed).",
        items: [
          {
            title: 'Languages I Actually Use',
            description: "C++, C, Java, C#, JavaScript, TypeScript, Python, Go, GML.\n\nI use these depending on problem constraints: performance-critical runtime, backend APIs, gameplay logic, scripting, and fast prototyping. I care less about language fashion and more about choosing the right execution model for the task.",
            links: [],
          },
          {
            title: 'Front-End Magic',
            description: "React, Next.js, Tailwind CSS, Vue, Bootstrap, Three.js.\n\nI build responsive interfaces, component systems, and interactive 3D web experiences. My front-end focus is usability + performance + visual clarity, especially for data-heavy or real-time products.",
            links: [],
          },
          {
            title: 'Back-End Wizardry',
            description: "Express.js, Java Spring, MongoDB, PostgreSQL, TCP/UDP, WebSockets, REST APIs.\n\nThis is my core engineering zone: service design, API contracts, data modeling, state synchronization, and production-safe behavior. I am comfortable with both conventional web backends and real-time communication systems.",
            links: [],
          },
          {
            title: 'DevOps & Tools',
            description: "Git, GitHub Actions, Docker, Kubernetes, CI/CD, Linux, Jira, Agile.\n\nI use these to make delivery predictable: reproducible environments, automated checks, deployment consistency, and team-friendly workflows. Not flashy, but essential for stable products.",
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
            description: "C++, C, Java, C#, JavaScript, TypeScript, Python, Go, GML.\n\nJe les choisis selon le contexte: runtime haute perf, APIs backend, logique gameplay, scripting ou prototypage rapide. Je privilegie le bon outil pour le bon probleme.",
            links: [],
          },
          {
            title: 'Front-end',
            description: "React, Next.js, Tailwind CSS, Vue, Bootstrap, Three.js.\n\nJe developpe des interfaces responsive, des architectures composants, et des experiences 3D web interactives. Mon objectif: UX claire, perf solide, rendu propre.",
            links: [],
          },
          {
            title: 'Back-end',
            description: "Express.js, Java Spring, MongoDB, PostgreSQL, TCP/UDP, WebSockets, APIs REST.\n\nC'est mon coeur de metier: conception de services, contrats API, modelisation des donnees, synchronisation d'etat et robustesse production.",
            links: [],
          },
          {
            title: 'DevOps & outils',
            description: "Git, GitHub Actions, Docker, Kubernetes, CI/CD, Linux, Jira, Agile.\n\nJe m'en sers pour fiabiliser la livraison: environnements reproductibles, controles automatiques, deploiements coherents et workflow equipe propre.",
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
    metalness: 1,
    roughness: .4,
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
            description: "Available for a 4-month internship starting June 2026 and remote freelance work whenever.\n\nPreferred domains:\n[color=lightblue]- Software engineering (backend/fullstack)[/color]\n[color=lightblue]- AI engineering and applied ML[/color]\n[color=lightblue]- Embedded and systems programming[/color]\n[color=lightblue]- Distributed and real-time applications[/color]\n[color=lightblue]- 3D graphics or simulation-heavy products[/color]",
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
            description: "Disponible pour un stage de 4 mois a partir de juin 2026.\n\nDomaines recherches:\n[color=lightblue]- Ingenierie logicielle (backend/fullstack)[/color]\n[color=lightblue]- IA appliquee et machine learning[/color]\n[color=lightblue]- Systemes embarques et programmation bas niveau[/color]\n[color=lightblue]- Architectures distribuees et temps reel[/color]\n[color=lightblue]- Produits 3D, simulation ou visualisation avancee[/color]",
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

