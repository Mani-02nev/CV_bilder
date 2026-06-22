export interface ProductInfo {
  title: string
  tagline: string
  description: string
  keywords: string[]
  essay: string[]
  benefits: string[]
  steps: { title: string; desc: string }[]
  faqs: { q: string; a: string }[]
  comparison: { feature: string; ksVal: string; typicalVal: string }[]
}

export const productData: Record<string, ProductInfo> = {
  "resume-builder": {
    title: "AI Resume Builder",
    tagline: "Build a High-Impact, Recruiter-Approved Resume in Under 5 Minutes",
    description: "Create professional, ATS-compatible resumes tailored to your target job applications using our advanced generative AI engine. Zero formatting hassles, maximum recruiter response rates.",
    keywords: ["AI Resume Builder", "best AI resume builder", "resume generator", "free resume builder", "CV builder online", "professional resume creator"],
    essay: [
      "The modern hiring funnel is governed by digital gatekeepers. Over 98% of Fortune 500 companies deploy Applicant Tracking Systems (ATS) to filter, rank, and store candidate profiles. In a typical hiring round, a single vacancy attracts hundreds of applications, yet only a tiny fraction are ever reviewed by a human recruiter. Standard builders focus entirely on visual presentation, ignoring the structured semantic parsing that automated screeners rely upon. The KS AI Resume Builder solves this architectural challenge, bridging the gap between design excellence and machine readability.",
      "At the core of our builder is a generative semantic alignment engine. Instead of simply requesting text inputs, our tool maps your work history against specific industry ontologies and machine-learning models. It automatically analyzes your target job description, identifying core competencies, technical skills, and key certifications that recruiter search queries look for. The AI prompts you to input missing metrics, converting passive descriptions like 'responsible for team management' into high-impact accomplishments like 'Led a cross-functional team of 6 engineers to launch a microservices pipeline, reducing deployment latency by 40%'.",
      "Formatting is another critical friction point. Resumes designed in graphic layout editors often fail parsing tests because text is locked in double-column tables, SVG elements, or sidebars that standard crawlers read out of order. The KS Resume Builder constructs valid, single-column HTML schemas, which are then compiled directly into crisp vector PDFs. Margins, line spacing, font sizes, and layout borders are calculated dynamically according to executive design guidelines. This ensures your resume remains visually stunning to the human eye while compiling into clean text blocks for the machine parser.",
      "Furthermore, data privacy remains a fundamental pillar of our architecture. Most free resume utilities monetize candidate data by selling profiles directly to third-party marketing databases or unverified talent agencies. The MR K AI Ecosystem guarantees strict client privacy. All personal identifiers, contact details, and career histories are encrypted at rest. Users maintain absolute ownership of their career records. You can download, wipe, or modify your profile vaults instantly, ensuring compliance with global data protection guidelines (GDPR, CCPA)."
    ],
    benefits: [
      "Automated Semantic Keyword Alignment",
      "100% Vector PDF Crawlability Score",
      "Quantifiable Metric suggestions",
      "Unified Dark/Light Interactive Interface"
    ],
    steps: [
      { title: "Import Profile", desc: "Paste your existing resume details or connect your LinkedIn profile data." },
      { title: "Align target Role", desc: "Input the job description or target title to scan for key structural competencies." },
      { title: "Generate & Download", desc: "Review AI-aligned bullet points, select templates, and export vector PDFs instantly." }
    ],
    faqs: [
      { q: "Is the generated resume readable by standard ATS systems?", a: "Yes. We test our PDF outputs against the top three parsing configurations (Greenhouse, Workday, Taleo) to guarantee a 100% text recognition and section parsing rate." },
      { q: "Can I customize the templates?", a: "Absolutely. You can toggle between modern, executive, and tech-professional templates instantly without losing any text inputs." },
      { q: "Does the builder support metrics generation?", a: "Yes, our AI analysis prompts you to input percentages, user metrics, or currency savings, structuring them as active accomplishments." }
    ],
    comparison: [
      { feature: "Crawlability Index", ksVal: "100% Vector parsing", typicalVal: "Fragmented block reads" },
      { feature: "AI Bullet Optimization", ksVal: "Included (Context-aware)", typicalVal: "Static generic text" },
      { feature: "Structured Schema Export", ksVal: "JSON-LD integrated", typicalVal: "Not supported" }
    ]
  },
  "ats-checker": {
    title: "ATS Resume Checker",
    tagline: "Scan and Grade Your Resume Against Enterprise Recruiter Filters",
    description: "Scan your resume against specific target job descriptions to identify missing keywords, formatting errors, and parsing issues instantly.",
    keywords: ["ATS Resume Checker", "resume scanner", "resume keywords match", "ATS compatibility score", "resume validator"],
    essay: [
      "Applicant Tracking Systems do not read resumes like humans. They extract plain text, separate it into structured databases (Work Experience, Education, Skills), and score the profile based on keyword frequency and semantic matching. If your resume uses non-standard section titles or complex font tables, the ATS parser may discard your experience completely. The KS ATS Resume Checker simulates this exact parsing process, analyzing your resume before you submit it to potential employers.",
      "Our checker compares your CV against thousands of target job roles. It performs tokenization, parts-of-speech tagging, and entity extraction to identify exactly which core skills, methodologies, and platforms are present in your resume versus what the recruiter's search query requires. It flags missing technical terms, highlights formatting anomalies like overlapping text boxes, and warns you if your contact details are unreadable.",
      "By using our tool, you receive an actionable optimization checklist. This list categorizes edits into critical fixes (such as missing skills or broken date formats) and minor improvements (such as action verb density or layout alignment). By addressing these gaps, you ensure your application stands out in automated ranking systems, significantly increasing your chances of securing a human interview."
    ],
    benefits: [
      "Real-time keyword gap analysis",
      "Simulation of Workday and Greenhouse parsers",
      "Actionable structural error flagging",
      "Formatting compliance checks"
    ],
    steps: [
      { title: "Upload Resume", desc: "Drop your existing PDF or DOCX file into the scanner vault." },
      { title: "Specify Target Job", desc: "Paste the job description or enter the title of your target position." },
      { title: "Review Optimization Report", desc: "Inspect the keyword matches, formatting warnings, and score report." }
    ],
    faqs: [
      { q: "How long does the scan take?", a: "The analysis is completed in under 10 seconds, providing immediate feedback." },
      { q: "Does it save my resume?", a: "Resumes uploaded to the checker are scanned in-memory and are not stored unless you save them to your account." },
      { q: "What is a passing ATS score?", a: "We recommend aiming for an ATS compatibility score of 80% or higher before applying." }
    ],
    comparison: [
      { feature: "Scan Depth", ksVal: "Semantic matching & formatting check", typicalVal: "Simple keyword counts" },
      { feature: "Parser Simulation", ksVal: "Multiple ATS engine configurations", typicalVal: "Single generic text read" },
      { feature: "Actionable Checklist", ksVal: "Step-by-step editing instructions", typicalVal: "Vague quality score" }
    ]
  },
  "resume-score": {
    title: "Resume Score Checker",
    tagline: "Receive a Detailed Recruiter-Grade Evaluation of Your Resume",
    description: "Get an immediate score grading your resume layout, word choice, metrics density, and structural layout compatibility.",
    keywords: ["Resume Score Checker", "resume grade", "free resume review", "resume quality report", "CV scoring online"],
    essay: [
      "A high-quality resume must balance machine readability with human impact. Even if a resume passes the ATS gate, it must immediately capture the attention of a human recruiter, who typically spends less than six seconds reviewing a CV. The KS Resume Score Checker analyzes your resume across four core metrics: structure, content impact, layout styling, and semantic keywords, giving you a comprehensive recruiter-grade evaluation.",
      "The grading algorithm scores your use of metrics and impact-oriented achievements, checking for passive phrasing or empty corporate buzzwords (like 'hard-working self-starter'). It evaluates the visual layout, assessing margin balance, column structures, and font hierarchies to ensure it is clean and professional. The result is a quantitative score out of 100, broken down by section.",
      "With this detailed breakdown, you can identify exactly which parts of your resume are pulling down your score. Whether it is weak bullet points, poor formatting, or a lack of quantifiable achievements, our tool provides clear guidelines on how to improve each section to maximize impact."
    ],
    benefits: [
      "Quantitative scoring out of 100",
      "Breakdown of visual layout and margins",
      "Identification of weak or passive phrasing",
      "Actionable section grading reports"
    ],
    steps: [
      { title: "Input Content", desc: "Enter your resume details or upload your current PDF profile." },
      { title: "Run Analyzer", desc: "Let our scoring engine assess your structure, language, and styling." },
      { title: "Optimize Sections", desc: "Apply the recommended updates to raise your score to the elite 90+ range." }
    ],
    faqs: [
      { q: "Is the score free?", a: "Yes, you can check your resume score and get a basic report for free." },
      { q: "What metrics are used to calculate the score?", a: "We evaluate keyword relevance, formatting consistency, metric density, and language clarity." },
      { q: "How can I raise my score?", a: "Follow the checklist recommendations, replacing passive descriptions with active accomplishments and adding key terms." }
    ],
    comparison: [
      { feature: "Scoring Metric", ksVal: "Recruiter-grade behavioral scoring", typicalVal: "Basic keyword density" },
      { feature: "Layout Checks", ksVal: "Margin, font, and spacing check", typicalVal: "None" },
      { feature: "Update Guidance", ksVal: "Instant AI rewrite suggestions", typicalVal: "Static tips" }
    ]
  },
  "resume-analyzer": {
    title: "Resume Analyzer",
    tagline: "Deep Diagnostic Analysis of Your Professional Profile",
    description: "Deep dive into your resume syntax, alignment, formatting inconsistencies, and readability indexes to polish it to executive quality.",
    keywords: ["Resume Analyzer", "CV analyzer", "resume feedback", "resume optimization tips", "professional profile analysis"],
    essay: [
      "Many professional resumes contain hidden flaws that candidates overlook. These include inconsistent bullet points, uneven margins, improper date layouts, and poor formatting choices. The KS Resume Analyzer offers a deep diagnostic scan of your resume text and formatting parameters to ensure your profile is polished to executive standards.",
      "The analyzer runs a series of diagnostic tests, checking your text against standard readability formulas (like the Flesch-Kincaid index) to ensure your writing is clear and concise. It checks formatting consistency across every section, flagging variations in font size, spacing, or date formats.",
      "By highlighting formatting errors and readability bottlenecks, the analyzer helps you present a clean, consistent, and professional profile that instantly conveys high standards to recruiters."
    ],
    benefits: [
      "Detailed visual layout audit",
      "Inconsistent format flagging",
      "Readability and syntax checks",
      "Comprehensive profile health reports"
    ],
    steps: [
      { title: "Upload Profile", desc: "Submit your resume file or profile layout to the analyzer." },
      { title: "Run Deep Analysis", desc: "Wait for the engine to check formatting parameters and syntax rules." },
      { title: "Polishing", desc: "Use the detailed feedback to resolve inconsistencies and export a clean PDF." }
    ],
    faqs: [
      { q: "How is this different from the score checker?", a: "The analyzer focus on deep syntax checks, visual margins, date styling, and font consistencies rather than just a high-level grade." },
      { q: "Does it support non-English resumes?", a: "Currently, our deep semantic analyzer is optimized for English-language profiles." },
      { q: "Can I run multiple scans?", a: "Yes, you can run as many diagnostic scans as needed to ensure your resume is fully optimized." }
    ],
    comparison: [
      { feature: "Diagnostic Depth", ksVal: "Detailed format and readability check", typicalVal: "High-level review" },
      { feature: "Formatting Auditing", ksVal: "Font, margins, and bullet check", typicalVal: "Not supported" },
      { feature: "Readability Scoring", ksVal: "Flesch-Kincaid scoring", typicalVal: "Basic length check" }
    ]
  },
  "resume-templates": {
    title: "Resume Templates",
    tagline: "Recruiter-Approved, High-Fidelity Design Layouts",
    description: "Browse and select from our curated selection of professional, ATS-optimized templates designed by executive hiring experts.",
    keywords: ["Resume Templates", "ATS resume templates", "professional CV templates", "modern resume layouts", "free resume formats"],
    essay: [
      "Design is the first impression your resume makes. A messy, over-designed, or poorly structured layout can lead recruiters to reject your application instantly. Our curated templates balance clean, modern design aesthetics with strict ATS parsing requirements.",
      "Every template in our library is built from the ground up to ensure complete compatibility with automated tracking systems. We avoid complex elements like tables or graphics that can confuse parsers, focusing instead on clean, single-column layouts with standard headings, professional fonts, and clear hierarchies.",
      "Whether you are an executive, a developer, or a designer, you will find a template that perfectly represents your career story, ensuring your resume looks stunning on a screen and prints beautifully."
    ],
    benefits: [
      "ATS-tested single-column designs",
      "Crisp vector font rendering",
      "Easy template swapping",
      "Optimized margins and spacing"
    ],
    steps: [
      { title: "Browse Designs", desc: "Select from our library of modern, executive, or technical templates." },
      { title: "Fill Details", desc: "Input your career history once; it will adapt automatically to any layout." },
      { title: "Download PDF", desc: "Download a high-resolution, vector PDF ready for applications." }
    ],
    faqs: [
      { q: "Are these templates ATS-friendly?", a: "Yes, every template is fully tested to ensure it is readable by automated tracking systems." },
      { q: "Can I swap templates later?", a: "Yes, you can switch templates with a single click without having to re-enter any of your information." },
      { q: "Do these templates support profile pictures?", a: "Our Pro plans offer templates with optional, professional profile picture slots." }
    ],
    comparison: [
      { feature: "ATS Compatibility", ksVal: "100% Tested and compliant", typicalVal: "Often unreadable" },
      { feature: "Design Aesthetics", ksVal: "Clean, professional, and modern", typicalVal: "Cluttered or generic" },
      { feature: "Data Portability", ksVal: "Instant swapping between layouts", typicalVal: "Requires manual layout fixes" }
    ]
  }
}

