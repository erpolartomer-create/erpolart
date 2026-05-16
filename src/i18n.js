import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { legalTranslations } from './locales/legal';

const resources = {
  en: {
    translation: {
      legal: legalTranslations.en,
      checkoutAgreements: legalTranslations.en.agreements,
      orderSuccess: {
        celebration: "ORDER CONFIRMED",
        title: "Protocol",
        titleAccent: "Initiated.",
        revision: "REVISION #",
        editDesc: "You can modify your previous inputs to better fit your needs. Changes will be processed within the next update cycle.",
        subtitle: "Define the brand assets and details required for your digital architecture.",
        form: {
          brandName: "BRAND / PROJECT NAME",
          brandNamePlaceholder: "E.g., ErpolArt Studio",
          editLimit: "1 REVISION ALLOWED",
          manualReview: "MANUAL REVIEW",
          uploadLogo: "UPLOAD LOGO",
          nullEntity: "SELECT IMAGE",
          colors: "BRAND COLORS",
          notes: "ARCHITECTURAL NOTES (OPTIONAL)",
          notesPlaceholder: "Any additional details regarding the project...",
          uploadHint: "Drag and drop or click to upload. Only PNG/SVG with transparent backgrounds are accepted.",
          alertLogo: "Please upload only PNG or SVG files with transparent backgrounds.",
          submit: "AUTHORIZE PERSONALIZATION",
          submitting: "Processing Protocol...",
          saveChanges: "Save Changes",
          saveSuccess: "Logic updated successfully. Initializing redirect...",
          errorTitle: "PROTOCOL ERROR",
          submitError: "Deployment initialization failed. Please verify your connection and try again.",
          saveError: "Synchronization Failed",
          fetchError: "Data Fetching Error",
          loadError: "Failed to load architectural data. Refreshing protocol...",
          trackStatus: "Track Order Status",
          fileLimitError: "Architectural Touch: Please upload your logo in a size smaller than 5MB. This helps us maintain your system's performance.",
          addonsTitle: "ADD-ONS & REQUIREMENTS",
          aiContextLabel: "AI CHATBOT CONTEXT / PROMPT",
          aiContextPlaceholder: "E.g., Our assistant must maintain a highly polite and professional tone. Its goal is to collect visitor contact details and route pricing inquiries to the booking form...",
          targetLanguagesLabel: "TARGET LANGUAGES (E.G. ENGLISH, TURKISH, GERMAN)",
          targetLanguagesPlaceholder: "English, Turkish, German, etc."
        }
      },
      orderCancel: {
        title: "Transaction",
        titleAccent: "Interrupted.",
        subtitle: "The payment process could not be completed. Don't worry, no charges were made to your account. You can try again or contact our engineering support.",
        retry: "Try Payment Again",
        retryDesc: "Return to the templates gallery and attempt the transaction again.",
        backToHome: "Return to Atelier",
        support: "Contact Support",
        supportDesc: "Need help? Our engineering support is standing by to assist with your acquisition.",
        securityShield: "SECURE REPLICA SHIELD ACTIVATED",
        alerts: {
          success: "Payment Received Successfully!",
          failed: "Payment Interrupted. Please check your card details."
        }
      },
      globalSignal: {
        title: "Payment Verified",
        message: "Signal received and node connection established. You are being redirected to the Protocol Form to personalize your architecture.",
        connecting: "Establishing Connection..."
      },
      common: {
        pages: "Pages",
        items: "Items",
        loading: "Initializing...",
        edit: "Edit Setup Details",
        architectureNotFound: "Architecture not found.",
        proceedToWorkspace: "Ready for Deployment"
      },
      purchases: {
        subtitle: "Manage your digital assets and finalize deployment details.",
        totalAssets: "Total Assets",
        emptyTitle: "No Digital Assets Yet",
        emptyDesc: "You have no templates yet. Ready to explore ErpolArt's premium world?",
        browseCTA: "Explore Templates"
      },
      nav: { home: "Home", projects: "Projects", templates: "Templates", saas: "SaaS", automations: "AI Automations", about: "About", contact: "Contact", myPurchases: "My Purchases", accountSettings: "Account Settings", logout: "Sign Out", signIn: "Sign In", register: "Register" },
      status: {
        acquired: "ACQUIRED",
        offMarket: "OFF THE MARKET"
      },
      hero: {
        title1: "Modern Work,",
        title2: "Modern Software.",
        subtitle: "Custom engineered web experiences and exclusively owned templates. Delivered with unprecedented precision and speed.",
        viewProjects: "View Our Projects",
        browseTemplates: "Browse Templates",
        scroll: "SCROLL"
      },
      howItWorks: {
        title: "Modern Digital Architecture",
        subtitle: "Choose the engineering path that aligns with your vision. From instant exclusivity to complex SaaS ecosystems.",
        path1: "OPTION 01: SIGNATURE TEMPLATES",
        path1Title: "Signature",
        path1TitleAccent: "Templates",
        path1Desc: "Pre-engineered masterpieces for businesses that demand excellence immediately. Each template is sold only ONCE—guaranteeing your unique digital identity.",
        path1Badge1: "24H DEPLOYMENT",
        path1Badge2: "Ready to Launch",
        path1Explore: "Browse Collection",

        path2: "OPTION 02: CUSTOM SOFTWARE",
        path2Title: "Bespoke",
        path2TitleAccent: "Architectures",
        path2Desc: "A complete visual and functional rebirth. We craft unique digital universes tailored to your brand's DNA and strategic growth objectives.",
        path2Badge1: "AI-PRECISION",
        path2Badge2: "Scalable Logic",
        path2Explore: "Begin Custom Journey",

        path3: "OPTION 03: SAAS PROJECTS",
        path3Title: "Intelligent SaaS",
        path3TitleAccent: "Ecosystems",
        path3Desc: "From AI-powered chatbots to real-time analytics dashboards, we build scalable SaaS platforms that transform your operations and empower your business.",
        path3Badge1: "AI INTEGRATED",
        path3Badge2: "Enterprise Cloud",
        path3Explore: "Explore SaaS Projects",
        path4: "OPTION 04: AI AUTOMATIONS",
        path4Title: "Intelligent",
        path4TitleAccent: "AI Automations",
        path4Desc: "Streamline your business operations with autonomous AI agents and intelligent workflow automations. We build the digital brain that powers your enterprise 24/7.",
        path4Badge1: "AUTONOMOUS AGENTS",
        path4Badge2: "Efficiency Core",
        path4Explore: "Explore AI Automations",

        systemStatus: "System Core Status",
        enterpriseArch: "Enterprise Architecture",
        globalScale: "Built for Global Scale",
        badgeOptimized: "Optimized Layout"
      },
      latest: {
        title: "Fresh Out of the Lab",
        titlePart1: "Fresh out of",
        titlePart2: "the Lab",
        subtitle: "Our most recent digital creations, engineered for performance and designed to captivate.",
        viewAll: "View All Work",
        new: "New",
        viewPresentation: "View Presentation",
        buyNow: "Purchase",
        sold: "SOLD",
        explore: "Explore",
        browseFull: "Click to browse our full collection"
      },
      aboutTeaser: {
        title: "We believe the web should be dynamic, beautiful, and engineered with precision. ErpolArt exists at the intersection of human creativity and AI efficiency.",
        subtitle: "We aren't just developers. We are digital architects building the next generation of premium web experiences.",
        discover: "Discover our story"
      },
      templatesPage: {
        catalog: "Catalog 2024.v1",
        availability: {
          all: "All Assets",
          available: "Ready to Deploy",
          acquired: "Exclusive Portfolio"
        },
        titlePart1: "Ready-Made",
        titlePart2: "Exclusivity.",
        subtitle: "Each digital architecture is exclusive to one brand; permanently removed from the catalog upon purchase. Select your system, submit your data, and we'll deploy your turnkey project within 24 hours. Zero clones, maximum speed.",
        protocolTitle: "Strict Exclusivity Protocol",
        protocolDescText: "Our templates are sold only once. Upon purchase, the architecture is removed from the catalog permanently. No clones. No duplicates.",
        deployment: "24H Rapid Deployment",
        rights: "Full IP Rights Transfer",
        categories: {
          all: "All Architectures",
          beauty: "Beauty & Wellness",
          fitness: "Health & Fitness",
          corporate: "Corporate",
          law: "Law Firm",
          rent: "Rent-a-Car",
          restaurant: "Restaurant",
          portfolio: "Portfolio",
          ecommerce: "E-commerce",
          realestate: "Real Estate"
        },
        tiers: {
          corporate: "CORPORATE",
          pro: "PRO",
          premium: "PREMIUM",
          platinum: "PLATINUM",
          standard: "Standard Premium",
          architect: "Architect Edition",
          elite: "Elite Artifact"
        },
        modal: {
          ready: "24H Ready",
          protection: "IP Protection",
          intel: "Design Intelligence",
          viewport: "Viewport Logic",
          responsive: "Fully Responsive",
          integrity: "Core Integrity",
          clean: "Clean React",
          anim: "Anim Engine",
          features: "Features",
          stack: "Stack"
        },
        details: "View Details",
        projectIntel: "Project Intel",
        filterTitle: "Select Category",
        filterSelection: "CHOOSE OPTION",
        transparencyBanner: {
          protocol: "Protocol 02",
          title: "Strict Exclusivity",
          titleAccent: "Protocol",
          statement: "Exclusivity Statement",
          headline: "One purchase. One owner. Zero clones.",
          description: "Our templates are sold only once. Once purchased, the architecture is permanently removed from the catalog. You aren't just buying a site; you are securing an exclusive IP. No clones. No repeats. No exceptions.",
          ownership: "Single Ownership",
          customLogic: "24H Rapid Delivery",
          performance: "Rapid Deploy",
          build: "Build 2024.v1.0",
          authentic: "Exclusive"
        }
      },
      aboutPage: {
        seo: {
          title: "About Us — ErpolArt | Modern Software Agency",
          description: "Meet the ErpolArt team. We build modern, fast software solutions — bespoke web apps, SaaS platforms, and AI-powered automations delivered at speed."
        },
        hero: {
          titlePart1: "Digital Atelier,",
          titlePart2: "Crafting Absolute Uniqueness.",
          subtitle: "We don't just build websites. We architect bespoke digital ecosystems and exclusive templates that elevate visionary brands."
        },
        whoWeAre: {
          title: "Who We Are",
          p1: "ErpolArt was founded on a simple premise: the traditional web design agency model is broken. It's too slow, too expensive, and often relies on outdated templates that businesses outgrow in months.",
          p2: "We are a collective of designers, developers, and AI specialists. By integrating advanced Large Language Models into our workflow, we dramatically reduce the time it takes to write boilerplate code and complex logic.",
          p3: "This efficiency allows us to focus entirely on what truly matters: bespoke, premium aesthetics and flawless user experience.",
          stat1: "Faster Delivery",
          stat2: "Custom Code"
        },
        approach: {
          title: "Our Approach",
          subtitle: "Where human creativity directs and artificial intelligence accelerates.",
          items: {
            ai: { title: "AI-First Development", desc: "We utilize state-of-the-art AI code generation to formulate complex logic rapidly. The result is robust, performant code written in a fraction of the time." },
            design: { title: "Design That Converts", desc: "Aesthetics matter. We craft visually stunning interfaces utilizing 3D motion, smooth transitions, and premium typography that commands attention." },
            exclusive: { title: "Exclusive Delivery", desc: "Whether a custom build or a ready-made template, exclusivity is guaranteed. We never re-sell a template once acquired by your business." }
          }
        },
        team: {
          titlePart1: "The",
          titlePart2: "Syndicate",
          subtitle: "Meet the digital architects and creative rebels building the next generation of the web.",
          connect: "Connect",
          memberStatus: {
            coding: "Coding",
            thinking: "Thinking",
            root: "Root-Access",
            animation: "In AfterEffects"
          }
        },
        values: {
          velocity: { name: "Velocity", desc: "Accelerated turnarounds without compromising structural integrity." },
          exclusivity: { name: "Exclusivity", desc: "Your digital footprint will be inherently yours. No duplicates." },
          transparency: { name: "Transparency", desc: "Clear communication, upfront pricing, no hidden clauses." },
          quality: { name: "Quality", desc: "Obsessive attention to the micro-interactions that elevate a site." }
        },
        cta: {
          title: "Ready to accelerate?",
          subtitle: "Let's build a digital experience that leaves your competition in the dust.",
          email: "Send us an email"
        }
      },
      footer: {
        desc: "Websites Built with Intelligence. Delivered with Precision. Elevating brands bridging cutting-edge AI and premium aesthetics.",
        nav: "Navigation",
        contact: "Contact",
        ready: "Ready for your exclusive website?",
        start: "Start a Project",
        copyright: "All rights reserved.",
        tagline: "Powered by AI. Handcrafted with precision."
      },
      techMarquee: {
        title: "Our Technology Stack",
        subtitle: "Built with modern, production-ready tools."
      },
      projectsData: {
        p1: { title: "Nova Tech Solutions", cat: "Technology", desc: "A cutting-edge corporate website for an AI enterprise software company." },
        p2: { title: "Lumina Beauty", cat: "Beauty Salon", desc: "Minimalist, conversion-focused landing page for a premium aesthetic clinic." },
        p3: { title: "Velocity Rentals", cat: "Rent-a-Car", desc: "High-performance luxury car rental booking platform with dynamic availability." },
        p4: { title: "Gastronomy Lab", cat: "Restaurant", desc: "Immersive culinary experience site with online reservation and menu showcase." },
        p5: { title: "Justice Partners", cat: "Law Firm", desc: "Trust-inspiring digital presence for a top-tier legal advisory firm." },
        p6: { title: "Vanguard Fitness", cat: "Health & Fitness", desc: "Modern gym platform with membership portals and class scheduling." },
        p7: { title: "Horizon Estates", cat: "Real Estate", desc: "Exclusive property portal with VR tours and advanced search filters." },
        p8: { title: "Drip Commerce", cat: "E-commerce", desc: "Next-gen street-wear store with high-performance checkout systems." },
        p9: { title: "Aura Photography", cat: "Portfolio", desc: "Cinematic gallery for professional visual storytellers." },
        p10: { title: "CareLink Medical", cat: "Healthcare", desc: "Secure patient management and appointment booking for clinics." },
        p11: { title: "Elite Watch Co.", cat: "Luxury E-commerce", desc: "High-end timepiece catalog with secure payment and warranty tracking." },
        p12: { title: "Vivid Architecture", cat: "Architecture", desc: "Minimalist structural portfolio focusing on urban planning and interior design." },
        p13: { title: "Mastery LMS", cat: "Education", desc: "Scalable learning management system with interactive courses and certification." },
        p14: { title: "Wanderlust Travels", cat: "Travel & Tourism", desc: "Full-service travel booking platform for authentic local experiences." },
        p15: { title: "Zen Wellness", cat: "Spa & Wellness", desc: "Serene digital experience for a luxury meditation and spa retreat." }
      },
      templatesData: {
        t1: { title: "Aura Spa & Wellness", cat: "Beauty Salon", desc: "A serene and luxurious digital experience designed for high-end spa and wellness centers.", long: "Aura is a complete digital solution for wellness businesses. It focuses on tranquility and conversion, featuring integrated service menus, staff profiles, and a seamless appointment booking system." },
        t2: { title: "Lex Corporate", cat: "Law Firm", desc: "Sophisticated and trust-inspiring digital presence for legal advisory firms.", long: "Lex provides a professional edge for legal practices. It includes dedicated sections for practice areas, attorney biographies, and case studies, all wrapped in a high-contrast, authoritative design system." },
        t3: { title: "Steak & Vine", cat: "Restaurant", desc: "Immersive culinary showcase with interactive menus and reservation logic.", long: "Designed for fine dining establishments, Steak & Vine captures the essence of hospitality. It features a stunning full-screen menu and optimized location maps." },
        t4: { title: "Nomad Rentals", cat: "Rent-a-Car", desc: "High-performance luxury car rental platform with dynamic inventory.", long: "Nomad is built for speed and luxury. It includes a robust filtering system for car types and automated pricing calculators based on dates." },
        t5: { title: "Neon Creative", cat: "Portfolio", desc: "Bold and avant-garde portfolio for visual storytellers and agencies.", long: "Neon breaks the mold of traditional portfolios. With experimental navigation and custom cursor effects, it is the ultimate tool for creatives." },
        t6: { title: "Horizon Estates", cat: "Corporate", desc: "Clean, modern corporate landing page for startups and scale-ups.", long: "Horizon is designed for maximum clarity and professionalism. It features scalable service blocks and impact stats." },
        t7: { title: "Vanguard Fitness", cat: "Health & Fitness", desc: "High-energy fitness platform with membership portals and class scheduling.", long: "Vanguard is built for pulse-pounding performance. It includes dynamic schedule builders, trainer bio sections, and integrated workout log previews." },
        t8: { title: "Drip Commerce", cat: "E-commerce", desc: "Next-gen street-wear store with high-performance checkout systems.", long: "Drip is the ultimate e-commerce engine. It features a hyper-fast product discovery flow, dynamic inventory management, and one-click checkout optimizations." },
        t9: { title: "Vela Horizon Realty", cat: "realestate", desc: "Elite real estate architecture for luxury property management and global client acquisition.", long: "Vela Horizon is the ultimate digital asset for luxury real estate agencies. It features high-fidelity property galleries, region-based categorization (Istanbul, Bodrum, Antalya), and a sophisticated multilingual inquiry system designed to convert high-net-worth individuals." }
      },
      projectsPage: {
        build: "Build 2024.v1.0",
        authentic: "Authentic",
        bespoke: {
          title: "Architect Your Unique Identity",
          subtitle: "We bridge high-end aesthetics with custom, AI-accelerated engineering. Stop following—start leading with a platform engineered for your signature identity.",
          cta: "Start Your Project",
          secondary: "Explore Our Process",
          engineeringBadge: "Signature Engineering",
          feature1Label: "Strategy Call",
          feature1Desc: "1-on-1 discovery",
          feature2Label: "Zero-Copy Code",
          feature2Desc: "100% Unique",
          feature3Label: "Fast Deploy",
          feature3Desc: "Accelerated dev",
          feature4Label: "Premium Art",
          feature4Desc: "Bespoke design"
        },
        customServices: {
          badge: "Signature Architecture",
          title: "Speed and Quality,",
          titleAccent: "At Once.",
          desc1: "We break the boundaries of conventional web design. Our signature process transforms your brand's philosophy into a unique digital experience, built with absolute isolation and handwritten logic.",
          desc2: "No clones. No shortcuts. Your platform is a standalone masterpiece that reflects your vision's true singularity.",
          stat1Title: "Architectural Singularity",
          stat2Title: "Logic Transparency",
          perfMatrix: "Performance Matrix",
          stability: "Architecture Stability",
          integrity: "Logic Integrity",
          creedBadge: "The Bespoke Creed",
          creedTitle: "Every brand deserves a digital soul.",
          creedDesc: "We translate complexity into elegance and speed into competitive advantage. Our bespoke architectures aren't just tools—they are the premium digital real estate your vision demands.",
          trusted: "Trusted by Visionary Leaders Globally",
          features: {
            f1Title: "Absolute Independence",
            f1Desc: "We sever ties with cookie-cutter builders. Your digital identity is engineered from a blank canvas, ensuring complete structural and aesthetic singularity.",
            f2Title: "Enterprise-Grade Logic",
            f2Desc: "Built on modern React and advanced LLM-accelerated workflows, the underlying architecture is robust, highly scalable, and exceptionally secure.",
            f3Title: "Kinetic Aesthetics",
            f3Desc: "Static pages are dead. We integrate fluid micro-interactions, spring physics, and WebGL elements to make your brand feel genuinely alive.",
            f4Title: "Ruthless Optimization",
            f4Desc: "Speed is luxury. By writing clean, bespoke code, we eliminate bloatware, achieving lightning-fast load times and flawless SEO performance.",
            status: "Protocol Status: Active"
          },
          whyUs: "Why Us?",
          difference: "Digital Atelier Difference",
          criteria: "Criteria",
          erpolartBespoke: "ErpolArt Signature",
          standardWeb: "Standard Web",
          readyTool: "Off-the-shelf Solution",
          handmadeCode: "Signature Architecture",
          comparison: {
            archTitle: "Architecture",
            archBespoke: "Signature Architecture",
            archTemplate: "Ready-made Templates",
            singTitle: "Singularity",
            singBespoke: "Unique in the World (1/1)",
            singTemplate: "Thousands of Copies",
            perfTitle: "Performance",
            perfBespoke: "Ruthless Optimization",
            perfTemplate: "Unnecessary Code Bloat",
            seoTitle: "SEO & Google",
            seoBespoke: "Natively Compatible",
            seoTemplate: "Plugin Dependent",
            ctrlTitle: "Control",
            ctrlBespoke: "100% Freedom",
            ctrlTemplate: "Limited Tools"
          }
        },
        processTimeline: {
          title: "Strategic Development Process",
          subtitle: "Our streamlined framework transforms visionary concepts into live enterprise-grade deployments with unprecedented velocity and precision.",
          phase: "Phase",
          steps: {
            s1Title: "Discovery & Blueprint",
            s1Desc: "We dissect your brand DNA, market positioning, and objectives to architect a scalable digital strategy.",
            s2Title: "Visual Identity Conception",
            s2Desc: "Within 48 hours, we present a premium design trajectory that redefines your digital aesthetic.",
            s3Title: "Refinement & Precision",
            s3Desc: "We conduct two targeted refinement cycles to ensure the architecture aligns flawlessly with your vision.",
            s4Title: "High-Performance Engineering",
            s4Desc: "We translate the blueprint into a high-performance digital infrastructure, adhering to strict clean code principles and utilizing cutting-edge programming languages.",
            s5Title: "Deployment & Handover",
            s5Desc: "Seamless launch on elite server infrastructures, transferring complete ownership and operational control to you."
          }
        },
        projectShowcase: {
          title: "Signature",
          titleAccent: "Deployments",
          subtitle: "Curated collection of architectural masterpieces engineered for signature performance. These aren't just sites; they are competitive digital advantages.",
          live: "Live Platform",
          customEngine: "Custom Engine",
          liveView: "Live View",
          arch1: "Immaculate Core Architecture",
          arch2: "Proprietary AI Integration",
          arch3: "Zero-Copy Visual Identity",
          studyCase: "Study Full Case",
          archives: "Archives"
        },
        form: {
          titlePart1: "Start Your",
          titlePart2: "Discovery",
          subtitle: "Share your vision and let's build your unique digital path."
        },
        promise: {
          badge: "TOMORROW'S DESIGN",
          title: "Showcase Your Vision.",
          desc: "Our goal in the bespoke website design process we manage for you is for you to have a digital platform that you love using every moment and share with pride, just like other visionary brands.",
          others: "Join Other Visionary Brands."
        },
        quoteSection: {
          badge: "GET A QUOTE",
          title: "Let's Build Something.",
          subtitle: "Tell us about your project. We'll get back to you with a tailored proposal within 24 hours."
        },
        manifesto: {
          badge: "DESIGN PHILOSOPHY",
          title: "Our Principles.",
          p1Title: "Every Pixel Serves a Purpose.",
          p1Desc: "No decorative noise. Every visual element exists to guide the visitor toward the next action.",
          p2Title: "Speed Is Not a Feature, It's the Foundation.",
          p2Desc: "A site that takes 3 seconds to load loses visitors. Performance is baked into the design from day one.",
          p3Title: "Mobile First, Desktop Always.",
          p3Desc: "Most visitors arrive on mobile. Perfect on mobile means flawless everywhere else.",
          p4Title: "No Copies. Only Your Signature.",
          p4Desc: "We never give the same code to two brands. Every project is the digital DNA of one identity, and one identity alone.",
          purposeVisual: "Purposeful Design",
          speedVisual: "Load Time",
          mobileVisual: "Screen Sizes",
          uniqueVisual: "Your Signature"
        }
      },
      templateDetail: {
        liveDemo: "Live Demo",
        backToCatalog: "Back to Catalog",
        acquisitionValue: "Acquisition Value",
        readyIn24H: "Ready in 24H",
        exclusiveIP: "Exclusive IP Lock",
        archOverview: "Architectural Overview",
        dominancePart1: "Engineered for",
        dominancePart2: "absolute dominance.",
        techStack: "Technology Stack",
        integratedCaps: "Integrated Capabilities",
        responsive: "Responsive",
        mobileFirst: "Mobile-First",
        architecture: "Architecture",
        componentBase: "Component-Base",
        interactions: "Interactions",
        smooth: "Smooth",
        coreViews: "Core Views",
        seoStrategy: "SEO Strategy",
        gradeAOptimized: "Grade-A Optimized",
        fastDelivery: "Fast Delivery",
        architecting: "Architecting...",
        structureNotFound: "Structure Not Found",
        features: {
          "Professional Service Showcase": "Professional Service Showcase",
          "Smart Media & Image Gallery": "Smart Media & Image Gallery",
          "Advanced Admin Control Panel": "Advanced Admin Control Panel",
          "Blog & Content Manager": "Blog & Content Manager",
          "Online Booking & Appointment": "Online Booking & Appointment",
          "Smart Lead & Contact Forms": "Smart Lead & Contact Forms",
          "Auto Dark & Light Mode": "Auto Dark & Light Mode",
          "Multi-language Support": "Multi-language Support",
          "Full Google SEO Optimization": "Full Google SEO Optimization",
          "Ultra-Fast Speed & Performance": "Ultra-Fast Speed & Performance",
          "Premium Animations & UI": "Premium Animations & UI",
          "Data Protection & Secure SSL": "Data Protection & Secure SSL",
          "One-Page Architecture": "One-Page Architecture"
        }
      },
      checkout: {
        pciDssHint: "PCI-DSS Level 1 Encrypted Terminal",
        backToDetails: "Back to Details",
        breadcrumb: "Checkout",
        title: "Finalize",
        titleAccent: "Acquisition",
        subtitle: "Secure your intellectual property rights. Once the transaction is verified, you will instantly receive access to the deployment repository and design files.",
        billingTitle: "Billing Information",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        emailLabel: "Email Address (For Delivery)",
        phoneLabel: "Phone Number",
        addressLabel: "Billing Address",
        taxIdLabel: "TC Identity / Tax ID (Optional)",
        paymentTitle: "Payment Protocol",
        bankTransfer: "Bank Transfer / EFT",
        transferDetails: "Bank Transfer Details",
        cardPayment: "Credit / Debit Card",
        cardPaymentDesc: "Iyzico Secure Payment Infrastructure",
        securePaymentNote: "Your payment is securely processed via Iyzico 3D Secure infrastructure.",
        paymentReceived: "PAYMENT SUCCESSFUL",
        securePaymentComplete: "SECURE PAYMENT COMPLETED",
        iban: "IBAN",
        accountHolder: "Account Holder",
        referenceDesc: "Order Reference",
        activationNote: "Your system will be automatically activated after payment is confirmed.",
        orderIdLabel: "Order Reference No",
        copyReference: "Copy Code",
        orderSummary: "Order Summary",
        encrypted: "End-to-End Encrypted",
        license: "License",
        digitalArch: "Digital Architecture",
        fee: "License Fee",
        ipTransfer: "IP Protection & Transfer",
        included: "Included",
        taxes: "Taxes",
        taxCalc: "Calculated at next step",
        total: "Total Due",
        perks: {
          codes: "Full Source Code Delivery",
          rights: "Lifetime Non-Exclusive Rights",
          download: "Instant Download Access"
        },
        authorize: "Authorize Payment",
        payCrypto: "Pay via Coinbase Wallet",
        ssl: "SSL Secured Transaction",
        addons: {
          chatbot: { name: "AI Chatbot Integration", desc: "Custom trained AI assistant" },
          language: { name: "Multi-Language Module", desc: "Global i18n infrastructure" },
          crm: { name: "CRM Lead Integration", desc: "Automated customer tracking" },
          seo: { name: "Advanced SEO Optimization", desc: "Search engine dominance" }
        },
        platinumArch: "Platinum Architecture",
        premiumArch: "Premium Architecture",
        establishingConnection: "Establishing Connection...",
        protocolError: "PROTOCOL ERROR",
        returnToCatalog: "Return to Catalog",
        protocolRestriction: "Protocol Restriction",
        secureGateway: "Secure Gateway",
        selectedArchitecture: "Selected Architecture",
        customSaaSArchitecture: "Custom SaaS Architecture",
        revisionsIncluded: "5 Revisions Included",
        clientLabel: "Client:",
        maintenanceTitle: "Monthly System Management",
        noCommitment: "No Commitment",
        maintenanceDesc: "Server optimization and technical support. No commitment, cancel anytime.",
        systemContinuity: "System Continuity",
        monthlyMaintenance: "Monthly Maintenance",
        cancelAnytime: "Cancel Anytime",
        extraServices: "Extra Services",
        oneTime: "One-Time",
        pricePolicyDesc: "This amount covers one-time system setup, architecture build, and premium module integration costs.",
        acquisitionProtocol: "Acquisition Protocol",
        completePayment: "Complete Payment",
        oneTimeInvestment: "One-Time Investment",
        maintenanceLabel: "Mo",
        secureTerminal: "Secure Terminal",
        encryptionHint: "End-to-End Encrypted",
        protocolSecured: "Protocol Secured",
        authSuccessDesc: "Authorization successful. We are preparing your system.",
        finalizingNode: "Finalizing Node...",
        emailLocked: "Verified from your account",
        transferAmount: "Transfer Amount",
        orderCreatedDesc: "Complete the transfer to activate your system",
        referenceHint: "Add this code to the transfer description for quick activation.",
        fillBrandDetails: "Fill Brand Details Now",
        goToDashboard: "Go to Dashboard"
      },
      dashboard: {
        welcome: "Welcome",
        memberSince: "Member since",
        browseTemplates: "Browse Templates",
        purchases: "Purchases",
        activeSites: "Active Sites",
        accountStatus: "Account Status",
        active: "Active",
        quickActions: "Quick Actions",
        exploreTemplates: "Explore Templates",
        exploreDesc: "Browse our premium template collection",
        myPurchases: "My Purchases",
        purchasesDesc: "View and download purchased templates",
        accountSettings: "Account Settings",
        settingsDesc: "Update your profile and preferences",
        go: "Go",
        recommended: "Recommended Templates",
        viewAll: "View All"
      },
      purchases: {
        title: "My Purchases",
        subtitle: "View and manage your purchased templates.",
        emptyTitle: "No Purchases Yet",
        emptyDesc: "You haven't purchased any templates yet. Browse our collection and find the perfect template for your project.",
        browseCTA: "Browse Templates",
        download: "Download"
      },
      account: {
        title: "Account Settings",
        subtitle: "Manage your profile and security settings.",
        updateSuccess: "Profile updated successfully!",
        profile: "Profile",
        personalInfo: "Personal Information",
        fullName: "Full Name",
        saving: "Saving...",
        saveChanges: "Save Changes",
        security: "Security",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        updatePassword: "Update Password"
      },
      saasPage: {
        hero: {
          badge: "NEXT-GEN SOFTWARE",
          titlePart1: "Empower Your Business",
          titlePart2: "with Precision.",
          subtitle: "We build custom SaaS platforms, AI-powered dashboards, and intelligent automation systems that transform how businesses operate and scale.",
          cta: "Start Your SaaS Project",
          secondary: "Explore Capabilities"
        },
        features: {
          badge: "CORE CAPABILITIES",
          title: "Engineering",
          titleAccent: "Precision.",
          subtitle: "From conversational AI to real-time analytics, we architect the software infrastructure that gives your business an unfair advantage.",
          chatbot: { title: "AI Chatbot Integration", desc: "Custom-trained conversational AI agents for customer support, sales assistance, and internal operations. Powered by GPT-4, Claude, and proprietary models." },
          dashboard: { title: "Smart Dashboard & Analytics", desc: "Real-time KPI tracking, predictive analytics, and interactive data visualizations that turn raw data into actionable business intelligence." },
          automation: { title: "Workflow Automation", desc: "Eliminate repetitive tasks with intelligent automation pipelines. From email sequences to inventory management, we automate your operations." },
          api: { title: "API & Integration Hub", desc: "Seamless third-party integrations with payment gateways, CRMs, ERPs, and custom webhooks. Your SaaS, connected to everything." },
          security: { title: "Security & Compliance", desc: "Enterprise-grade security with end-to-end encryption, role-based access control, and full compliance with GDPR, SOC2, and KVKK." },
          infrastructure: { title: "Scalable Cloud Architecture", desc: "Cloud-native microservices built on AWS, GCP, or Azure. Auto-scaling infrastructure that grows with your user base from 100 to 100,000+." }
        },
        showcase: {
          badge: "CASE STUDIES",
          title: "Deployed",
          titleAccent: "Solutions.",
          subtitle: "Real-world SaaS platforms we've architected and deployed for businesses across industries.",
          project1: { title: "NexusAI CRM", desc: "AI-powered customer relationship platform with predictive lead scoring and automated outreach.", stack: "Next.js · OpenAI · PostgreSQL" },
          contractoros: { 
            title: "ContractorOS", 
            desc: "Enterprise-grade management ecosystem for modern contractors. Real-time project tracking, automated invoicing, and intelligent lead management.", 
            stack: "Next.js · Supabase · AI",
            caseStudy: {
              challenge: "Fragmented communication, lost paperwork, and budget overruns in construction projects create massive chaos. Manual management of teams, materials, and schedules is the industry's biggest bottleneck.",
              solution: "A unified construction ecosystem built with Next.js and Supabase. It synchronizes the entire project lifecycle—from lead management to automated PDF invoicing and real-time budget tracking—into a single, high-performance platform.",
              features: [
                "Real-time Analytics (Visualization with Recharts)",
                "Automated Document & Invoice Generation (React-PDF)",
                "Instant Communication & Notification System (Resend)",
                "Secure & Fast Data Architecture (Supabase SSR)"
              ],
              results: [
                { label: "Operational Efficiency", value: "+40%" },
                { label: "Reduction in Paperwork", value: "100%" },
                { label: "Data Transparency", value: "Total" }
              ]
            }
          },
          brandpulse: { 
            title: "BrandPulse AI", 
            desc: "AI-driven social media analytics and trend prediction platform. Track your brand's digital heart beat with real-time sentiment analysis and automated reporting.", 
            stack: "Next.js · OpenAI · Pinecone",
            caseStudy: {
              challenge: "In the fast-paced digital world, brands struggle to track their reputation and social media impact in real-time. Manually analyzing thousands of mentions across platforms is impossible, leading to missed strategic opportunities.",
              solution: "A cutting-edge social media intelligence platform powered by AI. BrandPulse AI aggregates data, performs deep sentiment analysis, and visualizes complex engagement trends using interactive Recharts dashboards, providing a 24/7 digital pulse for brands.",
              features: [
                "Real-time Sentiment Analysis (AI Powered)",
                "Interactive Trend Visualization (Recharts)",
                "Multi-Channel Data Aggregation",
                "Automated Brand Reputation Reports"
              ],
              results: [
                { label: "Tracking Capacity", value: "+120%" },
                { label: "Analysis Speed", value: "<500ms" },
                { label: "Sentiment Accuracy", value: "98%" }
              ]
            }
          },
          project2: { title: "Reseva AI", desc: "Real-time business intelligence dashboard with custom KPI tracking and team collaboration.", stack: "React · D3.js · Supabase" },
          project3: { title: "AutoScale Commerce", desc: "Full-stack e-commerce SaaS with inventory automation, multi-vendor support, and AI recommendations.", stack: "Node.js · Stripe · Redis" }
        },
        cta: {
          badge: "QUICK QUOTE",
          title: "Ready to build your SaaS?",
          subtitle: "Let's architect a platform that scales with your ambition.",
          button: "Start Project"
        },
        caseStudy: {
          footerTitlePart1: "Start Your Own",
          footerTitlePart2: "NEXT-GEN SOFTWARE",
          footerSubtitle: "Ready to transform your industry? Share your vision and let's architect a solution that scales."
        },
        techStack: {
          badge: "TECHNOLOGY STACK",
          title: "Built With the Best",
          subtitle: "We use battle-tested, cutting-edge technologies trusted by world-class engineering teams."
        },
        scope: {
          badge: "PROJECT SCOPE",
          title: "Choose Your",
          titleAccent: "Starting Point.",
          subtitle: "Every project is unique. These scopes give you a starting point — we'll tailor the final proposal to your exact needs.",
          cta: "Get a Custom Quote",
          mvp: {
            tag: "MVP",
            title: "Launch Fast",
            for: "For founders & early-stage startups",
            timeline: "1 – 2 weeks",
            timelineLabel: "Estimated Timeline",
            features: [
              "Auth & user management",
              "Core feature (1 main module)",
              "Admin dashboard",
              "Payment integration",
              "Mobile responsive"
            ]
          },
          growth: {
            tag: "GROWTH",
            title: "Scale Smart",
            for: "For growing teams & validated products",
            timeline: "2 – 4 weeks",
            timelineLabel: "Estimated Timeline",
            badge: "Most Popular",
            features: [
              "Everything in MVP",
              "AI / LLM integration",
              "Advanced analytics",
              "Role-based access control",
              "API gateway & webhooks",
              "Multi-tenancy support"
            ]
          },
          enterprise: {
            tag: "ENTERPRISE",
            title: "No Limits",
            for: "For complex, high-scale systems",
            timeline: "1 – 2 months",
            timelineLabel: "Estimated Timeline",
            features: [
              "Custom architecture",
              "White-label option",
              "On-premise deployment",
              "Dedicated SLA",
              "Custom integrations",
              "Priority support"
            ]
          }
        },
        faq: {
          badge: "FAQ",
          title: "Common",
          titleAccent: "Questions.",
          items: [
            { q: "How long does a SaaS project take?", a: "It depends on scope. MVP projects are delivered in 1-2 weeks, growth-stage platforms in 2-4 weeks, and complex enterprise systems in 1-2 months. We always agree on a clear timeline before starting." },
            { q: "Do we own the source code?", a: "100% yes. After delivery, all source code, the database, and the infrastructure belong to you. No lock-in, ever." },
            { q: "Can we add features later?", a: "Absolutely. We build with scalability in mind. New modules can be added at any time, either through a retainer plan or as a separate project." },
            { q: "How does pricing work?", a: "Every project is unique, so we don't publish fixed prices. We assess the scope, timeline, and technical requirements, then send a fixed-price proposal. No surprises." },
            { q: "Is post-launch support included?", a: "Launch support is always included. For ongoing maintenance, we offer monthly retainer plans with priority response times." },
            { q: "How do we communicate during the project?", a: "Via WhatsApp or our website contact form for instant messaging, weekly progress reports, and video calls when needed. Full transparency throughout." }
          ]
        }
      },
      automationsPage: {
        hero: {
          badge: "AI AUTOMATIONS",
          title: "Intelligent",
          titleAccent: "AI Automations",
          subtitle: "Streamline your business with autonomous AI agents, smart workflow automations, and intelligent data pipelines. We build the digital brain that powers your enterprise 24/7.",
          cta: "Start Your Project",
          secondary: "See How It Works"
        },
        features: {
          badge: "CORE CAPABILITIES",
          title: "What We",
          titleAccent: "Automate.",
          subtitle: "From conversational AI to autonomous agents — we design and deploy intelligent systems that eliminate repetitive work and scale your operations.",
          chatbot: { title: "AI Chatbot & Conversational AI", desc: "Custom-trained conversational AI for customer support, sales assistance, and internal operations. Powered by GPT, Claude, and proprietary LLMs." },
          agents: { title: "Autonomous AI Agents", desc: "Self-directed AI agents that plan, reason, and execute multi-step tasks without human intervention. Built with LangChain and custom agent frameworks." },
          automation: { title: "Workflow Automation", desc: "Eliminate repetitive tasks with intelligent automation pipelines. From email sequences to inventory management — we automate your operations end-to-end." },
          data: { title: "Data Processing & ETL", desc: "Scalable pipelines that extract, transform, and load data from any source. Real-time processing with event-driven architecture and smart normalization." },
          document: { title: "Document AI", desc: "Intelligent document processing — extract structured data from PDFs, invoices, contracts, and forms using vision AI and LLMs." },
          reporting: { title: "Reporting Automation", desc: "Automated dashboards and scheduled reports delivered to your inbox. Transform raw data into executive-ready insights on autopilot." }
        },
        showcase: {
          badge: "USE CASES",
          title: "Real-World",
          titleAccent: "Automation.",
          subtitle: "Intelligent automation systems we've designed and deployed for businesses across industries.",
          ecommerce: {
            title: "E-Commerce Automation",
            desc: "End-to-end order processing, inventory sync, and customer communication on autopilot.",
            stack: "n8n · OpenAI · Stripe · Supabase",
            challenge: "Manual order tracking, fragmented inventory updates, and delayed customer communication were creating operational bottlenecks and reducing customer satisfaction.",
            solution: "A fully automated e-commerce backend: orders trigger inventory updates, payment confirmations fire personalized emails, and low-stock alerts are sent to suppliers — all without human touch.",
            features: ["Automated order-to-fulfillment pipeline", "Real-time inventory sync across channels", "AI-generated personalized customer emails", "Low-stock & reorder automation"],
            results: [{ label: "Manual Work Reduced", value: "85%" }, { label: "Response Time", value: "<2 min" }, { label: "Order Accuracy", value: "99.8%" }]
          },
          support: {
            title: "AI Support Bot",
            desc: "24/7 intelligent customer support bot trained on your product knowledge base.",
            stack: "Claude AI · Pinecone · Supabase · Node.js",
            challenge: "A growing SaaS company was overwhelmed with repetitive support tickets, consuming 60% of team time on questions already answered in their documentation.",
            solution: "A Claude-powered support bot trained on the company's documentation, FAQs, and past tickets. It handles 80% of inquiries autonomously and escalates complex issues to the human team.",
            features: ["RAG-based knowledge retrieval (Pinecone)", "Multi-language support", "Automatic human escalation", "Ticket logging & analytics"],
            results: [{ label: "Tickets Automated", value: "80%" }, { label: "Avg. Response Time", value: "<5 sec" }, { label: "Team Hours Saved", value: "120/mo" }]
          },
          crm: {
            title: "Lead & CRM Automation",
            desc: "Automated lead scoring, nurturing sequences, and CRM updates without lifting a finger.",
            stack: "Make.com · GPT-4 · HubSpot · Webhooks",
            challenge: "Sales reps were manually updating CRM records, sending follow-up emails, and scoring leads — losing hours every day to admin work instead of selling.",
            solution: "A fully automated lead management system: new leads are scored by AI, segmented, enrolled in personalized nurture sequences, and CRM records updated in real time.",
            features: ["AI-powered lead scoring & segmentation", "Automated multi-step nurture sequences", "Real-time CRM sync (HubSpot/Salesforce)", "Weekly performance digest reports"],
            results: [{ label: "CRM Update Time", value: "0 min" }, { label: "Lead Response Speed", value: "+340%" }, { label: "Sales Admin Time", value: "-70%" }]
          }
        },
        scope: {
          badge: "PROJECT SCOPE",
          title: "Your Automation",
          titleAccent: "Journey.",
          subtitle: "Every automation project is unique. These scopes give you a starting point — we'll tailor the final proposal to your exact needs.",
          cta: "Get a Custom Quote",
          starter: {
            tag: "STARTER", title: "First Bot", for: "For businesses automating a single process",
            timeline: "1 – 2 weeks", timelineLabel: "Estimated Timeline",
            features: ["1 chatbot or workflow automation", "Integration with 2-3 tools", "Basic analytics & reporting", "1-month post-launch support", "Knowledge base setup"]
          },
          growth: {
            tag: "GROWTH", title: "Full Stack", for: "For teams building a complete automation layer",
            timeline: "2 – 4 weeks", timelineLabel: "Estimated Timeline", badge: "Most Popular",
            features: ["Everything in Starter", "Multi-step AI agent workflows", "CRM & data platform integrations", "Custom AI model fine-tuning", "Advanced analytics dashboard", "Priority support & SLA"]
          },
          enterprise: {
            tag: "ENTERPRISE", title: "Full Autopilot", for: "For organizations automating at scale",
            timeline: "1 – 2 months", timelineLabel: "Estimated Timeline",
            features: ["Unlimited workflows & agents", "Custom LLM deployment", "On-premise or private cloud", "SOC2 & GDPR compliance", "Dedicated automation engineer", "24/7 monitoring & support"]
          }
        },
        faq: {
          badge: "FAQ",
          title: "Common",
          titleAccent: "Questions.",
          items: [
            { q: "What exactly is AI automation?", a: "AI automation uses artificial intelligence to execute tasks that previously required human effort: from answering customer queries, to processing documents and syncing data across systems. We design, build, and deploy these systems end-to-end." },
            { q: "How long does an automation project take?", a: "Simple automations are delivered in 1-2 weeks. Full automation stacks take 2-4 weeks, and enterprise-scale agent systems take 1-2 months. We always agree on a clear timeline before starting." },
            { q: "Do I need technical knowledge to use the automations?", a: "No. We design automations that run entirely in the background. You interact through dashboards, reports, or your existing tools. No code, no configuration on your end." },
            { q: "Which platforms and tools can you integrate?", a: "We integrate with virtually any platform with an API: CRMs (HubSpot, Salesforce), communication tools (WhatsApp, Slack, email), payment systems (Stripe), ERPs, custom databases, and more." },
            { q: "How is pricing structured?", a: "Every project is scoped individually. After understanding your workflows and goals, we send a fixed-price proposal with no surprises. Ongoing maintenance is available as a monthly retainer." },
            { q: "What happens after the automation goes live?", a: "Launch support is always included. We monitor the system, fix issues, and provide documentation. For ongoing improvements and new automations, we offer retainer plans with priority response." }
          ]
        },
        cta: { badge: "QUICK QUOTE", title: "Ready to automate your operations?", subtitle: "Let's build the intelligent systems that handle the repetitive work while you focus on growth.", button: "START YOUR PROJECT" },
        techStack: { badge: "AI & AUTOMATION STACK" }
      },
      contact: {
        title: "Let's Architect Your Vision",
        titlePart1: "Share Your",
        titleAccent: "Vision.",
        subtitle: "Our goal in the bespoke website design process we manage for you is to build a digital platform that you love using every moment, just like other visionary brands.",
        directLabel: "DIRECT CONTACT / EMAIL",
        fullName: "Your Name",
        email: "Email Address",
        service: "Service Type",
        budget: "Estimated Budget",
        description: "Project Description",
        descPlaceholder: "Briefly describe your vision, goals, and any specific requirements...",
        launch: "Start Project",
        launching: "INITIALIZING...",
        timelineLabel: "Target Timeline",
        timelineOptions: {
          t1: "1-2 Weeks",
          t2: "1 Month",
          t3: "3 Months+",
          t4: "Flexible"
        },
        services: {
          branding: "Bespoke Web Design",
          ai: "SaaS Development",
          automation: "AI Automation",
          ecommerce: "Luxury E-Commerce",
          enterprise: "Enterprise Platform"
        },
        success: {
          title: "Signal Received.",
          message: "Your project data has been securely transmitted. Our team will review your vision and reach out within 24 hours.",
          emailNote: "A confirmation and our proposal will be sent to",
          cta: "Send Another Signal"
        }
      },
      customerDashboard: {
        stats: {
          purchasedAssets: "PURCHASED ASSETS",
          activeSystems: "ACTIVE SYSTEMS",
          protocolStatus: "PROTOCOL STATUS",
          verified: "VERIFIED"
        },
        sections: {
          assets: "MY DIGITAL ASSETS / PURCHASED PROJECTS",
          shortcuts: "SYSTEM SHORTCUTS"
        },
        status: {
          active: "ACTIVE SYSTEM",
          revision: "AWAITING REVISION",
          development: "IN DEVELOPMENT",
          processing: "PROCESSING",
          pending: "WAITING FOR PAYMENT"
        },
        empty: {
          desc: "No assets acquired yet. Are you ready to initialize your first project?",
          cta: "EXPLORE ARCHITECTURE"
        },
        noAssets: "No assets acquired yet.",
        exploreArchitecture: "EXPLORE ARCHITECTURE",
        investmentValue: "Investment Value",
        paid: "PAID",
        nodeIdentityActive: "NODE IDENTITY: ACTIVE",
        premiumDigitalAsset: "Premium Digital Asset",
        actions: {
          explore: { title: "Explore Architecture", desc: "Browse our premium template collection" },
          identity: { title: "Identity Settings", desc: "Update your profile and preferences" },
          support: { title: "Technical Support", desc: "Connect with our architectural team" }
        }
      },
      auth: {
        premiumPlatform: "Premium Platform",
        heroTitlePart1: "BUILD YOUR",
        heroTitlePart2: "DIGITAL",
        heroTitlePart3: "ARCHITECTURE",
        heroSubtitle: "Login to the ErpolArt ecosystem and manage your systems.",
        features: {
          favorites: "Favorites",
          templates: "Premium Templates",
          checkout: "Secure Protocol",
          experience: "Flawless Experience"
        },
        signin: "Sign In",
        signup: "Sign Up",
        orWithEmail: "OR WITH EMAIL",
        email: "EMAIL ADDRESS",
        emailPlaceholder: "example@mail.com",
        password: "PASSWORD",
        forgotPassword: "Forgot Password?",
        signinSubmit: "SIGN IN",
        signupSubmit: "SIGN UP",
        noAccount: "Don't have an account? ",
        alreadyMember: "Already a member? ",
        copyright: "© 2026 ErpolArt Digital Atelier",
        legalHintPart1: "By signing in, you agree to our ",
        terms: "Terms of Service",
        legalHintPart2: " and ",
        privacy: "Privacy Policy",
        legalHintPart3: ".",
        loginErrorPrefix: "Error: ",
        passwordMismatch: "Passwords do not match.",
        passwordCheck: {
          chars: "Min 6 Chars",
          match: "Match"
        },
        checkEmail: "Check Your Email",
        verificationSent: "Verification link sent to",
        verifiedSuccess: "Email Verified!",
        verifiedSubtitle: "Your account has been verified. Please sign in to continue.",
        returnToSignIn: "Return to Sign In",
        premiumAccess: "PREMIUM ACCESS",
        fullName: "FULL NAME",
        fullNamePlaceholder: "Your Full Name",
        confirmPassword: "CONFIRM PASSWORD"
      },

      proposalPage: {
        loading: "Decrypting Protocol...",
        notFound: "Proposal not found or may have expired.",
        returnHome: "Return to Home",
        badge: "CUSTOM PROJECT PROPOSAL",
        clientLabel: "CLIENT",
        verified: "Verified B2B Protocol",
        issued: "Issued",
        tierPremium: "PREMIUM PROFESSIONAL",
        tierPlatinum: "PLATINUM ELITE",
        saasTitle: "Custom SaaS Architecture",
        saasTitleAccent: "Proposal",
        autoTitle: "AI Automation System",
        autoTitleAccent: "Proposal",
        techStack: "Technology Stack",
        modules: "Core Modules",
        notes: "Project Notes",
        included: "What's Included",
        includedItems: [
          { title: "Source Code Delivery", desc: "Full source code delivered via GitHub with complete history." },
          { title: "Production Deployment", desc: "Live environment setup and deployment support included." },
          { title: "Technical Documentation", desc: "API references and architecture docs prepared." },
          { title: "Revision Rights", desc: "{n} revision rounds are included in the project scope." },
          { title: "Post-Launch Support", desc: "30 days of technical support after delivery." },
          { title: "Weekly Sync Calls", desc: "Progress meetings throughout the development phase." }
        ],
        nextSteps: "Next Steps",
        steps: [
          { num: "01", title: "Payment", desc: "Approve the project and complete the initial payment." },
          { num: "02", title: "Kickoff", desc: "Detailed briefing meeting and project plan creation." },
          { num: "03", title: "Development", desc: "Project is built using the agreed technology stack." },
          { num: "04", title: "Delivery", desc: "Tested and documented project is handed over." }
        ],
        investment: "Investment Summary",
        fixedFee: "Fixed Implementation Fee",
        timelineLabel: "Delivery Timeline",
        revisionsLabel: "Revision Rights",
        cta: "APPROVE & PROCEED TO PAYMENT",
        secure: "SECURE PAYMENT PROTOCOL",
        encryption: "End-to-End Encryption",
        questionLabel: "Have questions?",
        questionLink: "Contact us",
        revisionTitle: "Request a Change or Addition",
        revisionSubtitle: "Want to add something or modify the scope? Let us know.",
        revisionPlaceholder: "Describe the change or addition you'd like to request...",
        revisionCta: "Send Request",
        revisionSent: "Your request has been received. We'll update the proposal shortly."
      },

    }
  },
  tr: {
    translation: {
      legal: legalTranslations.tr,
      checkoutAgreements: legalTranslations.tr.agreements,
      orderSuccess: {
        celebration: "SİPARİŞ ONAYLANDI",
        title: "Protokol",
        titleAccent: "Başlatıldı.",
        subtitle: "Dijital mimariniz için gerekli marka varlıklarını ve detayları tanımlayın.",
        revision: "REVİZYON #",
        editDesc: "Girişlerinizi ihtiyaçlarınıza daha iyi uyacak şekilde değiştirebilirsiniz. Değişiklikler bir sonraki güncelleme döngüsünde işlenecektir.",
        form: {
          brandName: "MARKA / PROJE ADI",
          brandNamePlaceholder: "Örn: ErpolArt Studio",
          editLimit: "1 REVİZYON HAKKI",
          manualReview: "MANUEL KONTROL",
          uploadLogo: "LOGO YÜKLE",
          nullEntity: "GÖRSEL SEÇ",
          colors: "MARKA RENKLERİ",
          notes: "MİMARİ NOTLAR (OPSİYONEL)",
          notesPlaceholder: "Projeye dair eklemek istediğiniz detaylar...",
          uploadHint: "Sürükleyip bırakın veya yüklemek için tıklayın. Sadece şeffaf arka planlı PNG/SVG kabul edilir.",
          alertLogo: "Lütfen sadece şeffaf arka planlı PNG veya SVG dosyaları yükleyin.",
          submit: "Kişiselleştirmeyi Onayla",
          submitting: "Protokol İşleniyor...",
          saveChanges: "Değişiklikleri Kaydet",
          saveSuccess: "Mantık başarıyla güncellendi. Yönlendirme başlatılıyor...",
          errorTitle: "PROTOKOL HATASI",
          submitError: "Dağıtım başlatılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
          saveError: "Senkronizasyon Hatası",
          fetchError: "Veri Çekme Hatası",
          loadError: "Mimari veriler yüklenemedi. Protokol yenileniyor...",
          trackStatus: "Sipariş Durumunu Takip Et",
          fileLimitError: "Mimari bir dokunuş: Lütfen logonuzu 5MB'dan daha düşük bir boyutta yükleyin. Bu, sisteminizin performansını korumamıza yardımcı olur.",
          addonsTitle: "EK GEREKSİNİMLER (ADD-ONS)",
          aiContextLabel: "YAPAY ZEKA ASİSTAN BAĞLAMI / PROMPT",
          aiContextPlaceholder: "Örn: Asistanımız son derece kibar ve profesyonel bir tonda konuşmalıdır. Amacı, ziyaretçilerin iletişim bilgilerini almak ve fiyat soranları doğrudan randevu formuna yönlendirmektir...",
          targetLanguagesLabel: "HEDEF DİLLER (ÖRN. İNGİLİZCE, TÜRKÇE, ALMANCA)",
          targetLanguagesPlaceholder: "Türkçe, İngilizce, Almanca vb."
        }
      },
      orderCancel: {
        title: "Ödeme",
        titleAccent: "Başarısız.",
        subtitle: "Ödeme süreci tamamlanamadı. Endişelenmeyin, hesabınızdan herhangi bir tahsilat yapılmadı. Tekrar deneyebilir veya teknik destek ekibimizle iletişime geçebilirsiniz.",
        retry: "Ödemeyi Tekrar Dene",
        retryDesc: "Şablon galerisine dönün ve işlemi tekrar deneyin.",
        backToHome: "Atölyeye Dön",
        support: "Destek Al",
        supportDesc: "Yardıma mı ihtiyacınız var? Mühendislik desteğimiz satın alımınızda yardımcı olmak için hazır.",
        securityShield: "GÜVENLİ REPLIKA KALKANI AKTİF",
        alerts: {
          success: "Ödeme Başarıyla Alındı!",
          failed: "Ödeme Tamamlanamadı. Lütfen kart bilgilerinizi kontrol edin."
        }
      },
      globalSignal: {
        title: "Ödeme Doğrulandı",
        message: "Sinyal alındı ve node bağlantısı sağlandı. Mimariyi kişiselleştirmek için Protokol Formuna yönlendiriliyorsunuz.",
        connecting: "Bağlantı Kuruluyor..."
      },
      common: {
        pages: "Sayfa",
        items: "Öğe",
        loading: "Yükleniyor...",
        edit: "Kurulum Bilgilerini Düzenle",
        architectureNotFound: "Mimari bulunamadı.",
        proceedToWorkspace: "Dağıtıma Hazır"
      },
      purchases: {
        subtitle: "Dijital varlıklarınızı yönetin ve kurulum detaylarını tamamlayın.",
        totalAssets: "Toplam Varlık",
        emptyTitle: "Henüz Dijital Varlığınız Yok",
        emptyDesc: "Henüz bir şablonunuz bulunmuyor. ErpolArt'ın premium dünyasını keşfetmeye ne dersiniz?",
        browseCTA: "Şablonları Keşfet"
      },
      nav: { home: "Ana Sayfa", projects: "Projeler", templates: "Şablonlar", saas: "SaaS", automations: "AI Otomasyonlar", about: "Hakkımızda", contact: "İletişim", myPurchases: "Siparişlerim", accountSettings: "Hesap Ayarları", logout: "Çıkış Yap", signIn: "Giriş Yap", register: "Kayıt Ol" },
      status: {
        acquired: "EDİNİLDİ",
        offMarket: "SATIŞA KAPALI"
      },
      hero: {
        title1: "Modern işler için",
        title2: "Modern Yazılım.",
        subtitle: "Özel mühendislik harikası web deneyimleri ve tek sahibine özel satılan şablonlar. Eşsiz hassasiyet ve hızla teslim edilir.",
        viewProjects: "Projeleri İncele",
        browseTemplates: "Şablonlara Göz At",
        scroll: "KAYDIR"
      },
      howItWorks: {
        title: "Modern Dijital Çözümler",
        subtitle: "Vizyonunuza uygun mühendislik yolunu seçin. Anında ayrıcalıktan karmaşık SaaS ekosistemlerine kadar.",
        path1: "SEÇENEK 01: İMZA ŞABLONLAR",
        path1Title: "İmza",
        path1TitleAccent: "Şablonlar",
        path1Desc: "Anında mükemmeliyet bekleyen işletmeler için önceden tasarlanmış şaheserler. Her şablon yalnızca BİR kez satılır—benzersiz dijital kimliğinizi garanti eder.",
        path1Badge1: "24 SAATTE YAYIN",
        path1Badge2: "Temiz Kod",
        path1Explore: "Koleksiyonu İncele",

        path2: "SEÇENEK 02: ÖZEL YAZILIM",
        path2Title: "Özel",
        path2TitleAccent: "Mimariler",
        path2Desc: "Tamamen görsel ve işlevsel bir yeniden doğuş. Markanızın DNA'sına ve stratejik büyüme hedeflerinize göre özelleştirilmiş benzersiz dijital evrenler tasarlıyoruz.",
        path2Badge1: "AI HASSASİYETİ",
        path2Badge2: "Ölçeklenebilir Mantık",
        path2Explore: "Özel Yolculuğa Başlayın",

        path3: "SEÇENEK 03: SAAS PROJELERİ",
        path3Title: "Akıllı SaaS",
        path3TitleAccent: "Ekosistemleri",
        path3Desc: "Yapay zeka destekli sohbet robotlarından gerçek zamanlı analitik panellere kadar, operasyonlarınızı dönüştüren ölçeklenebilir SaaS platformları inşa ediyoruz.",
        path3Badge1: "AI ENTEGRELİ",
        path3Badge2: "Kurumsal Bulut",
        path3Explore: "SaaS Projelerini Keşfedin",
        path4: "SEÇENEK 04: YAPAY ZEKA OTOMASYONLARI",
        path4Title: "Akıllı",
        path4TitleAccent: "AI Otomasyonları",
        path4Desc: "Otonom yapay zeka ajanları ve akıllı iş akışı otomasyonları ile iş operasyonlarınızı kolaylaştırın. İşletmenizi 7/24 güçlendiren dijital beyni inşa ediyoruz.",
        path4Badge1: "OTONOM AJANLAR",
        path4Badge2: "Verimlilik Merkezi",
        path4Explore: "AI Otomasyonlarını Keşfedin",

        systemStatus: "Sistem Çekirdek Durumu",
        enterpriseArch: "Kurumsal Mimari",
        globalScale: "Küresel Ölçek İçin İnşa Edildi",
        badgeOptimized: "Optimize Düzen"
      },
      latest: {
        title: "Laboratuvardan Yeni Çıkanlar",
        titlePart1: "Laboratuvardan",
        titlePart2: "Yeni Çıkanlar",
        subtitle: "Performans için tasarlanmış ve büyülemek için geliştirilmiş en son dijital kreasyonlarımız.",
        viewAll: "Tüm Çalışmaları Gör",
        new: "Yeni",
        viewPresentation: "Sunumu İncele",
        buyNow: "Satın Al",
        sold: "SATILDI",
        explore: "Keşfet",
        browseFull: "Tüm koleksiyonumuza göz atmak için tıklayın"
      },
      aboutTeaser: {
        title: "Web'in dinamik, güzel ve hassasiyetle tasarlanmış olması gerektiğine inanıyoruz. ErpolArt, insan yaratıcılığı ve yapay zeka verimliliğinin kesiştiği noktadadır.",
        subtitle: "Biz sadece yazılımcı değiliz. Yeni nesil premium web deneyimleri inşa eden dijital mimarlarız.",
        discover: "Hikayemizi keşfedin"
      },
      templatesPage: {
        catalog: "Katalog 2024.v1",
        availability: {
          all: "Tüm Varlıklar",
          available: "Kuruluma Hazır",
          acquired: "Özel Portfolyo"
        },
        titlePart1: "Hazır",
        titlePart2: "Ayrıcalıklar.",
        subtitle: "Her dijital mimari sadece tek bir markaya özeldir; satın alım sonrası katalogdan kalıcı olarak kaldırılır. Sisteminizi seçin ve verilerinizi iletin, projenizi 24 saat içinde anahtar teslim yayına alalım. Sıfır klon, maksimum hız.",
        protocolTitle: "Sıkı Ayrıcalık Protokolü",
        protocolDescText: "Şablonlarımız yalnızca bir kez satılır. Satın alındıktan sonra mimari katalogdan kalıcı olarak kaldırılır. Sadece bir site almıyorsunuz; size özel bir fikri mülkiyet elde ediyorsunuz.",
        deployment: "24 Saatte Hızlı Kurulum",
        rights: "Tam Fikri Mülkiyet Devri",
        categories: {
          all: "Tüm Mimariler",
          beauty: "Güzellik & Sağlık",
          fitness: "Spor & Fitness",
          corporate: "Kurumsal",
          law: "Hukuk Bürosu",
          rent: "Araç Kiralama",
          restaurant: "Restoran",
          portfolio: "Portfolyo",
          ecommerce: "E-Ticaret",
          realestate: "Emlak & Gayrimenkul"
        },
        tiers: {
          corporate: "CORPORATE",
          pro: "PRO",
          premium: "PREMIUM",
          platinum: "PLATİNYUM",
          standard: "Standart Premium",
          architect: "Mimar Edisyonu",
          elite: "Seçkin Yapıt"
        },
        modal: {
          ready: "24 Saatte Hazır",
          protection: "FM Koruması",
          intel: "Tasarım Zekası",
          viewport: "Görünüm Mantığı",
          responsive: "Tam Duyarlı",
          integrity: "Çekirdek Bütünlüğü",
          clean: "Saf React",
          anim: "Animasyon Motoru",
          features: "Özellikler",
          stack: "Teknoloji Yığını"
        },
        details: "Detayları Gör",
        projectIntel: "Proje Detayı",
        filterTitle: "Kategori Seç",
        filterSelection: "SEÇİM YAPIN",
        transparencyBanner: {
          protocol: "Protokol 02",
          title: "Sıkı Ayrıcalık",
          titleAccent: "Protokolü",
          statement: "Ayrıcalık Beyanı",
          headline: "Tek satın alım. Tek sahip. Sıfır klon.",
          description: "Şablonlarımız yalnızca bir kez satılır. Satın alındıktan sonra mimari katalogdan kalıcı olarak kaldırılır. Sadece bir site almıyorsunuz; size özel bir fikri mülkiyet elde ediyorsunuz. Sıradan olmayan özel tasarım web sitelerini hizmetinize sunmak için ekibimizle sürekli üretiyoruz.",
          ownership: "Tekil Mülkiyet",
          customLogic: "24 Saat İçerisinde Teslim",
          performance: "Hızlı Kurulum",
          build: "Build 2024.v1.0",
          authentic: "Ayrıcalıklı"
        }
      },
      aboutPage: {
        seo: {
          title: "Hakkımızda — ErpolArt | Modern Yazılım Ajansı",
          description: "ErpolArt ekibiyle tanışın. Modern, hızlı yazılım çözümleri üretiyoruz — özel web uygulamaları, SaaS platformları ve AI destekli otomasyonlar."
        },
        hero: {
          titlePart1: "Dijital Atölye,",
          titlePart2: "Mutlak Benzersizliği Tasarlıyoruz.",
          subtitle: "Sadece web sitesi inşa etmiyoruz. Vizyoner markaları yükselten kişiye özel dijital ekosistemler ve özel şablonlar tasarlıyoruz."
        },
        whoWeAre: {
          title: "Biz Kimiz",
          p1: "ErpolArt basit bir temel üzerine kuruldu: Geleneksel web tasarım ajansı modeli çökmüş durumda. Çok yavaş, çok pahalı ve genellikle işletmelerin birkaç ay içinde sığamadığı modası geçmiş şablonlara dayanıyor.",
          p2: "Biz tasarımcılar, yazılımcılar ve yapay zeka uzmanlarından oluşan bir topluluğuz. Gelişmiş Büyük Dil Modellerini (LLM) iş akışımıza entegre ederek, temel kod ve karmaşık mantık yazma süresini dramatik bir şekilde azaltıyoruz.",
          p3: "Bu verimlilik, tamamen asıl önemli olan noktaya odaklanmamızı sağlıyor: kişiye özel, premium estetik ve kusursuz kullanıcı deneyimi.",
          stat1: "Hızlı Teslimat",
          stat2: "Özel Kod"
        },
        approach: {
          title: "Yaklaşımımız",
          subtitle: "İnsan yaratıcılığının yön verdiği ve yapay zekanın hızlandırdığı yer.",
          items: {
            ai: { title: "Yapay Zeka Öncelikli Geliştirme", desc: "Karmaşık mantıkları hızla formüle etmek için en son teknoloji yapay zeka kod üretimini kullanıyoruz. Sonuç, çok daha kısa sürede yazılmış sağlam ve yüksek performanslı kodlardır." },
            design: { title: "Dönüşüm Odaklı Tasarım", desc: "Estetik önemlidir. Dikkat çeken 3D hareketler, pürüzsüz geçişler ve premium tipografi kullanarak görsel olarak çarpıcı arayüzler tasarlıyoruz." },
            exclusive: { title: "Özel Teslimat", desc: "İster özel bir yapı ister hazır bir şablon olsun, ayrıcalık garantisi. İşletmeniz tarafından satın alınan bir şablonu asla başkasına satmayız." }
          }
        },
        team: {
          titlePart1: "",
          titlePart2: "Ekibimiz",
          subtitle: "Web'in gelecek neslini inşa eden dijital mimarlar ve yaratıcı isyancılarla tanışın.",
          connect: "Bağlantı Kur",
          memberStatus: {
            coding: "Kod Yazıyor",
            thinking: "Düşünüyor",
            root: "Kök Erişimi",
            animation: "AfterEffects'te"
          }
        },
        values: {
          velocity: { name: "Hız", desc: "Yapısal bütünlükten ödün vermeden hızlandırılmış teslimatlar." },
          exclusivity: { name: "Ayrıcalık", desc: "Dijital ayak iziniz tamamen size ait olacak. Kopya yok." },
          transparency: { name: "Şeffaflık", desc: "Net iletişim, önceden belirlenmiş fiyatlandırma, gizli maddeler yok." },
          quality: { name: "Kalite", desc: "Bir siteyi yücelten mikro etkileşimlere duyulan saplantılı ilgi." }
        },
        cta: {
          title: "Hızlanmaya hazır mısınız?",
          subtitle: "Rakiplerinizi geride bırakacak bir dijital deneyim inşa edelim.",
          email: "Bize e-posta gönderin"
        }
      },
      footer: {
        desc: "Zeka ile İnşa Edilen, Hassasiyetle Teslim Edilen Web Siteleri. En ileri yapay zeka ve premium estetiği köprüleyerek markaları yükseltiyoruz.",
        nav: "Navigasyon",
        contact: "İletişim",
        ready: "Size özel web siteniz için hazır mısınız?",
        start: "Proje Başlat",
        copyright: "Tüm hakları saklıdır.",
        tagline: "Yapay zeka gücüyle. Hassasiyetle el yapımı."
      },
      techMarquee: {
        title: "Teknoloji Yığınımız",
        subtitle: "Modern ve üretime hazır araçlarla geliştirildi."
      },
      projectsData: {
        p1: { title: "Nova Tech Solutions", cat: "Teknoloji", desc: "Bir AI kurumsal yazılım şirketi için son teknoloji kurumsal web sitesi." },
        p2: { title: "Lumina Beauty", cat: "Güzellik Salonu", desc: "Premium estetik kliniği için minimalist, dönüşüm odaklı açılış sayfası." },
        p3: { title: "Velocity Rentals", cat: "Araç Kiralama", desc: "Dinamik uygunluk takvimine sahip lüks araç kiralama rezervasyon platformu." },
        p4: { title: "Gastronomy Lab", cat: "Restoran", desc: "Online rezervasyon ve menü tanıtımı içeren sürükleyici gastronomi sitesi." },
        p5: { title: "Justice Partners", cat: "Hukuk Bürosu", desc: "Üst düzey bir hukuk danışmanlık firması için güven veren dijital varlık." },
        p6: { title: "Vanguard Fitness", cat: "Sağlık & Fitness", desc: "Üyelik portalları ve ders planlama özelliklerine sahip modern spor salonu platformu." },
        p7: { title: "Horizon Estates", cat: "Gayrimenkul", desc: "VR turlar ve gelişmiş arama filtreleri sunan özel emlak portali." },
        p8: { title: "Drip Commerce", cat: "E-Ticaret", desc: "Yüksek performanslı ödeme sistemlerine sahip yeni nesil sokak giyimi mağazası." },
        p9: { title: "Aura Photography", cat: "Portfolyo", desc: "Profesyonel görsel hikaye anlatıcıları için sinematik galeri." },
        p10: { title: "CareLink Medical", cat: "Sağlık Hizmetleri", desc: "Klinikler için güvenli hasta yönetimi ve randevu alma sistemi." },
        p11: { title: "Elite Watch Co.", cat: "Lüks E-Ticaret", desc: "Güvenli ödeme ve garanti takibi sunan lüks saat kataloğu." },
        p12: { title: "Vivid Architecture", cat: "Mimarlık", desc: "Şehir planlama ve iç tasarıma odaklanan minimalist yapı portfolyosu." },
        p13: { title: "Mastery LMS", cat: "Eğitim", desc: "İnteraktif kurslar ve sertifikasyon sunan ölçeklenebilir eğitim yönetim sistemi." },
        p14: { title: "Wanderlust Travels", cat: "Seyahat & Turizm", desc: "Eşsiz yerel deneyimler için tam kapsamlı seyahat rezervasyon platformu." },
        p15: { title: "Zen Wellness", cat: "Spa & Wellness", desc: "Lüks meditasyon ve spa merkezi için huzur dolu dijital deneyim." }
      },
      templatesData: {
        t1: { title: "Aura Spa & Wellness", cat: "Güzellik Salonu", desc: "Üst düzey spa ve wellness merkezleri için tasarlanmış huzurlu ve lüks bir dijital deneyim.", long: "Aura, sağlıklı yaşam işletmeleri için eksiksiz bir dijital çözümdür. Huzur ve dönüşüme odaklanır, entegre hizmet menüleri, personel profilleri ve kesintisiz randevu sistemine sahiptir." },
        t2: { title: "Lex Corporate", cat: "Hukuk Bürosu", desc: "Hukuk danışmanlık firmaları ve bağımsız danışmanlar için sofistike ve güven veren dijital varlık.", long: "Lex, hukuk uygulamaları için profesyonel bir avantaj sağlar. Uzmanlık alanları, avukat biyografileri ve vaka çalışmaları için özel bölümler içerir." },
        t3: { title: "Steak & Vine", cat: "Restoran", desc: "İnteraktif menüler ve rezervasyon mantığı ile sürükleyici bir mutfak tanıtımı.", long: "Gurme restoranlar için tasarlanan Steak & Vine, misafirperverliğin özünü yakalar. Çarpıcı tam ekran menü ve optimize edilmiş konum haritalarına sahiptir." },
        t4: { title: "Nomad Rentals", cat: "Araç Kiralama", desc: "Dinamik envanter ve rezervasyon filtrelerine sahip yüksek performanslı lüks araç kiralama platformu.", long: "Nomad, hız ve lüks için inşa edilmiştir. Araç türleri için güçlü bir filtreleme sistemi ve tarihlere dayalı otomatik fiyat hesaplayıcıları içerir." },
        t5: { title: "Neon Creative", cat: "Portfolyo", desc: "Görsel hikaye anlatıcıları ve yaratıcı ajanslar için cesur ve avangart portfolyo.", long: "Neon, geleneksel portfolyo kalıplarını yıkar. Deneysel navigasyon ve özel imleç efektleri ile öne çıkmak isteyen yaratıcılar için idealdir." },
        t6: { title: "Horizon Estates", cat: "Kurumsal", desc: "Girişimler ve ölçeklenen şirketler için temiz, modern kurumsal açılış sayfası.", long: "Horizon, maksimum netlik ve profesyonellik için tasarlanmıştır. Ölçeklenebilir hizmet blokları ve etki istatistiklerine sahiptir." },
        t7: { title: "Vanguard Fitness", cat: "Sağlık & Fitness", desc: "Üyelik portalları ve ders planlama özelliklerine sahip yüksek enerjili spor platformu.", long: "Vanguard, nabız yükselten performans için üretilmiştir. Dinamik program oluşturucular, eğitmen biyofisi bölümleri ve entegre antrenman günlüğü önizlemeleri içerir." },
        t8: { title: "Drip Commerce", cat: "E-Ticaret", desc: "Yüksek performanslı ödeme sistemlerine sahip yeni nesil sokak giyimi mağazası.", long: "Drip, nihai e-ticaret motorudur. Süper hızlı ürün keşif akışı, dinamik envanter yönetimi ve tek tıkla ödeme optimizasyonları sunar." },
        t9: { title: "Vela Horizon Gayrimenkul", cat: "realestate", desc: "Lüks gayrimenkul yönetimi ve küresel müşteri kazanımı için tasarlanmış seçkin emlak mimarisi.", long: "Vela Horizon, lüks gayrimenkul acenteleri için en üst düzey dijital varlıktır. Yüksek kaliteli mülk galerileri, bölge bazlı kategorizasyon (İstanbul, Bodrum, Antalya) ve yüksek gelirli bireyleri dönüştürmek için tasarlanmış gelişmiş bir çok dilli talep sistemi sunar." }
      },
      projectsPage: {
        build: "Build 2024.v1.0",
        authentic: "Özgün",
        bespoke: {
          title: "Benzersiz Kimliğinizi İnşa Edin",
          subtitle: "Üst düzey estetiği, yapay zeka destekli özel mühendislikle birleştiriyoruz. Takip etmeyi bırakın; markanıza özel imza mimariyle liderlik edin.",
          cta: "Projenizi Başlatın",
          secondary: "Sürecimizi Keşfedin",
          engineeringBadge: "İmza Mühendislik",
          feature1Label: "Strateji Görüşmesi",
          feature1Desc: "Birebir keşif",
          feature2Label: "Sıfır Kopya Kod",
          feature2Desc: "%100 Özgün",
          feature3Label: "Hızlı Kurulum",
          feature3Desc: "Hızlandırılmış gelişim",
          feature4Label: "Premium Sanat",
          feature4Desc: "Kişiye özel tasarım"
        },
        customServices: {
          badge: "İmza Mimari",
          title: "Hız ve Kalite,",
          titleAccent: "Aynı Anda.",
          desc1: "Geleneksel web tasarımının sınırlarını aşıyoruz. İmza sürecimiz, markanızın felsefesini tek bir satır dahi kopya içermeyen, tamamen size özel bir dijital deneyime dönüştürür.",
          desc2: "Kopya yok, kısa yol yok. Platformunuz, vizyonunuzun gerçek tekilliğini yansıtan, bağımsız bir dijital şaheserdir.",
          stat1Title: "Mimari Tekillik",
          stat2Title: "Mantık Şeffaflığı",
          perfMatrix: "Performans Matrisi",
          stability: "Mimari Kararlılık",
          integrity: "Mantık Bütünlüğü",
          creedBadge: "Özel Tasarım İnancı",
          creedTitle: "Her marka dijital bir ruhu hak eder.",
          creedDesc: "Karmaşıklığı zarafete, hızı ise rekabet avantajına dönüştürüyoruz. Özel mimarilerimiz sadece araç değildir; vizyonunuzun talep ettiği premium dijital gayrimenkullerdir.",
          trusted: "Dünya Çapında Vizyoner Liderler Tarafından Güveniliyor",
          features: {
            f1Title: "Mutlak Bağımsızlık",
            f1Desc: "Sıradan hazır yapılarla bağlarımızı koparıyoruz. Dijital kimliğiniz, yapısal ve estetik tekilliği garanti altına almak için boş bir tuval üzerine inşa edilir.",
            f2Title: "Kurumsal Düzeyde Mantık",
            f2Desc: "Modern React ve gelişmiş yapay zeka destekli iş akışları üzerine inşa edilen temel mimari sağlam, yüksek düzeyde ölçeklenebilir ve son derece güvenlidir.",
            f3Title: "Kinetik Estetik",
            f3Desc: "Statik sayfalar dönemi bitti. Markanızın gerçekten hayatta olduğunu hissettirmek için akışkan mikro etkileşimler, yay fiziği ve WebGL öğelerini entegre ediyoruz.",
            f4Title: "Acımasız Optimizasyon",
            f4Desc: "Hız lükstür. Temiz ve özel kod yazarak gereksiz yazılımları eliyoruz, yıldırım hızında yükleme süreleri ve kusursuz SEO performansı elde ediyoruz.",
            status: "Protokol Durumu: Aktif"
          },
          whyUs: "Neden Biz?",
          difference: "Digital Atelier Farkı",
          criteria: "Kriter",
          erpolartBespoke: "ErpolArt İmza",
          standardWeb: "Standart Web",
          readyTool: "Paket Çözüm",
          handmadeCode: "İmza Mimari",
          comparison: {
            archTitle: "Mimari",
            archBespoke: "İmza Mimari",
            archTemplate: "Hazır Şablonlar",
            singTitle: "Özgünlük",
            singBespoke: "Dünyada Tek (1/1)",
            singTemplate: "Binlerce Benzer Kopya",
            perfTitle: "Performans",
            perfBespoke: "Acımasız Optimizasyon",
            perfTemplate: "Gereksiz Kod Yükü",
            seoTitle: "SEO & Google",
            seoBespoke: "Doğuştan Uyumlu",
            seoTemplate: "Eklenti Bağımlı",
            ctrlTitle: "Kontrol",
            ctrlBespoke: "%100 Özgürlük",
            ctrlTemplate: "Kısıtlı Araçlar"
          }
        },
        processTimeline: {
          title: "Stratejik Geliştirme Süreci",
          subtitle: "Modern çerçevemiz, vizyoner kavramları eşsiz bir hız ve hassasiyetle canlı, kurumsal düzeyde dağıtımlara dönüştürür.",
          phase: "Aşama",
          steps: {
            s1Title: "Keşif ve Taslak",
            s1Desc: "Ölçeklenebilir bir dijital strateji oluşturmak için marka DNA'nızı, pazar konumunuzu ve hedeflerinizi analiz ediyoruz.",
            s2Title: "Görsel Kimlik Tasarımı",
            s2Desc: "48 saat içinde, dijital estetiğinizi yeniden tanımlayan premium bir tasarım rotası sunuyoruz.",
            s3Title: "Rafine Etme ve Hassasiyet",
            s3Desc: "Mimarinin vizyonunuzla kusursuz bir şekilde uyum sağlaması için iki hedefli iyileştirme döngüsü yürütüyoruz.",
            s4Title: "İleri Düzey Yazılım İnşası",
            s4Desc: "Taslağı, en yüksek standartlarda temiz kod prensipleri ve son teknoloji yazılım dilleriyle yüksek performanslı bir dijital altyapıya dönüştürüyoruz.",
            s5Title: "Yayına Alma ve Teslimat",
            s5Desc: "Seçkin sunucu altyapılarında sorunsuz lansman yaparak tüm mülkiyeti ve operasyonel kontrolü size devrediyoruz."
          }
        },
        projectShowcase: {
          title: "İmza",
          titleAccent: "Projeler",
          subtitle: "İmza performans için tasarlanmış mimari şaheserlerden seçkiler. Bunlar sadece site değil; rekabetçi dijital avantajlardır.",
          live: "Canlı Platform",
          customEngine: "Özel Motor",
          liveView: "Canlı Görünüm",
          arch1: "Tertemiz Çekirdek Mimari",
          arch2: "Tescilli Yapay Zeka Entegrasyonu",
          arch3: "Sıfır Kopya Görsel Kimlik",
          studyCase: "Vakayı İncele",
          archives: "Arşivler"
        },
        form: {
          titlePart1: "Projenizi",
          titlePart2: "Başlatın",
          subtitle: "Vizyonunuzu paylaşın ve markanıza özel dijital yolu inşa edelim."
        },
        promise: {
          badge: "YARININ TASARIMI",
          title: "Vizyonunuzu Sergileyin.",
          desc: "Size özel yönettiğimiz web sitesi tasarım sürecinde hedefimiz, diğer vizyoner markalar gibi her anını severek kullandığınız ve gururla paylaştığınız bir dijital platforma sahip olmanızdır.",
          others: "Diğer Vizyoner Markaların Arasında Yer Alın."
        },
        quoteSection: {
          badge: "TEKLİF AL",
          title: "Birlikte İnşa Edelim.",
          subtitle: "Projenizi bize anlatın. Size özel bir teklif hazırlayıp 24 saat içinde geri döneceğiz."
        },
        manifesto: {
          badge: "TASARIM FELSEFESİ",
          title: "İlkelerimiz.",
          p1Title: "Her Piksel Bir Amaca Hizmet Eder.",
          p1Desc: "Gereksiz dekorasyon yok. Her görsel element, ziyaretçiyi bir sonraki adıma yönlendirmek için vardır.",
          p2Title: "Hız Bir Özellik Değil, Temeldir.",
          p2Desc: "3 saniyede açılmayan site ziyaretçi kaybeder. Performans, tasarımın ilk gününden içine işlenir.",
          p3Title: "Mobil Önce, Masaüstü Her Zaman.",
          p3Desc: "Ziyaretçilerin büyük çoğunluğu mobil cihazdan gelir. Mobilde kusursuz olan her yerde mükemmel görünür.",
          p4Title: "Kopya Yok. Yalnızca İmzanız.",
          p4Desc: "Aynı kodu iki markaya vermeyiz. Her proje, tek bir kimliğin dijital DNA'sıdır ve yalnızca o kimliğe aittir.",
          purposeVisual: "Amaca Yönelik Tasarım",
          speedVisual: "Yüklenme Süresi",
          mobileVisual: "Ekran Boyutu",
          uniqueVisual: "Sizin İmzanız"
        }
      },
      templateDetail: {
        liveDemo: "Canlı Demo",
        backToCatalog: "Kataloğa Dön",
        acquisitionValue: "Edinim Değeri",
        readyIn24H: "24 Saatte Hazır",
        exclusiveIP: "Özel Fikri Mülkiyet Kilidi",
        archOverview: "Mimari Genel Bakış",
        dominancePart1: "Mutlak Hakimiyet İçin",
        dominancePart2: "Tasarlandı.",
        techStack: "Teknoloji Yığını",
        integratedCaps: "Entegre Yetenekler",
        responsive: "Duyarlı",
        mobileFirst: "Mobil Öncelikli",
        architecture: "Mimari",
        componentBase: "Bileşen Tabanlı",
        interactions: "Etkileşimler",
        smooth: "Pürüzsüz",
        coreViews: "Temel Görünüm",
        seoStrategy: "SEO Stratejisi",
        gradeAOptimized: "A-Sınıfı Optimize Edilmiş",
        fastDelivery: "Hızlı Teslimat",
        architecting: "İnşa Ediliyor...",
        structureNotFound: "Yapı Bulunamadı",
        features: {
          "Professional Service Showcase": "Profesyonel Hizmet Sergileme",
          "Smart Media & Image Gallery": "Akıllı Medya ve Görsel Galerisi",
          "Advanced Admin Control Panel": "Gelişmiş Admin Kontrol Paneli",
          "Blog & Content Manager": "Blog ve İçerik Yönetimi",
          "Online Booking & Appointment": "Online Randevu Sistemi",
          "Smart Lead & Contact Forms": "Akıllı İletişim Formları",
          "Auto Dark & Light Mode": "Otomatik Karanlık/Aydınlık Mod",
          "Multi-language Support": "Çoklu Dil Desteği",
          "Full Google SEO Optimization": "Tam Google SEO Optimizasyonu",
          "Ultra-Fast Speed & Performance": "Ultra Hızlı Performans",
          "Premium Animations & UI": "Premium Animasyonlar ve UI",
          "Data Protection & Secure SSL": "Veri Koruma ve Güvenli SSL",
          "One-Page Architecture": "Tek Sayfa (One-Page) Mimarisi"
        }
      },
      checkout: {
        pciDssHint: "PCI-DSS Level 1 Şifreli Terminal",
        backToDetails: "Detaylara Dön",
        breadcrumb: "Ödeme",
        title: "Edinimi",
        titleAccent: "Tamamla",
        subtitle: "Fikri mülkiyet haklarınızı güvence altına alın. İşlem doğrulandıktan sonra, dağıtım deposuna ve tasarım dosyalarına anında erişim kazanacaksınız.",
        billingTitle: "Fatura Bilgileri",
        firstName: "Ad",
        lastName: "Soyad",
        email: "E-posta",
        emailLabel: "E-posta Adresi (Teslimat İçin)",
        phoneLabel: "Telefon Numarası",
        addressLabel: "Fatura Adresi",
        taxIdLabel: "TC Kimlik / VKN (Opsiyonel)",
        paymentTitle: "Ödeme Protokolü",
        bankTransfer: "Banka Havalesi / EFT",
        transferDetails: "Banka Havalesi Bilgileri",
        cardPayment: "Kredi / Banka Kartı",
        cardPaymentDesc: "Iyzico Güvenli Ödeme Altyapısı",
        securePaymentNote: "Ödemeniz Iyzico 3D Secure altyapısı ile güvenli şekilde işlenir.",
        paymentReceived: "ÖDEME BAŞARILI",
        securePaymentComplete: "GÜVENLİ ÖDEME TAMAMLANDI",
        iban: "IBAN",
        accountHolder: "Alıcı",
        referenceDesc: "Lütfen transfer açıklamasına bu kodu ekleyin:",
        activationNote: "Ödeme onaylandıktan sonra sisteminiz otomatik olarak aktif edilecektir.",
        orderIdLabel: "Sipariş Referans No",
        copyReference: "Kodu Kopyala",
        orderSummary: "Sipariş Özeti",
        encrypted: "Uçtan Uca Şifreli",
        license: "Lisans",
        digitalArch: "Dijital Mimari",
        fee: "Lisans Ücreti",
        ipTransfer: "FM Koruması ve Devri",
        included: "Dahil",
        taxes: "Vergiler",
        taxCalc: "Bir sonraki adımda hesaplanır",
        total: "Toplam Tutar",
        perks: {
          codes: "Tam Kaynak Kodu Teslimi",
          rights: "Ömür Boyu Münhasır Olmayan Haklar",
          download: "Anında İndirme Erişimi"
        },
        authorize: "Ödemeyi Yetkilendir",
        payCrypto: "Coinbase Wallet ile Öde",
        ssl: "SSL Güvenli İşlem",
        addons: {
          chatbot: { name: "AI Chatbot Entegrasyonu", desc: "Özel eğitimli AI asistan" },
          language: { name: "Çoklu Dil Modülü", desc: "Global i18n altyapısı" },
          crm: { name: "CRM Lead Entegrasyonu", desc: "Otomatik müşteri takibi" },
          seo: { name: "Gelişmiş SEO Optimizasyonu", desc: "Arama motoru hakimiyeti" }
        },
        platinumArch: "Platinyum Mimari",
        premiumArch: "Premium Mimari",
        establishingConnection: "Bağlantı Kuruluyor...",
        protocolError: "PROTOKOL HATASI",
        returnToCatalog: "Kataloğa Dön",
        protocolRestriction: "Protokol Kısıtlaması",
        secureGateway: "Güvenli Ağ Geçidi",
        selectedArchitecture: "Seçilen Mimari",
        customSaaSArchitecture: "Özel SaaS Mimarisi",
        revisionsIncluded: "5 Revizyon Dahil",
        clientLabel: "Müşteri:",
        maintenanceTitle: "Aylık Sistem Yönetimi",
        noCommitment: "Taahhütsüz",
        maintenanceDesc: "Sunucu optimizasyonu ve teknik destek. Taahhüt yok, istediğiniz an iptal edilebilir.",
        systemContinuity: "Sistem Sürekliliği",
        monthlyMaintenance: "Aylık Bakım",
        cancelAnytime: "İstediğin Zaman İptal Et",
        extraServices: "Ekstra Hizmetler",
        oneTime: "Tek Seferlik",
        pricePolicyDesc: "Bu tutar; tek seferlik sistem kurulumunu, mimari altyapı inşasını ve premium modül entegrasyon maliyetlerini kapsar.",
        acquisitionProtocol: "Edinim Protokolü",
        completePayment: "Ödemeyi Tamamla",
        oneTimeInvestment: "Tek Seferlik Yatırım",
        maintenanceLabel: "Aylık",
        secureTerminal: "Güvenli Terminal",
        encryptionHint: "Uçtan Uca Şifreli",
        protocolSecured: "Protokol Güvenceye Alındı",
        authSuccessDesc: "Yetkilendirme başarılı. Sisteminizi hazırlıyoruz.",
        finalizingNode: "Düğüm Sonlandırılıyor...",
        emailLocked: "Hesabınızdan doğrulandı",
        transferAmount: "Transfer Tutarı",
        orderCreatedDesc: "Sisteminizi aktifleştirmek için transferi tamamlayın",
        referenceHint: "Hızlı aktivasyon için bu kodu transfer açıklamasına ekleyin.",
        fillBrandDetails: "Marka Bilgilerini Şimdi Gir",
        goToDashboard: "Dashboard'a Git"
      },
      dashboard: {
        welcome: "Hoş Geldiniz",
        memberSince: "Üyelik tarihi",
        browseTemplates: "Şablonlara Göz At",
        purchases: "Satın Alımlar",
        activeSites: "Aktif Siteler",
        accountStatus: "Hesap Durumu",
        active: "Aktif",
        quickActions: "Hızlı İşlemler",
        exploreTemplates: "Şablonları Keşfet",
        exploreDesc: "Premium şablon koleksiyonumuza göz atın",
        myPurchases: "Satın Aldıklarım",
        purchasesDesc: "Satın aldığınız şablonları görüntüleyin ve indirin",
        accountSettings: "Hesap Ayarları",
        settingsDesc: "Profilinizi ve tercihlerinizi güncelleyin",
        go: "Git",
        recommended: "Önerilen Şablonlar",
        viewAll: "Hepsini Gör"
      },
      purchases: {
        title: "Satın Aldıklarım",
        subtitle: "Satın aldığınız şablonları görüntüleyin ve yönetin.",
        emptyTitle: "Henüz Alım Yapılmadı",
        emptyDesc: "Henüz herhangi bir şablon satın almadınız. Koleksiyonumuza göz atın ve projeniz için mükemmel şablonu bulun.",
        browseCTA: "Şablonlara Göz At",
        download: "İndir"
      },
      account: {
        title: "Hesap Ayarları",
        subtitle: "Profilinizi ve güvenlik ayarlarınızı yönetin.",
        updateSuccess: "Profil başarıyla güncellendi!",
        profile: "Profil",
        personalInfo: "Kişisel Bilgiler",
        fullName: "Tam Ad",
        saving: "Kaydediliyor...",
        saveChanges: "Değişiklikleri Kaydet",
        security: "Güvenlik",
        changePassword: "Şifre Değiştir",
        currentPassword: "Mevcut Şifre",
        newPassword: "Yeni Şifre",
        updatePassword: "Şifreyi Güncelle"
      },
      saasPage: {
        hero: {
          badge: "YENİ NESİL YAZILIM",
          titlePart1: "İşinizi Zekâyla",
          titlePart2: "Güçlendirin.",
          subtitle: "Özel SaaS platformlar, yapay zeka destekli paneller ve işletmelerin çalışma ve ölçeklenme biçimini dönüştüren akıllı otomasyon sistemleri geliştiriyoruz.",
          cta: "SaaS Projenizi Başlatın",
          secondary: "Yetenekleri Keşfedin"
        },
        features: {
          badge: "TEMEL YETENEKLERİMİZ",
          title: "Zekâ",
          titleAccent: "Mühendisliği.",
          subtitle: "Konuşma yapay zekasından gerçek zamanlı analitiğe kadar, işletmenize haksız rekabet avantajı sağlayan yazılım altyapısını inşa ediyoruz.",
          chatbot: { title: "AI Chatbot Entegrasyonu", desc: "Müşteri desteği, satış asistanlığı ve iç operasyonlar için özel eğitimli konuşma yapay zekası. GPT-4, Claude ve tescilli modellerle desteklenir." },
          dashboard: { title: "Akıllı Dashboard & Analitik", desc: "Gerçek zamanlı KPI takibi, tahmine dayalı analitik ve ham veriyi eyleme dönüştürülebilir iş zekasına çeviren interaktif görselleştirmeler." },
          automation: { title: "İş Akışı Otomasyonu", desc: "Akıllı otomasyon hatları ile tekrarlayan görevleri ortadan kaldırın. E-posta dizilerinden envanter yönetimine kadar operasyonlarınızı otomatikleştiriyoruz." },
          api: { title: "API & Entegrasyon Merkezi", desc: "Ödeme ağ geçitleri, CRM'ler, ERP'ler ve özel webhook'larla sorunsuz üçüncü taraf entegrasyonları. SaaS'ınız, her şeye bağlı." },
          security: { title: "Güvenlik & Uyumluluk", desc: "Uçtan uca şifreleme, rol tabanlı erişim kontrolü ve GDPR, SOC2 ve KVKK ile tam uyumluluk sağlayan kurumsal düzeyde güvenlik." },
          infrastructure: { title: "Ölçeklenebilir Bulut Mimarisi", desc: "AWS, GCP veya Azure üzerinde cloud-native microservices. 100'den 100.000+ kullanıcıya otomatik ölçeklenen altyapı." }
        },
        showcase: {
          badge: "VAKA ÇALIŞMALARI",
          title: "Teslim Edilen",
          titleAccent: "Çözümler.",
          subtitle: "Farklı sektörlerdeki işletmeler için tasarlayıp devreye aldığımız gerçek SaaS platformları.",
          project1: { title: "NexusAI CRM", desc: "Tahmine dayalı potansiyel müşteri puanlama ve otomatik erişim ile yapay zeka destekli müşteri ilişkileri platformu.", stack: "Next.js · OpenAI · PostgreSQL" },
          contractoros: { 
            title: "ContractorOS", 
            desc: "Modern müteahhitler ve taşeronlar için kurumsal yönetim ekosistemi. Gerçek zamanlı proje takibi, otomatik faturalama ve akıllı müşteri yönetimi.", 
            stack: "Next.js · Supabase · AI",
            caseStudy: {
              challenge: "İnşaat projelerinde dağınık iletişim, kaybolan evraklar ve bütçe aşımları büyük bir kaos yaratıyor. Ekipler, malzemeler ve programların manuel yönetimi sektörün en büyük darboğazı.",
              solution: "Next.js ve Supabase ile inşa edilen birleşik bir inşaat ekosistemi. Potansiyel müşteri yönetiminden otomatik PDF faturalandırmaya ve gerçek zamanlı bütçe takibine kadar projenin tüm yaşam döngüsünü senkronize eden yüksek performanslı bir platform.",
              features: [
                "Gerçek Zamanlı Analitik (Recharts ile görselleştirme)",
                "Otomatik Doküman & Fatura Üretimi (React-PDF)",
                "Anlık İletişim & Bildirim Sistemi (Resend)",
                "Güvenli & Hızlı Veri Mimarisi (Supabase SSR)"
              ],
              results: [
                { label: "Operasyonel Verimlilik", value: "+%40" },
                { label: "Evrak İşlerinde Azalma", value: "%100" },
                { label: "Veri Şeffaflığı", value: "Tam" }
              ]
            }
          },
          brandpulse: { 
            title: "BrandPulse AI", 
            desc: "Yapay zeka tabanlı sosyal medya analitiği ve trend öngörü platformu. Gerçek zamanlı duygu analizi ve otomatik raporlama ile markanızın dijital nabzını tutun.", 
            stack: "Next.js · OpenAI · Pinecone",
            caseStudy: {
              challenge: "Hızla değişen dijital dünyada markalar, itibarlarını ve sosyal medya etkilerini gerçek zamanlı olarak takip etmekte zorlanıyor. Binlerce etkileşimi manuel olarak analiz etmek imkansızdır ve bu durum stratejik fırsatların kaçırılmasına yol açar.",
              solution: "Yapay zeka destekli gelişmiş bir sosyal medya istihbarat platformu. BrandPulse AI, verileri analiz eder, duygu analizi yapar ve karmaşık etkileşim trendlerini interaktif Recharts dashboard'ları ile görselleştirerek markalara 7/24 dijital nabız takibi sağlar.",
              features: [
                "Gerçek Zamanlı Duygu Analizi (AI Destekli)",
                "İnteraktif Trend Görselleştirme (Recharts)",
                "Çok Kanallı Veri Agregasyonu",
                "Otomatik Marka İtibar Raporları"
              ],
              results: [
                { label: "Takip Kapasitesi", value: "+%120" },
                { label: "Analiz Hızı", value: "<500ms" },
                { label: "Duygu Analizi Doğruluğu", value: "%98" }
              ]
            }
          },
          project2: { title: "Reseva AI", desc: "Özel KPI takibi ve ekip işbirliği ile gerçek zamanlı iş zekası panosu.", stack: "React · D3.js · Supabase" },
          project3: { title: "AutoScale Commerce", desc: "Envanter otomasyonu, çoklu satıcı desteği ve AI önerileri ile tam kapsamlı e-ticaret SaaS.", stack: "Node.js · Stripe · Redis" }
        },
        cta: {
          badge: "HIZLI TEKLİF",
          title: "SaaS'ınızı inşa etmeye hazır mısınız?",
          subtitle: "Hırsınızla birlikte ölçeklenen bir platform tasarlayalım.",
          button: "PROJE BAŞLAT"
        },
        caseStudy: {
          footerTitlePart1: "Geleceği",
          footerTitlePart2: "BİRLİKTE İNŞA EDELİM",
          footerSubtitle: "Sektörünüzü dönüştürmeye hazır mısınız? Vizyonunuzu paylaşın ve ölçeklenebilir bir çözüm için ilk adımı atalım."
        },
        techStack: {
          badge: "TEKNOLOJİ YIĞINI",
          title: "En İyilerle İnşa Edildi",
          subtitle: "Dünya standartlarındaki mühendislik ekiplerinin güvendiği, savaşta sınanmış ve en güncel teknolojileri kullanıyoruz."
        },
        scope: {
          badge: "PROJE KAPSAMI",
          title: "Başlangıç",
          titleAccent: "Noktanızı Seçin.",
          subtitle: "Her proje özgündür. Bu kapsamlar size bir başlangıç noktası sunar — nihai teklif tam ihtiyacınıza göre şekillendirilir.",
          cta: "Özel Teklif Al",
          mvp: {
            tag: "MVP",
            title: "Hızlı Başlayın",
            for: "Girişimciler & erken aşama startuplar için",
            timeline: "1 – 2 Hafta",
            timelineLabel: "Tahmini Süre",
            features: [
              "Kimlik doğrulama & kullanıcı yönetimi",
              "Temel özellik (1 ana modül)",
              "Admin paneli",
              "Ödeme entegrasyonu",
              "Mobil uyumlu tasarım"
            ]
          },
          growth: {
            tag: "GROWTH",
            title: "Akıllıca Büyüyün",
            for: "Büyüyen takımlar & doğrulanmış ürünler için",
            timeline: "2 – 4 Hafta",
            timelineLabel: "Tahmini Süre",
            badge: "En Popüler",
            features: [
              "MVP'deki her şey",
              "AI / LLM entegrasyonu",
              "Gelişmiş analitik",
              "Rol tabanlı erişim kontrolü",
              "API gateway & webhook'lar",
              "Çok kiracılı mimari"
            ]
          },
          enterprise: {
            tag: "ENTERPRISE",
            title: "Sınır Tanımayın",
            for: "Karmaşık, yüksek ölçekli sistemler için",
            timeline: "1 – 2 Ay",
            timelineLabel: "Tahmini Süre",
            features: [
              "Özel mimari tasarım",
              "White-label seçeneği",
              "On-premise kurulum",
              "Özel SLA garantisi",
              "Özel entegrasyonlar",
              "Öncelikli destek"
            ]
          }
        },
        faq: {
          badge: "SSS",
          title: "Sık Sorulan",
          titleAccent: "Sorular.",
          items: [
            { q: "SaaS projesi ne kadar sürer?", a: "Kapsama göre değişir. MVP projeler 1-2 haftada, growth aşaması platformlar 2-4 haftada, karmaşık kurumsal sistemler ise 1-2 ayda teslim edilir. Başlamadan önce net bir zaman çizelgesi üzerinde her zaman anlaşırız." },
            { q: "Kaynak kodu bize mi ait olur?", a: "Evet, %100. Teslimden sonra tüm kaynak kodu, veritabanı ve altyapı size aittir. Hiçbir bağımlılık yaratmayız." },
            { q: "Sonradan özellik eklenebilir mi?", a: "Kesinlikle. Her şeyi ölçeklenebilirliği göz önünde tutarak inşa ediyoruz. Yeni modüller istediğiniz zaman eklenebilir; retainer plan veya ayrı proje olarak." },
            { q: "Fiyatlandırma nasıl işliyor?", a: "Her proje özgün olduğu için sabit fiyat yayınlamıyoruz. Kapsamı, süreyi ve teknik gereksinimleri değerlendirip sabit fiyatlı teklif gönderiyoruz. Sürpriz olmaz." },
            { q: "Lansman sonrası destek var mı?", a: "Lansman desteği her zaman dahildir. Süregelen bakım için aylık retainer planları sunuyoruz; öncelikli yanıt süreleriyle." },
            { q: "Proje sürecinde nasıl iletişim kuruyoruz?", a: "WhatsApp veya web sitemizdeki iletişim formu üzerinden anlık mesajlaşma, haftalık ilerleme raporları ve gerektiğinde video görüşmeleri ile tam şeffaflık sağlıyoruz." }
          ]
        }
      },
      automationsPage: {
        hero: {
          badge: "YAPAY ZEKA OTOMASYONLARI",
          title: "Akıllı",
          titleAccent: "AI Otomasyonları",
          subtitle: "Otonom AI ajanları, akıllı iş akışı otomasyonları ve zeki veri hatları ile işletmenizi güçlendirin. İşletmenizi 7/24 besleyen dijital beyni inşa ediyoruz.",
          cta: "Projenizi Başlatın",
          secondary: "Nasıl Çalışır"
        },
        features: {
          badge: "TEMEL YETENEKLERİMİZ",
          title: "Neler",
          titleAccent: "Otomatikleştiriyoruz.",
          subtitle: "Konuşma yapay zekasından otonom ajanlara kadar — tekrarlayan işleri ortadan kaldıran ve operasyonlarınızı ölçeklendiren akıllı sistemler tasarlıyoruz.",
          chatbot: { title: "AI Chatbot & Konuşma Yapay Zekası", desc: "Müşteri desteği, satış asistanlığı ve iç operasyonlar için özel eğitimli konuşma yapay zekası. GPT, Claude ve özel LLM'lerle desteklenir." },
          agents: { title: "Otonom AI Ajanlar", desc: "İnsan müdahalesi olmadan çok adımlı görevleri planlayan, akıl yürüten ve yürüten özerk AI ajanlar. LangChain ve özel ajan çerçeveleriyle inşa edilir." },
          automation: { title: "İş Akışı Otomasyonu", desc: "Akıllı otomasyon hatlarıyla tekrarlayan görevleri ortadan kaldırın. E-posta dizilerinden envanter yönetimine kadar operasyonlarınızı uçtan uca otomatikleştiriyoruz." },
          data: { title: "Veri İşleme & ETL", desc: "Herhangi bir kaynaktan veri çıkaran, dönüştüren ve yükleyen ölçeklenebilir hatlar. Olay güdümlü mimari ve akıllı normalizasyon ile gerçek zamanlı işleme." },
          document: { title: "Doküman Yapay Zekası", desc: "Akıllı doküman işleme — görsel yapay zeka ve LLM'ler kullanarak PDF'lerden, faturalardan, sözleşmelerden ve formlardan yapılandırılmış veri çıkarın." },
          reporting: { title: "Raporlama Otomasyonu", desc: "Otomatik panolar ve zamanlanmış raporlar gelen kutunuza teslim edilir. Ham veriyi otopilotta yöneticiye hazır içgörülere dönüştürün." }
        },
        showcase: {
          badge: "KULLANIM ALANLARI",
          title: "Gerçek Dünya",
          titleAccent: "Otomasyonları.",
          subtitle: "Farklı sektörlerdeki işletmeler için tasarladığımız ve devreye aldığımız akıllı otomasyon sistemleri.",
          ecommerce: {
            title: "E-Ticaret Otomasyonu",
            desc: "Sipariş işleme, stok senkronizasyonu ve müşteri iletişimi tamamen otopilotta.",
            stack: "n8n · OpenAI · Stripe · Supabase",
            challenge: "Manuel sipariş takibi, parçalı stok güncellemeleri ve gecikmeli müşteri iletişimi operasyonel darboğazlar yaratıyor ve müşteri memnuniyetini düşürüyordu.",
            solution: "Tam otomatik bir e-ticaret altyapısı: siparişler stok güncellemelerini tetikler, ödeme onayları kişiselleştirilmiş e-postalar gönderir ve düşük stok uyarıları tedarikçilere iletilir; insan dokunuşu olmadan.",
            features: ["Sipariş-teslim otomasyon hattı", "Kanallar arası gerçek zamanlı stok senkronizasyonu", "AI destekli kişiselleştirilmiş müşteri e-postaları", "Düşük stok ve yeniden sipariş otomasyonu"],
            results: [{ label: "Manuel İş Azalması", value: "%85" }, { label: "Yanıt Süresi", value: "<2 dk" }, { label: "Sipariş Doğruluğu", value: "%99.8" }]
          },
          support: {
            title: "AI Destek Botu",
            desc: "Ürün bilgi tabanınız üzerinde eğitilmiş 7/24 akıllı müşteri destek botu.",
            stack: "Claude AI · Pinecone · Supabase · Node.js",
            challenge: "Büyüyen bir SaaS şirketi tekrarlayan destek biletleriyle boğuluyordu; ekip zamanının %60'ı dokümantasyonda yanıtlanmış sorulara gidiyordu.",
            solution: "Şirketin dokümantasyonu, SSS'leri ve geçmiş biletleri üzerinde eğitilmiş Claude destekli bir destek botu. Soruların %80'ini özerk olarak yanıtlar, karmaşık sorunları insan ekibine yönlendirir.",
            features: ["RAG tabanlı bilgi erişimi (Pinecone)", "Çok dilli destek", "Otomatik insan yönlendirmesi", "Bilet kaydı ve analitik"],
            results: [{ label: "Otomatik Biletler", value: "%80" }, { label: "Ort. Yanıt Süresi", value: "<5 sn" }, { label: "Kazanılan Ekip Saati", value: "120/ay" }]
          },
          crm: {
            title: "Lead & CRM Otomasyonu",
            desc: "Otomatik lead puanlama, besleme dizileri ve CRM güncellemeleri; tek parmak kaldırmadan.",
            stack: "Make.com · GPT-4 · HubSpot · Webhooks",
            challenge: "Satış temsilcileri CRM kayıtlarını manuel güncelliyor, takip e-postaları gönderiyor ve lead puanlıyordu; satış yerine idari işlere her gün saatler harcıyordu.",
            solution: "Tam otomatik bir lead yönetim sistemi: yeni leadler AI tarafından puanlanır, segmentlere ayrılır, kişiselleştirilmiş besleme dizilerine dahil edilir ve CRM kayıtları gerçek zamanlı güncellenir.",
            features: ["AI destekli lead puanlama ve segmentasyon", "Otomatik çok adımlı besleme dizileri", "Gerçek zamanlı CRM senkronizasyonu", "Haftalık performans özet raporları"],
            results: [{ label: "CRM Güncelleme Süresi", value: "0 dk" }, { label: "Lead Yanıt Hızı", value: "+%340" }, { label: "Satış İdari Süresi", value: "-%70" }]
          }
        },
        scope: {
          badge: "PROJE KAPSAMI",
          title: "Otomasyon",
          titleAccent: "Yolculuğunuz.",
          subtitle: "Her otomasyon projesi özgündür. Bu kapsamlar size bir başlangıç noktası sunar; nihai teklifi tam ihtiyaçlarınıza göre şekillendiririz.",
          cta: "Özel Teklif Al",
          starter: {
            tag: "STARTER", title: "İlk Bot", for: "Tek bir süreci otomatikleştiren işletmeler için",
            timeline: "1 – 2 Hafta", timelineLabel: "Tahmini Süre",
            features: ["1 chatbot veya iş akışı otomasyonu", "2-3 araç entegrasyonu", "Temel analitik ve raporlama", "1 aylık lansman sonrası destek", "Bilgi tabanı kurulumu"]
          },
          growth: {
            tag: "GROWTH", title: "Tam Sistem", for: "Eksiksiz bir otomasyon katmanı inşa eden ekipler için",
            timeline: "2 – 4 Hafta", timelineLabel: "Tahmini Süre", badge: "En Popüler",
            features: ["Starter'daki her şey", "Çok adımlı AI ajan iş akışları", "CRM ve veri platformu entegrasyonları", "Özel AI modeli ince ayarı", "Gelişmiş analitik panosu", "Öncelikli destek ve SLA"]
          },
          enterprise: {
            tag: "ENTERPRISE", title: "Tam Otopilot", for: "Büyük ölçekte otomasyon kuran organizasyonlar için",
            timeline: "1 – 2 Ay", timelineLabel: "Tahmini Süre",
            features: ["Sınırsız iş akışı ve ajan", "Özel LLM dağıtımı", "On-premise veya özel bulut", "SOC2 ve GDPR uyumluluğu", "Özel otomasyon mühendisi", "7/24 izleme ve destek"]
          }
        },
        faq: {
          badge: "SSS",
          title: "Sık Sorulan",
          titleAccent: "Sorular.",
          items: [
            { q: "Yapay zeka otomasyonu tam olarak ne demek?", a: "Yapay zeka otomasyonu, önceden insan çabasına ihtiyaç duyan görevleri yapay zeka ile yürütür: müşteri sorularını yanıtlamaktan doküman işlemeye ve sistemler arası veri senkronizasyonuna kadar. Bu sistemleri baştan sona tasarlıyor, inşa ediyor ve devreye alıyoruz." },
            { q: "Bir otomasyon projesi ne kadar sürer?", a: "Basit otomasyonlar 1-2 haftada teslim edilir. Tam otomasyon sistemleri 2-4 hafta, kurumsal ölçekli ajan sistemleri ise 1-2 ay sürer. Başlamadan önce net bir zaman çizelgesi üzerinde her zaman anlaşırız." },
            { q: "Otomasyonları kullanmak için teknik bilgiye ihtiyacım var mı?", a: "Hayır. Tamamen arka planda çalışan otomasyonlar tasarlıyoruz. Panolar, raporlar veya mevcut araçlarınız üzerinden etkileşim kuruyorsunuz; sizin tarafınızda kod veya konfigürasyon yok." },
            { q: "Hangi platformları ve araçları entegre edebilirsiniz?", a: "API'ye sahip neredeyse her platformla entegre oluyoruz: CRM'ler (HubSpot, Salesforce), iletişim araçları (WhatsApp, Slack, e-posta), ödeme sistemleri (Stripe), ERP'ler, özel veritabanları ve daha fazlası." },
            { q: "Fiyatlandırma nasıl işliyor?", a: "Her proje ayrı ayrı kapsamlandırılır. İş akışlarınızı ve hedeflerinizi anladıktan sonra sürpriz olmayan sabit fiyatlı bir teklif gönderiyoruz. Süregelen bakım aylık retainer olarak sunulur." },
            { q: "Otomasyon devreye girdikten sonra ne olur?", a: "Lansman desteği her zaman dahildir. Sistemi izliyor, sorunları çözüyor ve dokümantasyon sağlıyoruz. Süregelen iyileştirmeler için öncelikli yanıtlı retainer planları sunuyoruz." }
          ]
        },
        cta: { badge: "HIZLI TEKLİF", title: "Operasyonlarınızı otomatikleştirmeye hazır mısınız?", subtitle: "Tekrarlayan işleri halleden ve sizi büyümeye odaklanmaya bırakan akıllı sistemleri birlikte inşa edelim.", button: "PROJEYİ BAŞLAT" },
        techStack: { badge: "AI & OTOMASYON YIĞINI" }
      },
      contact: {
        title: "Vizyonunuzu İnşa Edelim",
        titlePart1: "Vizyonunuzu",
        titleAccent: "Paylaşın.",
        subtitle: "Size özel yönettiğimiz tasarım sürecinde hedefimiz, diğer vizyoner markalar gibi her anını severek kullandığınız bir dijital platform inşa etmektir.",
        directLabel: "DOĞRUDAN İLETİŞİM / E-POSTA",
        fullName: "Adınız Soyadınız",
        email: "E-posta Adresiniz",
        service: "Hizmet Türü",
        budget: "Tahmini Bütçe",
        description: "Proje Açıklaması",
        descPlaceholder: "Vizyonunuzu, hedeflerinizi ve özel gereksinimlerinizi kısaca açıklayın...",
        launch: "Projeyi Başlat",
        launching: "GÖNDERİLİYOR...",
        timelineLabel: "Hedef Zaman Çizelgesi",
        timelineOptions: {
          t1: "1-2 Hafta",
          t2: "1 Ay",
          t3: "3 Ay+",
          t4: "Esnek"
        },
        services: {
          branding: "Özel Web Tasarımı",
          ai: "SaaS Geliştirme",
          automation: "AI Otomasyon",
          ecommerce: "Lüks E-Ticaret",
          enterprise: "Kurumsal Platform"
        },
        success: {
          title: "Sinyal Alındı.",
          message: "Proje verileriniz güvenli bir şekilde iletildi. Ekibimiz vizyonunuzu inceleyecek ve 24 saat içinde size ulaşacaktır.",
          emailNote: "Teklif ve proje detayları şu adrese iletilecektir:",
          cta: "Başka Bir Mesaj Gönder"
        }
      },
      customerDashboard: {
        stats: {
          purchasedAssets: "SATIN ALINAN VARLIKLAR",
          activeSystems: "AKTİF SİSTEMLER",
          protocolStatus: "PROTOKOL DURUMU",
          verified: "DOĞRULANDI"
        },
        sections: {
          assets: "DİJİTAL VARLIKLARIM / SATIN ALINAN PROJELER",
          shortcuts: "SİSTEM KISAYOLLARI"
        },
        status: {
          active: "AKTİF SİSTEM",
          revision: "REVİZYON BEKLİYOR",
          development: "KURULUM AŞAMASINDA",
          processing: "İŞLENİYOR",
          pending: "ÖDEME BEKLENİYOR"
        },
        empty: {
          desc: "Henüz bir varlık edinilmedi. İlk projenizi başlatmaya hazır mısınız?",
          cta: "MİMARİYİ KEŞFET"
        },
        noAssets: "Henüz bir varlık edinilmedi.",
        exploreArchitecture: "MİMARİYİ KEŞFET",
        investmentValue: "Yatırım Değeri",
        paid: "ÖDENDİ",
        nodeIdentityActive: "DÜĞÜM KİMLİĞİ: AKTİF",
        premiumDigitalAsset: "Premium Dijital Varlık",
        actions: {
          explore: { title: "Mimariyi Keşfet", desc: "Premium şablon koleksiyonumuza göz atın" },
          identity: { title: "Kimlik Ayarları", desc: "Profilinizi ve tercihlerinizi güncelleyin" },
          support: { title: "Teknik Destek", desc: "Mimari ekibimizle bağlantı kurun" }
        }
      },
      auth: {
        premiumPlatform: "Premium Platform",
        heroTitlePart1: "DİJİTAL",
        heroTitlePart2: "MİMARİNİ",
        heroTitlePart3: "İNŞA ET",
        heroSubtitle: "ErpolArt ekosistemine giriş yapın ve sistemlerinizi yönetin.",
        features: {
          favorites: "Favoriler",
          templates: "Premium Şablonlar",
          checkout: "Güvenli Protokol",
          experience: "Kusursuz Deneyim"
        },
        signin: "Giriş Yap",
        signup: "Kayıt Ol",
        orWithEmail: "VEYA E-POSTA İLE",
        email: "E-POSTA ADRESİ",
        emailPlaceholder: "ornek@mail.com",
        password: "ŞİFRE",
        forgotPassword: "Şifremi Unuttum",
        signinSubmit: "GİRİŞ YAP",
        signupSubmit: "KAYIT OL",
        noAccount: "Sistemde kaydın yok mu? ",
        alreadyMember: "Zaten üye misin? ",
        copyright: "© 2026 ErpolArt Digital Atelier",
        legalHintPart1: "Giriş yaparak ",
        terms: "Hizmet Şartları",
        legalHintPart2: " ve ",
        privacy: "Gizlilik Politikası",
        legalHintPart3: "'nı kabul etmiş olursunuz.",
        loginErrorPrefix: "Hata: ",
        passwordMismatch: "Şifreler uyuşmuyor.",
        passwordCheck: {
          chars: "Min 6 Karakter",
          match: "Eşleşti"
        },
        checkEmail: "E-postanı Kontrol Et",
        verificationSent: "Doğrulama bağlantısı şuraya gönderildi:",
        verifiedSuccess: "E-posta Doğrulandı!",
        verifiedSubtitle: "Hesabınız doğrulandı. Devam etmek için giriş yapın.",
        returnToSignIn: "Girişe Dön",
        premiumAccess: "PREMIUM ERİŞİM",
        fullName: "AD SOYAD",
        fullNamePlaceholder: "Adınız Soyadınız",
        confirmPassword: "ŞİFREYİ ONAYLA"
      },

      proposalPage: {
        loading: "Protokol Çözümleniyor...",
        notFound: "Teklif bulunamadı veya süresi dolmuş olabilir.",
        returnHome: "Ana Sayfaya Dön",
        badge: "ÖZEL PROJE TEKLİFİ",
        clientLabel: "MÜŞTERİ",
        verified: "Doğrulanmış B2B Protokol",
        issued: "Düzenlenme Tarihi",
        tierPremium: "PREMIUM PROFESSIONAL",
        tierPlatinum: "PLATINUM ELİTE",
        saasTitle: "Özel SaaS Mimari",
        saasTitleAccent: "Teklifi",
        autoTitle: "AI Otomasyon Sistemi",
        autoTitleAccent: "Teklifi",
        techStack: "Teknoloji Altyapısı",
        modules: "Temel Modüller",
        notes: "Proje Notları",
        included: "Teklife Dahil Olanlar",
        includedItems: [
          { title: "Kaynak Kod Teslimi", desc: "Tüm kaynak kodlar GitHub üzerinden eksiksiz teslim edilir." },
          { title: "Canlıya Alma Desteği", desc: "Üretim ortamına geçiş ve deployment sürecinde tam destek sağlanır." },
          { title: "Teknik Dokümantasyon", desc: "API referansları ve mimari dokümantasyon hazırlanır." },
          { title: "Revizyon Hakkı", desc: "{n} revizyon turu proje kapsamına dahildir." },
          { title: "Teslimat Sonrası Destek", desc: "Teslim sonrası 30 gün teknik destek süreci." },
          { title: "Haftalık İlerleme Toplantıları", desc: "Geliştirme sürecinde haftalık senkronizasyon görüşmeleri." }
        ],
        nextSteps: "Sonraki Adımlar",
        steps: [
          { num: "01", title: "Ödeme", desc: "Projeyi onaylayın ve ilk ödemeyi tamamlayın." },
          { num: "02", title: "Kickoff", desc: "Detaylı brifing toplantısı ve proje planı oluşturulur." },
          { num: "03", title: "Geliştirme", desc: "Belirlenen teknoloji altyapısı ile proje hayata geçirilir." },
          { num: "04", title: "Teslim", desc: "Test edilmiş ve belgelenmiş proje eksiksiz teslim edilir." }
        ],
        investment: "Yatırım Özeti",
        fixedFee: "Sabit Uygulama Ücreti",
        timelineLabel: "Teslim Süresi",
        revisionsLabel: "Revizyon Hakkı",
        cta: "PROJEYİ ONAYLA VE ÖDEMEYE GEÇ",
        secure: "GÜVENLİ ÖDEME PROTOKOLÜ",
        encryption: "Uçtan Uca Şifreleme",
        questionLabel: "Sorunuz mu var?",
        questionLink: "Bize ulaşın",
        revisionTitle: "Değişiklik veya Ekleme Talep Et",
        revisionSubtitle: "Kapsama bir şey eklemek veya değiştirmek ister misiniz? Bize bildirin.",
        revisionPlaceholder: "Talep ettiğiniz değişikliği veya eklemeyi açıklayın...",
        revisionCta: "Talebi Gönder",
        revisionSent: "Talebiniz alındı. Teklifi en kısa sürede güncelleyeceğiz."
      },

    }
  },
  de: {
    translation: {
      legal: legalTranslations.de,
      checkoutAgreements: legalTranslations.de.agreements,
      auth: {
        premiumPlatform: "Premium-Plattform",
        heroTitlePart1: "DEINE DIGITALE",
        heroTitlePart2: "ARCHITEKTUR",
        heroTitlePart3: "AUFBAUEN",
        heroSubtitle: "Melde dich im ErpolArt-Ökosystem an und verwalte deine Systeme.",
        features: {
          favorites: "Favoriten",
          templates: "Premium-Vorlagen",
          checkout: "Sicheres Protokoll",
          experience: "Nahtlose Erfahrung"
        },
        signin: "Anmelden",
        signup: "Registrieren",
        orWithEmail: "ODER MIT E-MAIL",
        email: "E-MAIL-ADRESSE",
        emailPlaceholder: "beispiel@mail.com",
        password: "PASSWORT",
        forgotPassword: "Passwort vergessen?",
        signinSubmit: "ANMELDEN",
        signupSubmit: "REGISTRIEREN",
        noAccount: "Noch kein Konto? ",
        alreadyMember: "Bereits Mitglied? ",
        copyright: "© 2026 ErpolArt Digital Atelier",
        legalHintPart1: "Mit der Anmeldung stimmst du unseren ",
        terms: "Nutzungsbedingungen",
        legalHintPart2: " und der ",
        privacy: "Datenschutzrichtlinie",
        legalHintPart3: " zu.",
        loginErrorPrefix: "Fehler: ",
        passwordMismatch: "Passwörter stimmen nicht überein.",
        passwordCheck: {
          chars: "Min. 6 Zeichen",
          match: "Übereinstimmung"
        },
        checkEmail: "Prüfe deine E-Mail",
        verificationSent: "Bestätigungslink gesendet an",
        verifiedSuccess: "E-Mail bestätigt!",
        verifiedSubtitle: "Dein Konto wurde erfolgreich verifiziert. Bitte melde dich an, um fortzufahren.",
        returnToSignIn: "Zurück zur Anmeldung",
        premiumAccess: "PREMIUM-ZUGANG",
        fullName: "VOR- UND NACHNAME",
        fullNamePlaceholder: "Dein vollständiger Name",
        confirmPassword: "PASSWORT BESTÄTIGEN"
      },
      orderSuccess: {
        celebration: "BESTELLUNG BESTÄTIGT",
        title: "Protokoll",
        titleAccent: "Initiiert.",
        subtitle: "Definieren Sie die Markenwerte und Details, die für Ihre digitale Architektur erforderlich sind.",
        revision: "REVISION #",
        editDesc: "Sie können Ihre vorherigen Eingaben an Ihre Bedürfnisse anpassen. Änderungen werden im nächsten Aktualisierungszyklus verarbeitet.",
        form: {
          brandName: "MARKEN- / PROJEKTNAME",
          brandNamePlaceholder: "Z.B. ErpolArt Studio",
          editLimit: "1 REVISION ERLAUBT",
          manualReview: "MANUELLE PRÜFUNG",
          uploadLogo: "LOGO HOCHLADEN",
          nullEntity: "BILD AUSWÄHLEN",
          colors: "MARKENFARBEN",
          notes: "ARCHITEKTONISCHE NOTIZEN (OPTIONAL)",
          notesPlaceholder: "Weitere Details zum Projekt...",
          uploadHint: "Per Drag & Drop verschieben oder zum Hochladen klicken. Nur PNG/SVG mit transparentem Hintergrund akzeptiert.",
          alertLogo: "Bitte laden Sie nur PNG- oder SVG-Dateien mit transparentem Hintergrund hoch.",
          submit: "Personalisierung autorisieren",
          submitting: "Protokoll wird verarbeitet...",
          saveChanges: "Änderungen speichern",
          saveSuccess: "Logik erfolgreich aktualisiert. Weiterleitung wird initialisiert...",
          errorTitle: "PROTOKOLLFEHLER",
          submitError: "Bereitstellungsinitialisierung fehlgeschlagen. Bitte überprüfen Sie Ihre Verbindung.",
          saveError: "Synchronisationsfehler",
          fetchError: "Fehler beim Abrufen der Daten",
          loadError: "Architekturdaten konnten nicht geladen werden. Protokoll wird aktualisiert...",
          trackStatus: "Bestellstatus verfolgen",
          manualReview: "Status: Manuelle Architekturprüfung",
          fileLimitError: "Architektonische Berührung: Bitte laden Sie Ihr Logo in einer Größe von weniger als 5 MB hoch.",
          addonsTitle: "ADD-ONS & ANFORDERUNGEN",
          aiContextLabel: "KI-CHATBOT-KONTEXT / PROMPT",
          aiContextPlaceholder: "Z.B. Unser Assistent muss einen sehr höflichen und professionellen Ton bewahren...",
          targetLanguagesLabel: "ZIELSPRACHEN (Z.B. ENGLISCH, TÜRKISCH, DEUTSCH)",
          targetLanguagesPlaceholder: "Englisch, Türkisch, Deutsch usw."
        }
      },
      orderCancel: {
        title: "Transaktion",
        titleAccent: "Unterbrochen.",
        subtitle: "Der Zahlungsvorgang konnte nicht abgeschlossen werden. Keine Sorge, Ihr Konto wurde nicht belastet. Sie können es erneut versuchen oder unseren technischen Support kontaktieren.",
        retry: "Zahlung erneut versuchen",
        retryDesc: "Zurück zur Vorlagengalerie und die Transaktion erneut versuchen.",
        backToHome: "Zurück zum Atelier",
        support: "Support kontaktieren",
        supportDesc: "Brauchen Sie Hilfe? Unser technischer Support steht bereit, um Ihnen bei Ihrem Erwerb zu helfen.",
        securityShield: "SICHERER REPLIKA-SCHILD AKTIVIERT",
        alerts: {
          success: "Zahlung erfolgreich erhalten!",
          failed: "Zahlung unterbrochen. Bitte überprüfen Sie Ihre Kartendaten."
        }
      },
      globalSignal: {
        title: "Zahlung Bestätigt",
        message: "Signal empfangen und Knotenverbindung hergestellt. Sie werden zum Protokollformular weitergeleitet, um Ihre Architektur zu personalisieren.",
        connecting: "Verbindung wird hergestellt..."
      },
      common: {
        pages: "Seiten",
        items: "Elemente",
        loading: "Wird geladen...",
        edit: "Einrichtungsdetails bearbeiten",
        architectureNotFound: "Architektur nicht gefunden.",
        proceedToWorkspace: "Bereit zur Bereitstellung"
      },
      purchases: {
        subtitle: "Verwalten Sie Ihre digitalen Assets und finalisieren Sie die Bereitstellungsdetails.",
        totalAssets: "Gesamte Assets",
        emptyTitle: "Noch keine digitalen Assets",
        emptyDesc: "Sie haben noch keine Vorlagen. Bereit, die Premium-Welt von ErpolArt zu erkunden?",
        browseCTA: "Vorlagen erkunden"
      },
      nav: { home: "Startseite", projects: "Projekte", templates: "Vorlagen", saas: "SaaS", automations: "KI-Automatisierungen", about: "Über uns", contact: "Kontakt", myPurchases: "Meine Käufe", accountSettings: "Kontoeinstellungen", logout: "Abmelden", signIn: "Anmelden", register: "Registrieren" },
      status: {
        acquired: "ERWORBEN",
        offMarket: "NICHT VERFÜGBAR"
      },
      hero: {
        title1: "Moderne Arbeit,",
        title2: "Moderne Software.",
        subtitle: "Maßgeschneiderte Web-Erlebnisse und exklusive Vorlagen. Mit beispielloser Präzision und Geschwindigkeit geliefert.",
        viewProjects: "Projekte ansehen",
        browseTemplates: "Vorlagen ansehen",
        scroll: "SCROLLEN"
      },
      howItWorks: {
        title: "Moderne Digitale Architektur",
        subtitle: "Wählen Sie den Engineering-Weg, der zu Ihrer Vision passt. Von sofortiger Exklusivität bis hin zu komplexen SaaS-Ökosystemen.",
        path1: "OPTION 01: SIGNATURE VORLAGEN",
        path1Title: "Signature",
        path1TitleAccent: "Vorlagen",
        path1Desc: "Vorentwickelte Meisterwerke für Unternehmen, die sofort Exzellenz fordern. Jede Vorlage wird nur EINMAL verkauft – garantiert Ihre einzigartige digitale Identität.",
        path1Badge1: "24H LIEFERUNG",
        path1Badge2: "Bereit zum Start",
        path1Explore: "Kollektion durchsuchen",

        path2: "OPTION 02: MAẞGESCHNEIDERTE SOFTWARE",
        path2Title: "Individuelle",
        path2TitleAccent: "Architekturen",
        path2Desc: "Eine vollständige visuelle und funktionale Wiedergeburt. Wir schaffen einzigartige digitale Universen, die auf die DNA Ihrer Marke zugeschnitten sind.",
        path2Badge1: "KI-PRÄZISION",
        path2Badge2: "Skalierbare Logik",
        path2Explore: "Individuelle Reise beginnen",

        path3: "OPTION 03: SAAS-PROJEKTE",
        path3Title: "Intelligente",
        path3TitleAccent: "SaaS-Ökosysteme",
        path3Desc: "Von KI-gesteuerten Chatbots bis hin zu Echtzeit-Analyse-Dashboards entwickeln wir skalierbare SaaS-Plattformen.",
        path3Badge1: "KI-INTEGRIERT",
        path3Badge2: "Enterprise Cloud",
        path3Explore: "SaaS-Projekte erkunden",
        path4: "OPTION 04: KI-AUTOMATISIERUNGEN",
        path4Title: "Intelligente",
        path4TitleAccent: "KI-Automatisierungen",
        path4Desc: "Optimieren Sie Ihre Geschäftsprozesse mit autonomen KI-Agenten und intelligenten Workflow-Automatisierungen. Wir bauen das digitale Gehirn, das Ihr Unternehmen rund um die Uhr antreibt.",
        path4Badge1: "AUTONOME AGENTEN",
        path4Badge2: "Effizienz-Kern",
        path4Explore: "KI-Automatisierungen erkunden",

        systemStatus: "Systemkern-Status",
        enterpriseArch: "Enterprise-Architektur",
        globalScale: "Für globale Skalierung gebaut"
      },
      saasPage: {
        hero: {
          badge: "NÄCHSTE GENERATION SOFTWARE",
          titlePart1: "Stärken Sie Ihr Business",
          titlePart2: "mit Präzision.",
          subtitle: "Wir entwickeln maßgeschneiderte SaaS-Plattformen, KI-gesteuerte Dashboards und intelligente Automatisierungssysteme, die die Arbeitsweise und Skalierung von Unternehmen transformieren.",
          cta: "Starten Sie Ihr SaaS-Projekt",
          secondary: "Fähigkeiten erkunden"
        },
        features: {
          badge: "KERNKOMPETENZEN",
          title: "Engineering",
          titleAccent: "Präzision.",
          subtitle: "Von konversationeller KI bis hin zu Echtzeit-Analysen entwickeln wir die Software-Infrastruktur, die Ihrem Unternehmen einen unfairen Vorteil verschafft.",
          chatbot: { title: "KI-Chatbot-Integration", desc: "Speziell trainierte KI-Agenten für Kundensupport, Verkaufsunterstützung und interne Abläufe. Basierend auf GPT-4, Claude und proprietären Modellen." },
          dashboard: { title: "Smart Dashboard & Analytik", desc: "Echtzeit-KPI-Tracking, prädiktive Analysen und interaktive Datenvisualisierungen, die Rohdaten in wertvolle Geschäftsinformationen verwandeln." },
          automation: { title: "Workflow-Automatisierung", desc: "Eliminieren Sie repetitive Aufgaben mit intelligenten Automatisierungspipelines. Von E-Mail-Sequenzen bis zum Bestandsmanagement automatisieren wir Ihre Abläufe." },
          api: { title: "API & Integrations-Hub", desc: "Nahtlose Integrationen von Drittanbietern mit Zahlungsgateways, CRMs, ERPs und benutzerdefinierten Webhooks. Ihr SaaS, mit allem verbunden." },
          security: { title: "Sicherheit & Compliance", desc: "Sicherheit auf Unternehmensniveau mit End-to-End-Verschlüsselung, rollenbasierter Zugriffskontrolle und vollständiger Einhaltung von DSGVO, SOC2 und KVKK." },
          infrastructure: { title: "Skalierbare Cloud-Architektur", desc: "Cloud-native Microservices auf AWS, GCP oder Azure. Eine automatisch skalierende Infrastruktur, die mit Ihrer Nutzerbasis von 100 auf über 100.000 wächst." }
        },
        showcase: {
          badge: "FALLSTUDIEN",
          title: "Gelieferte",
          titleAccent: "Lösungen.",
          subtitle: "Echte SaaS-Plattformen, die wir für Unternehmen verschiedenster Branchen entworfen und implementiert haben.",
          project1: { title: "NexusAI CRM", desc: "KI-gestützte Kundenbeziehungsplattform mit prädiktivem Lead-Scoring und automatisierter Kontaktaufnahme.", stack: "Next.js · OpenAI · PostgreSQL" },
          contractoros: { 
            title: "ContractorOS", 
            desc: "Unternehmensmanagement-Ökosystem für moderne Bauunternehmer und Subunternehmer. Projektverfolgung in Echtzeit, automatisierte Abrechnung und intelligentes Kundenmanagement.", 
            stack: "Next.js · Supabase · AI",
            caseStudy: {
              challenge: "Fragmentierte Kommunikation, verlorene Unterlagen und Budgetüberschreitungen in Bauprojekten verursachen massives Chaos. Die manuelle Verwaltung von Teams, Materialien und Zeitplänen ist der größte Engpass der Branche.",
              solution: "Ein einheitliches Bau-Ökosystem, das mit Next.js und Supabase entwickelt wurde. Es synchronisiert den gesamten Projektlebenszyklus – vom Lead-Management bis hin zur automatisierten PDF-Rechnungsstellung und Budgetverfolgung in Echtzeit – auf einer einzigen, leistungsstarken Plattform.",
              features: [
                "Echtzeit-Analysen (Visualisierung mit Recharts)",
                "Automatisierte Dokumenten- und Rechnungsstellung (React-PDF)",
                "Sofortige Kommunikations- und Benachrichtigungssysteme (Resend)",
                "Sichere und schnelle Datenarchitektur (Supabase SSR)"
              ],
              results: [
                { label: "Operationelle Effizienz", value: "+40%" },
                { label: "Papierkram-Reduzierung", value: "100%" },
                { label: "Datentransparenz", value: "Vollständig" }
              ]
            }
          },
          brandpulse: { 
            title: "BrandPulse AI", 
            desc: "KI-gesteuerte Social-Media-Analyse- und Trendvorhersageplattform. Verfolgen Sie den digitalen Puls Ihrer Marke mit Echtzeit-Sentiment-Analyse und automatisierter Berichterstattung.", 
            stack: "Next.js · OpenAI · Pinecone",
            caseStudy: {
              challenge: "In der schnelllebigen digitalen Welt haben Marken Schwierigkeiten, ihren Ruf und ihre Auswirkungen auf soziale Medien in Echtzeit zu verfolgen. Die manuelle Analyse von Tausenden von Interaktionen ist unmöglich.",
              solution: "Eine hochmoderne Social-Media-Intelligence-Plattform mit KI-Unterstützung. BrandPulse AI aggregiert Daten, führt Sentiment-Analysen durch und visualisiert Trends mit interaktiven Recharts-Dashboards für einen 24/7 digitalen Puls.",
              features: [
                "Echtzeit-Sentiment-Analyse (KI-gestützt)",
                "Interaktive Trendvisualisierung (Recharts)",
                "Multi-Channel-Datenaggregation",
                "Automatisierte Reputationsberichte"
              ],
              results: [
                { label: "Tracking-Kapazität", value: "+120%" },
                { label: "Analysegeschwindigkeit", value: "<500ms" },
                { label: "Sentiment-Genauigkeit", value: "98%" }
              ]
            }
          },
          project2: { title: "Reseva AI", desc: "Echtzeit-Business-Intelligence-Dashboard mit benutzerdefiniertem KPI-Tracking und Teamzusammenarbeit.", stack: "React · D3.js · Supabase" },
          project3: { title: "AutoScale Commerce", desc: "Full-Stack-E-Commerce-SaaS mit Bestandsautomatisierung, Multi-Vendor-Unterstützung und KI-Empfehlungen.", stack: "Node.js · Stripe · Redis" }
        },
        cta: {
          badge: "DIREKTANFRAGE",
          title: "Bereit, Ihr SaaS zu bauen?",
          subtitle: "Lassen Sie uns eine Plattform entwerfen, die mit Ihren Ambitionen skaliert.",
          button: "Projekt starten"
        },
        caseStudy: {
          footerTitlePart1: "Gestalten Sie Ihre",
          footerTitlePart2: "SOFTWARE DER ZUKUNFT",
          footerSubtitle: "Bereit, Ihre Branche zu transformieren? Teilen Sie Ihre Vision und lassen Sie uns eine skalierbare Lösung entwerfen."
        },
        techStack: {
          badge: "TECHNOLOGIE-STACK",
          title: "Mit den Besten gebaut",
          subtitle: "Wir verwenden battle-tested, modernste Technologien, denen erstklassige Engineering-Teams weltweit vertrauen."
        },
        scope: {
          badge: "PROJEKTUMFANG",
          title: "Wählen Sie Ihren",
          titleAccent: "Startpunkt.",
          subtitle: "Jedes Projekt ist einzigartig. Diese Umfänge geben Ihnen einen Ausgangspunkt — das endgültige Angebot wird auf Ihre genauen Anforderungen zugeschnitten.",
          cta: "Individuelles Angebot anfordern",
          mvp: {
            tag: "MVP",
            title: "Schnell starten",
            for: "Für Gründer & Early-Stage-Startups",
            timeline: "1 – 2 Wochen",
            timelineLabel: "Geschätzte Dauer",
            features: [
              "Authentifizierung & Benutzerverwaltung",
              "Kernfunktion (1 Hauptmodul)",
              "Admin-Dashboard",
              "Zahlungsintegration",
              "Mobile responsiv"
            ]
          },
          growth: {
            tag: "GROWTH",
            title: "Smart skalieren",
            for: "Für wachsende Teams & validierte Produkte",
            timeline: "2 – 4 Wochen",
            timelineLabel: "Geschätzte Dauer",
            badge: "Beliebteste Wahl",
            features: [
              "Alles aus MVP",
              "KI / LLM-Integration",
              "Erweiterte Analysen",
              "Rollenbasierte Zugriffskontrolle",
              "API-Gateway & Webhooks",
              "Multi-Tenancy-Unterstützung"
            ]
          },
          enterprise: {
            tag: "ENTERPRISE",
            title: "Keine Grenzen",
            for: "Für komplexe, hochskalierte Systeme",
            timeline: "1 – 2 Monate",
            timelineLabel: "Geschätzte Dauer",
            features: [
              "Individuelle Architektur",
              "White-Label-Option",
              "On-Premise-Deployment",
              "Dediziertes SLA",
              "Individuelle Integrationen",
              "Prioritätssupport"
            ]
          }
        },
        faq: {
          badge: "FAQ",
          title: "Häufige",
          titleAccent: "Fragen.",
          items: [
            { q: "Wie lange dauert ein SaaS-Projekt?", a: "Es hängt vom Umfang ab. MVP-Projekte werden in 1-2 Wochen geliefert, Growth-Plattformen in 2-4 Wochen und komplexe Enterprise-Systeme in 1-2 Monaten. Wir einigen uns immer auf einen klaren Zeitplan vor dem Start." },
            { q: "Gehört uns der Quellcode?", a: "100% ja. Nach der Lieferung gehören Ihnen der gesamte Quellcode, die Datenbank und die Infrastruktur. Kein Lock-in, niemals." },
            { q: "Können später Funktionen hinzugefügt werden?", a: "Absolut. Wir bauen mit Skalierbarkeit im Sinn. Neue Module können jederzeit hinzugefügt werden, über einen Retainer-Plan oder als separates Projekt." },
            { q: "Wie funktioniert die Preisgestaltung?", a: "Jedes Projekt ist einzigartig, daher veröffentlichen wir keine Festpreise. Wir bewerten Umfang, Zeitplan und technische Anforderungen und senden dann ein Festpreisangebot. Keine Überraschungen." },
            { q: "Ist der Support nach dem Launch inbegriffen?", a: "Launch-Support ist immer inbegriffen. Für laufende Wartung bieten wir monatliche Retainer-Pläne mit Prioritätsreaktionszeiten an." },
            { q: "Wie kommunizieren wir während des Projekts?", a: "Über WhatsApp oder unser Website-Kontaktformular für sofortige Nachrichten, wöchentliche Fortschrittsberichte und Videoanrufe nach Bedarf. Volle Transparenz von Anfang bis Ende." }
          ]
        }
      },
      automationsPage: {
        hero: {
          badge: "KI-AUTOMATISIERUNGEN",
          title: "Intelligente",
          titleAccent: "KI-Automatisierungen",
          subtitle: "Optimieren Sie Ihr Unternehmen mit autonomen KI-Agenten, intelligenten Workflow-Automatisierungen und smarten Datenpipelines. Wir bauen das digitale Gehirn, das Ihr Unternehmen rund um die Uhr antreibt.",
          cta: "Projekt starten",
          secondary: "So funktioniert es"
        },
        features: {
          badge: "KERNKOMPETENZEN",
          title: "Was wir",
          titleAccent: "Automatisieren.",
          subtitle: "Von konversationeller KI bis zu autonomen Agenten — wir entwickeln intelligente Systeme, die repetitive Arbeit eliminieren und Ihre Abläufe skalieren.",
          chatbot: { title: "KI-Chatbot & Konversations-KI", desc: "Maßgeschneiderte Konversations-KI für Kundensupport, Verkaufsassistenz und interne Abläufe. Betrieben von GPT, Claude und proprietären LLMs." },
          agents: { title: "Autonome KI-Agenten", desc: "Selbstgesteuerte KI-Agenten, die mehrstufige Aufgaben ohne menschliches Eingreifen planen, überlegen und ausführen. Entwickelt mit LangChain und individuellen Agentenframeworks." },
          automation: { title: "Workflow-Automatisierung", desc: "Eliminieren Sie repetitive Aufgaben mit intelligenten Automatisierungspipelines. Von E-Mail-Sequenzen bis zum Bestandsmanagement — wir automatisieren Ihre Abläufe von Anfang bis Ende." },
          data: { title: "Datenverarbeitung & ETL", desc: "Skalierbare Pipelines, die Daten aus beliebigen Quellen extrahieren, transformieren und laden. Echtzeit-Verarbeitung mit ereignisgesteuerter Architektur und intelligenter Normalisierung." },
          document: { title: "Dokumenten-KI", desc: "Intelligente Dokumentenverarbeitung — strukturierte Daten aus PDFs, Rechnungen, Verträgen und Formularen mit Vision-KI und LLMs extrahieren." },
          reporting: { title: "Reporting-Automatisierung", desc: "Automatisierte Dashboards und geplante Berichte werden in Ihren Posteingang geliefert. Rohdaten auf Autopilot in entscheidungsreife Erkenntnisse umwandeln." }
        },
        showcase: {
          badge: "ANWENDUNGSFÄLLE",
          title: "Praxisnahe",
          titleAccent: "Automatisierungen.",
          subtitle: "Intelligente Automatisierungssysteme, die wir für Unternehmen in verschiedenen Branchen entwickelt und implementiert haben.",
          ecommerce: {
            title: "E-Commerce-Automatisierung",
            desc: "Vollständige Auftragsabwicklung, Bestandssynchronisierung und Kundenkommunikation auf Autopilot.",
            stack: "n8n · OpenAI · Stripe · Supabase",
            challenge: "Manuelle Auftragsverfolgung, fragmentierte Bestandsaktualisierungen und verzögerte Kundenkommunikation verursachten Betriebsengpässe und senkten die Kundenzufriedenheit.",
            solution: "Ein vollautomatisches E-Commerce-Backend: Bestellungen lösen Bestandsaktualisierungen aus, Zahlungsbestätigungen versenden personalisierte E-Mails, und Niedrigbestandsalarme werden an Lieferanten gesendet.",
            features: ["Automatisierte Bestellung-zu-Lieferung-Pipeline", "Echtzeit-Bestandssynchronisierung kanalübergreifend", "KI-generierte personalisierte Kunden-E-Mails", "Niedrigbestand- und Nachbestellungsautomatisierung"],
            results: [{ label: "Manuelle Arbeit reduziert", value: "85%" }, { label: "Reaktionszeit", value: "<2 Min." }, { label: "Auftragsgenauigkeit", value: "99,8%" }]
          },
          support: {
            title: "KI-Support-Bot",
            desc: "24/7 intelligenter Kundensupport-Bot, trainiert auf Ihrer Produkt-Wissensbasis.",
            stack: "Claude AI · Pinecone · Supabase · Node.js",
            challenge: "Ein wachsendes SaaS-Unternehmen war mit repetitiven Support-Tickets überwältigt, die 60% der Teamzeit für bereits dokumentierte Fragen verbrauchten.",
            solution: "Ein Claude-betriebener Support-Bot, trainiert auf der Dokumentation und vergangenen Tickets. Er bearbeitet 80% der Anfragen autonom und eskaliert komplexe Probleme an das menschliche Team.",
            features: ["RAG-basierter Wissensabruf (Pinecone)", "Mehrsprachiger Support", "Automatische Weiterleitung an Menschen", "Ticket-Protokollierung & Analytik"],
            results: [{ label: "Automatisierte Tickets", value: "80%" }, { label: "Durchschn. Reaktionszeit", value: "<5 Sek." }, { label: "Team-Stunden gespart", value: "120/Mo." }]
          },
          crm: {
            title: "Lead & CRM-Automatisierung",
            desc: "Automatisiertes Lead-Scoring, Nurturing-Sequenzen und CRM-Updates ohne einen Finger zu rühren.",
            stack: "Make.com · GPT-4 · HubSpot · Webhooks",
            challenge: "Vertriebsmitarbeiter aktualisierten CRM-Einträge manuell und verloren täglich Stunden mit administrativer Arbeit statt zu verkaufen.",
            solution: "Ein vollautomatisches Lead-Management-System: Neue Leads werden von KI bewertet, segmentiert, in Nurturing-Sequenzen aufgenommen und CRM-Einträge in Echtzeit aktualisiert.",
            features: ["KI-gestütztes Lead-Scoring & Segmentierung", "Automatisierte mehrstufige Nurturing-Sequenzen", "Echtzeit-CRM-Synchronisierung", "Wöchentliche Performance-Digest-Berichte"],
            results: [{ label: "CRM-Aktualisierungszeit", value: "0 Min." }, { label: "Lead-Reaktionsgeschwindigkeit", value: "+340%" }, { label: "Vertrieb-Verwaltungszeit", value: "-70%" }]
          }
        },
        scope: {
          badge: "PROJEKTUMFANG",
          title: "Ihre Automatisierungs-",
          titleAccent: "Reise.",
          subtitle: "Jedes Automatisierungsprojekt ist einzigartig. Diese Umfänge geben Ihnen einen Ausgangspunkt — wir passen das endgültige Angebot genau auf Ihre Bedürfnisse an.",
          cta: "Individuelles Angebot anfordern",
          starter: {
            tag: "STARTER", title: "Erster Bot", for: "Für Unternehmen, die einen einzelnen Prozess automatisieren",
            timeline: "1 – 2 Wochen", timelineLabel: "Geschätzte Dauer",
            features: ["1 Chatbot oder Workflow-Automatisierung", "Integration mit 2-3 Tools", "Grundlegende Analytik & Reporting", "1-monatiger Post-Launch-Support", "Wissensbasis-Einrichtung"]
          },
          growth: {
            tag: "GROWTH", title: "Komplett-System", for: "Für Teams, die eine vollständige Automatisierungsebene aufbauen",
            timeline: "2 – 4 Wochen", timelineLabel: "Geschätzte Dauer", badge: "Beliebteste Wahl",
            features: ["Alles aus Starter", "Mehrstufige KI-Agenten-Workflows", "CRM- & Datenplattform-Integrationen", "Individuelles KI-Modell-Fine-Tuning", "Erweitertes Analyse-Dashboard", "Prioritätssupport & SLA"]
          },
          enterprise: {
            tag: "ENTERPRISE", title: "Voller Autopilot", for: "Für Organisationen, die im großen Maßstab automatisieren",
            timeline: "1 – 2 Monate", timelineLabel: "Geschätzte Dauer",
            features: ["Unbegrenzte Workflows & Agenten", "Individuelles LLM-Deployment", "On-Premise oder Private Cloud", "SOC2 & DSGVO-Konformität", "Dedizierter Automatisierungs-Ingenieur", "24/7-Monitoring & Support"]
          }
        },
        faq: {
          badge: "FAQ",
          title: "Häufige",
          titleAccent: "Fragen.",
          items: [
            { q: "Was genau ist KI-Automatisierung?", a: "KI-Automatisierung nutzt künstliche Intelligenz, um Aufgaben auszuführen, die bisher menschliches Eingreifen erforderten. Wir entwickeln und implementieren diese Systeme von Anfang bis Ende." },
            { q: "Wie lange dauert ein Automatisierungsprojekt?", a: "Einfache Automatisierungen werden in 1-2 Wochen geliefert. Vollständige Systeme dauern 2-4 Wochen, Enterprise-Agentensysteme 1-2 Monate. Wir einigen uns immer auf einen klaren Zeitplan vor dem Start." },
            { q: "Brauche ich technisches Wissen, um die Automatisierungen zu nutzen?", a: "Nein. Wir entwickeln Automatisierungen, die vollständig im Hintergrund laufen. Sie interagieren über Dashboards, Berichte oder Ihre bestehenden Tools. Kein Code, keine Konfiguration Ihrerseits." },
            { q: "Welche Plattformen und Tools können Sie integrieren?", a: "Wir integrieren mit praktisch jeder Plattform mit einer API: CRMs (HubSpot, Salesforce), Kommunikationstools (WhatsApp, Slack, E-Mail), Zahlungssysteme (Stripe), ERPs und mehr." },
            { q: "Wie ist die Preisgestaltung strukturiert?", a: "Jedes Projekt wird individuell bewertet. Nachdem wir Ihre Workflows verstanden haben, senden wir ein Festpreisangebot ohne Überraschungen. Laufende Wartung ist als monatlicher Retainer erhältlich." },
            { q: "Was passiert, nachdem die Automatisierung live geht?", a: "Launch-Support ist immer inbegriffen. Wir überwachen das System, beheben Probleme und stellen Dokumentation bereit. Für laufende Verbesserungen bieten wir Retainer-Pläne mit Prioritätsreaktionen an." }
          ]
        },
        cta: { badge: "DIREKTANFRAGE", title: "Bereit, Ihre Abläufe zu automatisieren?", subtitle: "Lassen Sie uns die intelligenten Systeme bauen, die repetitive Arbeit erledigen, während Sie sich auf Wachstum konzentrieren.", button: "PROJEKT STARTEN" },
        techStack: { badge: "KI & AUTOMATISIERUNGS-STACK" }
      },
      latest: {
        title: "Frisch aus dem Labor",
        titlePart1: "Lab-Frisch",
        titlePart2: "Kreationen",
        subtitle: "Unsere neuesten digitalen Kreationen, entwickelt für Leistung und Design.",
        viewAll: "Alle Arbeiten ansehen",
        new: "Neu",
        viewPresentation: "Präsentation ansehen",
        buyNow: "Jetzt kaufen",
        sold: "VERKAUFT",
        explore: "Erkunden",
        browseFull: "Klicken Sie hier, um unsere gesamte Kollektion zu durchsuchen"
      },
      aboutTeaser: {
        title: "Wir glauben, dass das Web dynamisch, schön und mit Präzision entwickelt sein sollte. ErpolArt existiert an der Schnittstelle von menschlicher Kreativität und KI-Effizienz.",
        subtitle: "Wir sind nicht nur Entwickler. Wir sind digitale Architekten, die die nächste Generation von Premium-Web-Erlebnissen bauen.",
        discover: "Unsere Geschichte entdecken"
      },
      templatesPage: {
        catalog: "Katalog 2024.v1",
        availability: {
          all: "Alle Assets",
          available: "Bereit zur Bereitstellung",
          acquired: "Exklusives Portfolio"
        },
        titlePart1: "Fertige",
        titlePart2: "Exklusivität.",
        subtitle: "Elite digitale Architekturen, vorkonstruiert für den schnellen Einsatz. Wählen Sie Ihre Identität und besitzen Sie sie – exklusiv.",
        protocolTitle: "Strenges Exklusivitätsprotokoll",
        protocolDescText: "Unsere Vorlagen werden nur einmal verkauft. Nach dem Kauf wird die Architektur dauerhaft aus dem Katalog entfernt. Keine Klone. Keine Duplikate.",
        deployment: "24H Schnelle Bereitstellung",
        rights: "Vollständige Übertragung der IP-Rechte",
        categories: {
          all: "Alle Architekturen",
          beauty: "Beauty & Wellness",
          fitness: "Fitness & Gesundheit",
          corporate: "Unternehmen",
          law: "Anwaltskanzlei",
          rent: "Autovermietung",
          restaurant: "Restaurant",
          portfolio: "Portfolio",
          ecommerce: "E-Commerce",
          realestate: "Immobilien"
        },
        tiers: {
          corporate: "CORPORATE",
          pro: "PRO",
          premium: "PREMIUM",
          platinum: "PLATIN",
          standard: "Standard Premium",
          architect: "Architekten-Edition",
          elite: "Elite Artefakt"
        },
        modal: {
          ready: "24H Bereit",
          protection: "IP-Schutz",
          intel: "Design-Intelligenz",
          viewport: "Viewport-Logik",
          responsive: "Vollständig responsiv",
          integrity: "Kernintegrität",
          clean: "Reines React",
          anim: "Anim-Engine",
          features: "Funktionen",
          stack: "Stack"
        },
        details: "Details ansehen",
        projectIntel: "Projekt-Infos",
        filterTitle: "Kategorie wählen",
        filterSelection: "OPTION WÄHLEN",
        transparencyBanner: {
          protocol: "Protokoll 02",
          title: "Strenge Exklusivität",
          titleAccent: "Protokoll",
          statement: "Exklusivitätserklärung",
          headline: "Ein Kauf. Ein Besitzer. Null Klone.",
          description: "Unsere Vorlagen werden nur einmal verkauft. Nach dem Kauf wird die Architektur dauerhaft aus dem Katalog entfernt. Sie kaufen nicht nur eine Seite; Sie sichern sich ein exklusives geistiges Eigentum.",
          ownership: "Einzeleigentum",
          customLogic: "24H Bereitstellung",
          performance: "Schnellere Bereitstellung",
          build: "Build 2024.v1.0",
          authentic: "Exklusiv"
        }
      },
      aboutPage: {
        seo: {
          title: "Über uns — ErpolArt | Moderne Softwareagentur",
          description: "Lernen Sie das ErpolArt-Team kennen. Wir entwickeln moderne, schnelle Softwarelösungen — maßgeschneiderte Web-Apps, SaaS-Plattformen und KI-Automatisierungen."
        },
        hero: {
          titlePart1: "Digital Atelier,",
          titlePart2: "Absolute Einzigartigkeit gestalten.",
          subtitle: "Wir bauen nicht nur Websites. Wir entwerfen maßgeschneiderte digitale Ökosysteme und exklusive Vorlagen, die visionäre Marken hervorheben."
        },
        whoWeAre: {
          title: "Wer wir sind",
          p1: "ErpolArt wurde auf einer einfachen Prämisse gegründet: Das traditionelle Modell der Webdesign-Agenturen ist veraltet. Es ist zu langsam, zu teuer und basiert oft auf Vorlagen, aus denen Unternehmen in Monaten herauswachsen.",
          p2: "Wir sind ein Kollektiv aus Designern, Entwicklern und KI-Spezialisten. Durch die Integration fortschrittlicher Sprachmodelle in unseren Workflow reduzieren wir die Zeit für Standardcode drastisch.",
          p3: "Diese Effizienz erlaubt uns, uns auf das Wesentliche zu konzentrieren: maßgeschneiderte, erstklassige Ästhetik und makellose Benutzererfahrung.",
          stat1: "Schnellere Lieferung",
          stat2: "Exklusiver Code"
        },
        approach: {
          title: "Unser Ansatz",
          subtitle: "Wo menschliche Kreativität steuert und künstliche Intelligenz beschleunigt.",
          items: {
            ai: { title: "KI-First Entwicklung", desc: "Wir nutzen modernste KI-Codegenerierung, um komplexe Logik schnell zu formulieren. Das Ergebnis ist robuster, leistungsstarker Code in kürzester Zeit." },
            design: { title: "Design, das überzeugt", desc: "Ästhetik zählt. Wir entwerfen visuell beeindruckende Interfaces mit 3D-Motion und erstklassiger Typografie." },
            exclusive: { title: "Exklusive Lieferung", desc: "Ob Individualbau oder Vorlage, Exklusivität ist garantiert. Wir verkaufen eine Vorlage nach dem Erwerb nie wieder." }
          }
        },
        team: {
          titlePart1: "Das",
          titlePart2: "Syndikat",
          subtitle: "Lernen Sie die digitalen Architekten und kreativen Rebellen kennen, die das Web der nächsten Generation bauen.",
          connect: "Verbinden",
          memberStatus: {
            coding: "Codiert",
            thinking: "Denkt nach",
            root: "Root-Zugriff",
            animation: "In AfterEffects"
          }
        },
        values: {
          velocity: { name: "Helligkeit", desc: "Beschleunigte Projektabwicklung ohne Kompromisse bei der Qualität." },
          exclusivity: { name: "Exklusivität", desc: "Ihr digitaler Fußabdruck gehört nur Ihnen. Keine Duplikate." },
          transparency: { name: "Transparenz", desc: "Klare Kommunikation, faire Preise, keine versteckten Klauseln." },
          quality: { name: "Qualität", desc: "Besessene Aufmerksamkeit für die Mikrointeraktionen, die eine Seite aufwerten." }
        },
        cta: {
          title: "Bereit durchzustarten?",
          subtitle: "Lassen Sie uns ein digitales Erlebnis bauen, das Ihre Konkurrenz in den Schatten stellt.",
          email: "Schreiben Sie uns"
        }
      },
      projectsData: {
        p1: { title: "Nova Tech Solutions", cat: "Technologie", desc: "Eine hochmoderne Unternehmenswebsite für ein KI-Softwareunternehmen." },
        p2: { title: "Lumina Beauty", cat: "Schönheitssalon", desc: "Minimalistische Landingpage für eine erstklassige Ästhetikklinik." },
        p3: { title: "Velocity Rentals", cat: "Autovermietung", desc: "Hochleistungs-Plattform für Luxusmietwagen mit dynamischer Verfügbarkeit." },
        p4: { title: "Gastronomy Lab", cat: "Restaurant", desc: "Immersive Website für Restaurants mit Online-Reservierung und Menüpräsentation." },
        p5: { title: "Justice Partners", cat: "Anwaltskanzlei", desc: "Vertrauenerweckende digitale Präsenz für eine erstklassige Kanzlei." },
        p6: { title: "Vanguard Fitness", cat: "Fitness", desc: "Moderne Fitnessplattform mit Mitgliederportalen und Kursplanung." },
        p7: { title: "Horizon Estates", cat: "Immobilien", desc: "Exklusives Immobilienportal mit VR-Touren und erweiterten Filtern." },
        p8: { title: "Drip Commerce", cat: "E-Commerce", desc: "Next-Gen Streetwear-Store mit Hochleistungs-Checkout-Systemen." },
        p9: { title: "Aura Photography", cat: "Portfolio", desc: "Kinematografische Galerie für professionelle Geschichtenerzähler." },
        p10: { title: "CareLink Medical", cat: "Gesundheitswesen", desc: "Sicheres Patientenmanagement und Terminbuchung für Kliniken." },
        p11: { title: "Elite Watch Co.", cat: "Luxus E-Commerce", desc: "High-End Zeitmesser-Katalog mit sicheren Zahlungen." },
        p12: { title: "Vivid Architecture", cat: "Architektur", desc: "Minimalistisches Portfolio mit Fokus auf Stadtplanung." },
        p13: { title: "Mastery LMS", cat: "Bildung", desc: "Skalierbares LMS mit interaktiven Kursen und Zertifizierung." },
        p14: { title: "Wanderlust Travels", cat: "Reisen & Tourismus", desc: "Full-Service-Reiseplattform für authentische Erlebnisse." },
        p15: { title: "Zen Wellness", cat: "Spa & Wellness", desc: "Serenes digitales Erlebnis für ein Luxus-Meditations-Retreat." }
      },
      projectsPage: {
        build: "Build 2024.v1.0",
        authentic: "Authentisch",
        bespoke: {
          title: "Gestalten Sie Ihre einzigartige Identität",
          subtitle: "Wir verbinden High-End-Ästhetik mit maßgeschneidertem, KI-beschleunigtem Engineering. Hören Sie auf zu folgen – führen Sie mit einer Plattform an, die für Ihre Signatur-Identität entwickelt wurde.",
          cta: "Starten Sie Ihr Projekt",
          secondary: "Entdecken Sie unseren Prozess",
          engineeringBadge: "Signature Engineering",
          feature1Label: "Strategie-Gespräch",
          feature1Desc: "1-zu-1 Entdeckung",
          feature2Label: "Zero-Copy-Code",
          feature2Desc: "100% Einzigartig",
          feature3Label: "Schnelles Deployment",
          feature3Desc: "Beschleunigte Entwicklung",
          feature4Label: "Premium-Kunst",
          feature4Desc: "Individuelles Design"
        },
        customServices: {
          badge: "Signature Architecture",
          title: "Geschwindigkeit & Qualität,",
          titleAccent: "Gleichzeitig.",
          desc1: "Vergessen Sie Vorlagen und generische Builder. Wir verwandeln die Geschichte Ihrer Marke in ein digitales Meisterwerk, das von absolut Null an entwickelt wurde. Jedes Pixel und jede Zeile Code wird exklusiv für Sie handgeschrieben.",
          desc2: "Befreit von restriktiven Tools bauen wir ein digitales Universum mit der Geschwindigkeit und Einzigartigkeit, die Ihre Vision erfordert. Es ist mehr als eine Website; es ist Ihre digitale Signatur.",
          stat1Title: "Architektonische Singularität",
          stat2Title: "Logik-Transparenz",
          perfMatrix: "Leistungsmatrix",
          stability: "Stabilität",
          integrity: "Integrität",
          creedBadge: "Das Signatur-Credo",
          creedTitle: "Jede Marke verdient eine digitale Seele.",
          creedDesc: "Wir verwandeln Komplexität in Eleganz und Geschwindigkeit in einen Wettbewerbsvorteil.",
          trusted: "Weltweit von visionären Führungskräften geschätzt",
          features: {
            f1Title: "Absolute Unabhängigkeit",
            f1Desc: "Wir lösen uns von Standard-Buildern. Ihre digitale Identität wird auf einer leeren Leinwand erstellt.",
            f2Title: "Enterprise-Logik",
            f2Desc: "Basierend auf modernem React und KI-beschleunigten Workflows ist die Architektur skalierbar und sicher.",
            f3Title: "Kinetische Ästhetik",
            f3Desc: "Statische Seiten sind tot. Wir integrieren flüssige Mikrointeraktionen und WebGL-Elemente.",
            f4Title: "Optimierung",
            f4Desc: "Geschwindigkeit ist Luxus. Durch sauberen Code eliminieren wir Ballast für maximale SEO-Performance.",
            status: "Protokoll-Status: Aktiv"
          },
          whyUs: "Warum wir?",
          difference: "Digital Atelier Unterschied",
          criteria: "Kriterium",
          erpolartBespoke: "ErpolArt Signatur",
          standardWeb: "Standard Web",
          readyTool: "Fertiges Werkzeug",
          handmadeCode: "Handgefertigter Code",
          comparison: {
            archTitle: "Architektur",
            archBespoke: "Signatur Architektur",
            archTemplate: "Fertige Vorlagen",
            singTitle: "Singularität",
            singBespoke: "Einzigartig auf der Welt (1/1)",
            singTemplate: "Tausende Kopien",
            perfTitle: "Leistung",
            perfBespoke: "Rücksichtslose Optimierung",
            perfTemplate: "Unnötiger Code-Ballast",
            seoTitle: "SEO & Google",
            seoBespoke: "Nativ kompatibel",
            seoTemplate: "Abhängig von Plugins",
            ctrlTitle: "Kontrolle",
            ctrlBespoke: "100% Freiheit",
            ctrlTemplate: "Begrenzte Tools"
          }
        },
        processTimeline: {
          title: "Signatur Engineering Zyklus",
          subtitle: "Unser Framework verwandelt Konzepte in Rekordzeit in erstklassige Live-Deployments.",
          phase: "Phase",
          steps: {
            s1Title: "Blueprint",
            s1Desc: "Wir analysieren Ihre Marken-DNA und Ziele für eine skalierbare Strategie.",
            s2Title: "Identitäts-Konzeption",
            s2Desc: "In 48 Stunden präsentieren wir eine Design-Trajektorie, die Ihre Ästhetik neu definiert.",
            s3Title: "Präzision",
            s3Desc: "Zwei Verfeinerungszyklen stellen sicher, dass die Architektur perfekt zu Ihrer Vision passt.",
            s4Title: "KI-Engineering",
            s4Desc: "Wir übersetzen den Blueprint in ein Hochleistungs-React-Ökosystem.",
            s5Title: "Deployment",
            s5Desc: "Nahtloser Start auf Elite-Infrastrukturen mit vollständiger Eigentumsübertragung."
          }
        },
        projectShowcase: {
          title: "Signatur",
          titleAccent: "Deployments",
          subtitle: "Eine Auswahl von Architekturen, die von Grund auf neu entwickelt wurden. Das sind keine Websites, sondern digitale Wettbewerbsvorteile.",
          live: "Live-Plattform",
          customEngine: "Custom Engine",
          liveView: "Live-Ansicht",
          arch1: "Makellose Core-Architektur",
          arch2: "KI-Integration",
          arch3: "Einzigartige Identität",
          studyCase: "Fallstudie",
          archives: "Archive"
        },
        form: {
          titlePart1: "Starten Sie",
          titlePart2: "Entdeckung",
          subtitle: "Teilen Sie Ihre Vision und lassen Sie uns Ihren einzigartigen digitalen Pfad bauen."
        },
        promise: {
          badge: "DESIGN VON MORGEN",
          title: "Präsentieren Sie Ihre Vision.",
          desc: "Unser Ziel bei dem für Sie gestalteten Webdesign-Prozess ist es, dass Sie eine digitale Plattform erhalten, die Sie jeden Moment gerne nutzen.",
          others: "Reihen Sie sich unter andere visionäre Marken ein."
        },
        quoteSection: {
          badge: "ANGEBOT ANFORDERN",
          title: "Lass uns etwas aufbauen.",
          subtitle: "Erzählen Sie uns von Ihrem Projekt. Wir melden uns innerhalb von 24 Stunden mit einem maßgeschneiderten Angebot."
        },
        manifesto: {
          badge: "DESIGN-PHILOSOPHIE",
          title: "Unsere Prinzipien.",
          p1Title: "Jedes Pixel dient einem Zweck.",
          p1Desc: "Kein dekorativer Lärm. Jedes visuelle Element leitet den Besucher zur nächsten Aktion.",
          p2Title: "Geschwindigkeit ist kein Feature, sie ist das Fundament.",
          p2Desc: "Eine Seite, die 3 Sekunden braucht, verliert Besucher. Performance ist von Anfang an ins Design eingebettet.",
          p3Title: "Mobile zuerst, Desktop immer.",
          p3Desc: "Die meisten Besucher kommen auf Mobilgeräten. Perfekt auf Mobilgeräten bedeutet makellos überall.",
          p4Title: "Keine Kopien. Nur Ihre Signatur.",
          p4Desc: "Wir geben denselben Code nie an zwei Marken. Jedes Projekt ist die digitale DNA einer einzigen Identität.",
          purposeVisual: "Zweckorientiertes Design",
          speedVisual: "Ladezeit",
          mobileVisual: "Bildschirmgröße",
          uniqueVisual: "Ihre Signatur"
        }
      },
      templatesData: {
        t1: { title: "Aura Spa & Wellness", cat: "Beauty & Wellness", desc: "Ein ruhiges ve luxuriöses digitales Erlebnis, entwickelt für High-End-Spa- und Wellnesszentren.", long: "Aura ist eine komplette digitale Lösung für Wellness-Unternehmen. Sie konzentriert sich auf Ruhe und Konversion mit integrierten Servicemenüs, Mitarbeiterprofilen und einem nahtlosen Terminbuchungssystem." },
        t2: { title: "Lex Corporate", cat: "Anwaltskanzlei", desc: "Sophistizierte und vertrauenerweckende digitale Präsenz für Rechtsberatungsfirmen.", long: "Lex bietet einen professionellen Vorsprung für Anwaltspraxen. Es enthält spezielle Bereiche für Praxisbereiche, Biografien von Anwälten und Fallstudien." },
        t3: { title: "Steak & Vine", cat: "Restaurant", desc: "Immersive kulinarische Präsentation mit interaktiven Menüs und Reservierungslogik.", long: "Entwickelt für gehobene Gastronomiebetriebe, fängt Steak & Vine die Essenz der Gastfreundschaft ein. Es bietet ein beeindruckendes Vollbildmenü und optimierte Standortkarten." },
        t4: { title: "Nomad Rentals", cat: "Autovermietung", desc: "Hochleistungs-Plattform für Luxusmietwagen mit dynamischem Inventar.", long: "Nomad ist für Geschwindigkeit und Luxus gebaut. Es umfasst ein robustes Filtersystem für Fahrzeugtypen und automatisierte Preisrechner." },
        t5: { title: "Neon Creative", cat: "Portfolio", desc: "Mutiges und avantgardistisches Portfolio für visuelle Geschichtenerzähler und Agenturen.", long: "Neon bricht mit traditionellen Portfolio-Mustern. Mit experimenteller Navigation und speziellen Cursor-Effekten ist es das ultimative Werkzeug für Kreative." },
        t6: { title: "Horizon Estates", cat: "Unternehmen", desc: "Saubere, moderne Corporate-Landingpage für Startups und Scale-ups.", long: "Horizon ist auf maximale Klarheit und Professionalität ausgelegt. Es bietet skalierbare Serviceblöcke und Wirkungsstatistiken." },
        t7: { title: "Vanguard Fitness", cat: "Fitness & Gesundheit", desc: "Energiereiche Fitnessplattform mit Mitgliederportalen und Kursplanung.", long: "Vanguard ist für pulsierende Leistung gebaut. Es umfasst dynamische Zeitplan-Builder, Trainer-Biografien und integrierte Trainingstagebücher." },
        t8: { title: "Drip Commerce", cat: "E-Commerce", desc: "Next-Gen-Streetwear-Store mit Hochleistungs-Checkout-Systemen.", long: "Drip ist die ultimative E-Commerce-Engine. Es bietet einen superschnellen Produktentdeckungsprozess, dynamische Lagerverwaltung und optimierte Checkouts." },
        t9: { title: "Vela Horizon Immobilien", cat: "realestate", desc: "Elite-Immobilienarchitektur für luxuriöses Immobilienmanagement und globale Kundenakquise.", long: "Vela Horizon ist das ultimative digitale Asset für Luxusimmobilienagenturen. Es bietet High-Fidelity-Immobilien-Galerien, regional basierte Kategorisierung (Istanbul, Bodrum, Antalya) und ein anspruchsvolles mehrsprachiges Anfragesystem. Entwickelt für Leistung und Exklusivität." }
      },
      templateDetail: {
        liveDemo: "Live-Demo",
        backToCatalog: "Zurück zum Katalog",
        acquisitionValue: "Erwerbswert",
        readyIn24H: "In 24H bereit",
        exclusiveIP: "Exklusives IP-Schloss",
        archOverview: "Architektur-Übersicht",
        dominancePart1: "Entwickelt für",
        dominancePart2: "absolute Dominanz.",
        techStack: "Technologie-Stack",
        integratedCaps: "Integrierte Fähigkeiten",
        responsive: "Responsiv",
        mobileFirst: "Mobile-First",
        architecture: "Architektur",
        componentBase: "Komponenten-Basiert",
        interactions: "Interaktionen",
        smooth: "Flüssig",
        coreViews: "Kern-Ansichten",
        seoStrategy: "SEO-Strategie",
        gradeAOptimized: "A-Klasse Optimiert",
        fastDelivery: "Schnelle Lieferung",
        architecting: "Wird erstellt...",
        structureNotFound: "Struktur nicht gefunden",
        features: {
          "Professional Service Showcase": "Professionelle Leistungspräsentation",
          "Smart Media & Image Gallery": "Intelligente Medien- und Bildergalerie",
          "Advanced Admin Control Panel": "Erweitertes Admin-Kontrollzentrum",
          "Blog & Content Manager": "Blog- und Inhaltsmanager",
          "Online Booking & Appointment": "Online-Buchung & Termine",
          "Smart Lead & Contact Forms": "Intelligente Kontaktformulare",
          "Auto Dark & Light Mode": "Auto Dark & Light Modus",
          "Multi-language Support": "Mehrsprachige Unterstützung",
          "Full Google SEO Optimization": "Vollständige Google SEO Optimierung",
          "Ultra-Fast Speed & Performance": "Ultraschnelle Performance",
          "Premium Animations & UI": "Premium Animationen & UI",
          "Data Protection & Secure SSL": "Datenschutz & Sicheres SSL",
          "One-Page Architecture": "One-Page-Architektur"
        }
      },
      checkout: {
        pciDssHint: "PCI-DSS Level 1 Verschlüsseltes Terminal",
        backToDetails: "Zurück zu Details",
        breadcrumb: "Kasse",
        title: "Erwerb",
        titleAccent: "Abschließen",
        subtitle: "Sichern Sie Ihre geistigen Eigentumsrechte. Sobald die Transaktion verifiziert ist, erhalten Sie sofortigen Zugriff auf das Deployment-Repository und die Designdateien.",
        billingTitle: "Rechnungsinformationen",
        firstName: "Vorname",
        lastName: "Nachname",
        email: "E-Mail-Adresse",
        emailLabel: "E-Mail-Adresse (für die Lieferung)",
        phoneLabel: "Telefonnummer",
        addressLabel: "Rechnungsadresse",
        taxIdLabel: "TC-Identität / Steuer-ID (optional)",
        paymentTitle: "Zahlungsprotokoll",
        bankTransfer: "Banküberweisung / EFT",
        transferDetails: "Banküberweisung Details",
        cardPayment: "Kredit-/Debitkarte",
        cardPaymentDesc: "Iyzico Sichere Zahlungsinfrastruktur",
        securePaymentNote: "Ihre Zahlung wird sicher über die Iyzico 3D Secure Infrastruktur verarbeitet.",
        paymentReceived: "ZAHLUNG ERFOLGREICH",
        securePaymentComplete: "SICHERE ZAHLUNG ABGESCHLOSSEN",
        iban: "IBAN",
        accountHolder: "Kontoinhaber",
        referenceDesc: "Bestellreferenz",
        activationNote: "Ihr System wird automatisch aktiviert, sobald die Zahlung bestätigt wurde.",
        orderIdLabel: "Bestellreferenznummer",
        copyReference: "Code kopieren",
        orderSummary: "Bestellübersicht",
        encrypted: "Ende-zu-Ende verschlüsselt",
        license: "Lizenz",
        digitalArch: "Digitale Architektur",
        fee: "Lizenzgebühr",
        ipTransfer: "IP-Schutz & Übertragung",
        included: "Inbegriffen",
        taxes: "Steuern",
        taxCalc: "Wird im nächsten Schritt berechnet",
        total: "Gesamtbetrag",
        perks: {
          codes: "Vollständiger Quellcode-Lieferung",
          rights: "Lebenslange nicht-exklusive Rechte",
          download: "Sofortiger Download-Zugriff"
        },
        authorize: "Zahlung autorisieren",
        payCrypto: "Mit Coinbase Wallet bezahlen",
        ssl: "SSL-gesicherte Transaktion",
        addons: {
          chatbot: { name: "KI-Chatbot Integration", desc: "Speziell geschulter KI-Assistent" },
          language: { name: "Mehrsprachigkeitsmodul", desc: "Globale i18n-Infrastruktur" },
          crm: { name: "CRM-Lead-Integration", desc: "Automatisierte Kundenverfolgung" },
          seo: { name: "Erweiterte SEO-Optimierung", desc: "Dominanz in Suchmaschinen" }
        },
        platinumArch: "Platin-Architektur",
        premiumArch: "Premium-Architektur",
        establishingConnection: "Verbindung wird hergestellt...",
        protocolError: "PROTOKOLLFEHLER",
        returnToCatalog: "Zurück zum Katalog",
        protocolRestriction: "Protokollbeschränkung",
        secureGateway: "Sicheres Gateway",
        selectedArchitecture: "Ausgewählte Architektur",
        customSaaSArchitecture: "Spezielle SaaS-Architektur",
        revisionsIncluded: "5 Revisionen inklusive",
        clientLabel: "Kunde:",
        maintenanceTitle: "Monatliche Systemverwaltung",
        noCommitment: "Keine Verpflichtung",
        maintenanceDesc: "Serveroptimierung und technischer Support. Keine Bindung, jederzeit kündbar.",
        systemContinuity: "Systemkontinuität",
        monthlyMaintenance: "Monatliche Wartung",
        cancelAnytime: "Jederzeit kündbar",
        extraServices: "Zusatzleistungen",
        oneTime: "Einmalig",
        pricePolicyDesc: "Dieser Betrag deckt die einmalige Systemeinrichtung, den Architekturaufbau und die Kosten für die Integration von Premium-Modulen ab.",
        acquisitionProtocol: "Erwerbsprotokoll",
        completePayment: "Zahlung abschließen",
        oneTimeInvestment: "Einmalige Investition",
        maintenanceLabel: "Monatl.",
        secureTerminal: "Sicheres Terminal",
        encryptionHint: "Ende-zu-Ende verschlüsselt",
        protocolSecured: "Protokoll gesichert",
        authSuccessDesc: "Autorisierung erfolgreich. Wir bereiten Ihr System vor.",
        finalizingNode: "Knoten wird finalisiert...",
        emailLocked: "Von Ihrem Konto verifiziert",
        transferAmount: "Überweisungsbetrag",
        orderCreatedDesc: "Schließen Sie die Überweisung ab, um Ihr System zu aktivieren",
        referenceHint: "Fügen Sie diesen Code in den Überweisungszweck ein, damit wir Ihr System schnell aktivieren können.",
        fillBrandDetails: "Markendetails jetzt ausfüllen",
        goToDashboard: "Zum Dashboard"
      },
      contact: {
        title: "Lassen Sie uns Ihre Vision gestalten",
        titlePart1: "Teilen Sie Ihre",
        titleAccent: "Vision.",
        subtitle: "Unser Ziel bei dem für Sie gestalteten Webdesign-Prozess ist es, eine digitale Plattform zu bauen, die Sie jeden Moment gerne nutzen, genau wie andere visionäre Marken.",
        directLabel: "DIREKTER KONTAKT / E-MAIL",
        fullName: "Ihr Name",
        email: "E-Mail Adresse",
        service: "Dienstleistungstyp",
        budget: "Geschätztes Budget",
        description: "Projektbeschreibung",
        descPlaceholder: "Beschreiben Sie kurz Ihre Vision, Ziele und spezifischen Anforderungen...",
        launch: "Projekt starten",
        launching: "INITIALISIERUNG...",
        timelineLabel: "Zielzeitplan",
        timelineOptions: {
          t1: "1-2 Wochen",
          t2: "1 Monat",
          t3: "3 Monate+",
          t4: "Flexibel"
        },
        services: {
          branding: "Bespoke Webdesign",
          ai: "SaaS Entwicklung",
          automation: "KI-Automatisierung",
          ecommerce: "Luxus E-Commerce",
          enterprise: "Unternehmensplattform"
        },
        success: {
          title: "Signal empfangen.",
          message: "Ihre Projektdaten wurden sicher übertragen. Unser Team wird Ihre Vision prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.",
          emailNote: "Das Angebot und die Projektdetails werden gesendet an:",
          cta: "Anderes Signal senden"
        }
      },
      customerDashboard: {
        stats: {
          purchasedAssets: "ERWORBENE ASSETS",
          activeSystems: "AKTIVE SYSTEME",
          protocolStatus: "PROTOKOLLSTATUS",
          verified: "VERIFIZIERT"
        },
        sections: {
          assets: "MEINE DIGITALEN ASSETS / GEKAUFTE PROJEKTE",
          shortcuts: "SYSTEM-VERKNÜPFUNGEN"
        },
        status: {
          active: "AKTIVES SYSTEM",
          revision: "REVISION AUSSTEHEND",
          development: "IN ENTWICKLUNG",
          processing: "VERARBEITUNG",
          pending: "WARTET AUF ZAHLUNG"
        },
        empty: {
          desc: "Noch keine Assets erworben. Sind Sie bereit, Ihr erstes Projekt zu starten?",
          cta: "ARCHITEKTUR ERKUNDEN"
        },
        noAssets: "Noch keine Assets erworben.",
        exploreArchitecture: "ARCHITEKTUR ERKUNDEN",
        investmentValue: "Investitionswert",
        paid: "BEZAHLT",
        nodeIdentityActive: "KNOTEN-IDENTITÄT: AKTIV",
        premiumDigitalAsset: "Premium Digitales Asset",
        actions: {
          explore: { title: "Architektur erkunden", desc: "Durchsuchen Sie unsere Premium-Vorlagensammlung" },
          identity: { title: "Identitätseinstellungen", desc: "Aktualisieren Sie Ihr Profil und Ihre Präferenzen" },
          support: { title: "Technischer Support", desc: "Verbinden Sie sich mit unserem Architektur-Team" }
        }
      },

      proposalPage: {
        loading: "Protokoll wird entschlüsselt...",
        notFound: "Angebot nicht gefunden oder möglicherweise abgelaufen.",
        returnHome: "Zur Startseite",
        badge: "INDIVIDUELLES PROJEKTANGEBOT",
        clientLabel: "KUNDE",
        verified: "Verifiziertes B2B-Protokoll",
        issued: "Ausgestellt am",
        tierPremium: "PREMIUM PROFESSIONAL",
        tierPlatinum: "PLATINUM ELITE",
        saasTitle: "Individuelle SaaS-Architektur",
        saasTitleAccent: "Angebot",
        autoTitle: "KI-Automatisierungssystem",
        autoTitleAccent: "Angebot",
        techStack: "Technologie-Stack",
        modules: "Kernmodule",
        notes: "Projektnotizen",
        included: "Im Angebot enthalten",
        includedItems: [
          { title: "Quellcode-Übergabe", desc: "Vollständiger Quellcode via GitHub mit vollständiger Historie." },
          { title: "Produktions-Deployment", desc: "Live-Umgebung Setup und Deployment-Support inklusive." },
          { title: "Technische Dokumentation", desc: "API-Referenzen und Architekturdokumentation werden erstellt." },
          { title: "Revisionsrechte", desc: "{n} Revisionsrunden sind im Projektumfang enthalten." },
          { title: "Support nach Lieferung", desc: "30 Tage technischer Support nach der Übergabe." },
          { title: "Wöchentliche Sync-Calls", desc: "Fortschrittsgespräche während der Entwicklungsphase." }
        ],
        nextSteps: "Nächste Schritte",
        steps: [
          { num: "01", title: "Zahlung", desc: "Bestätigen Sie das Projekt und schließen Sie die erste Zahlung ab." },
          { num: "02", title: "Kickoff", desc: "Detailliertes Briefing-Meeting und Projektplanerstellung." },
          { num: "03", title: "Entwicklung", desc: "Projekt wird mit dem vereinbarten Technologie-Stack umgesetzt." },
          { num: "04", title: "Lieferung", desc: "Getestetes und dokumentiertes Projekt wird übergeben." }
        ],
        investment: "Investitionsübersicht",
        fixedFee: "Feste Implementierungsgebühr",
        timelineLabel: "Lieferzeit",
        revisionsLabel: "Revisionsrechte",
        cta: "PROJEKT BESTÄTIGEN & ZAHLUNG",
        secure: "SICHERES ZAHLUNGSPROTOKOLL",
        encryption: "Ende-zu-Ende-Verschlüsselung",
        questionLabel: "Haben Sie Fragen?",
        questionLink: "Kontaktieren Sie uns",
        revisionTitle: "Änderung oder Ergänzung anfordern",
        revisionSubtitle: "Möchten Sie etwas hinzufügen oder den Umfang ändern? Teilen Sie es uns mit.",
        revisionPlaceholder: "Beschreiben Sie die gewünschte Änderung oder Ergänzung...",
        revisionCta: "Anfrage senden",
        revisionSent: "Ihre Anfrage wurde erhalten. Wir werden das Angebot in Kürze aktualisieren."
      },

    }
  }
};

const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;