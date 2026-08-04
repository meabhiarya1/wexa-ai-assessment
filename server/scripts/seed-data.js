export const teams = [
  { id: "team-platform", name: "Platform Engineering", focus: "Core services and developer experience" },
  { id: "team-data", name: "Data & ML", focus: "Analytics, machine learning, and experimentation" },
  { id: "team-design", name: "Product Design", focus: "Research, accessibility, and design systems" },
  { id: "team-growth", name: "Growth", focus: "Activation, onboarding, and revenue experiments" },
  { id: "team-security", name: "Security", focus: "Trust, identity, and incident response" },
  { id: "team-mobile", name: "Mobile", focus: "Native apps and mobile platform quality" }
];

export const skills = [
  { id: "skill-react", name: "React", category: "Frontend" },
  { id: "skill-node", name: "Node.js", category: "Backend" },
  { id: "skill-express", name: "Express", category: "Backend" },
  { id: "skill-cypher", name: "Cypher", category: "Graph" },
  { id: "skill-neo4j", name: "Neo4j Driver", category: "Graph" },
  { id: "skill-ux", name: "UX Research", category: "Design" },
  { id: "skill-accessibility", name: "Accessibility", category: "Design" },
  { id: "skill-design-systems", name: "Design Systems", category: "Design" },
  { id: "skill-sql", name: "SQL", category: "Data" },
  { id: "skill-python", name: "Python", category: "Data" },
  { id: "skill-mlops", name: "MLOps", category: "Machine Learning" },
  { id: "skill-recommendations", name: "Recommendations", category: "Machine Learning" },
  { id: "skill-ab-testing", name: "A/B Testing", category: "Product" },
  { id: "skill-product-analytics", name: "Product Analytics", category: "Product" },
  { id: "skill-roadmapping", name: "Roadmapping", category: "Product" },
  { id: "skill-kubernetes", name: "Kubernetes", category: "DevOps" },
  { id: "skill-terraform", name: "Terraform", category: "DevOps" },
  { id: "skill-observability", name: "Observability", category: "DevOps" },
  { id: "skill-threat-modeling", name: "Threat Modeling", category: "Security" },
  { id: "skill-iam", name: "IAM", category: "Security" },
  { id: "skill-incident-response", name: "Incident Response", category: "Security" },
  { id: "skill-ios", name: "iOS", category: "Mobile" },
  { id: "skill-android", name: "Android", category: "Mobile" },
  { id: "skill-react-native", name: "React Native", category: "Mobile" }
];

export const people = [
  {
    id: "person-aanya",
    name: "Aanya Mehta",
    title: "Staff Backend Engineer",
    email: "aanya.mehta@example.com",
    bio: "Builds resilient APIs, reviews architecture, and mentors backend engineers."
  },
  {
    id: "person-noah",
    name: "Noah Brooks",
    title: "Platform Engineer",
    email: "noah.brooks@example.com",
    bio: "Owns service reliability, internal tooling, and runtime observability."
  },
  {
    id: "person-maya",
    name: "Maya Chen",
    title: "Frontend Engineer",
    email: "maya.chen@example.com",
    bio: "Turns complex workflows into clear React interfaces."
  },
  {
    id: "person-luis",
    name: "Luis Ortega",
    title: "Data Scientist",
    email: "luis.ortega@example.com",
    bio: "Builds recommendation models and product insights for growth loops."
  },
  {
    id: "person-fatima",
    name: "Fatima Rahman",
    title: "ML Engineer",
    email: "fatima.rahman@example.com",
    bio: "Ships production ML systems and model monitoring workflows."
  },
  {
    id: "person-elena",
    name: "Elena Petrova",
    title: "Data Engineer",
    email: "elena.petrova@example.com",
    bio: "Designs data pipelines, warehouse models, and analytics infrastructure."
  },
  {
    id: "person-zoe",
    name: "Zoe Williams",
    title: "Product Designer",
    email: "zoe.williams@example.com",
    bio: "Creates accessible workflows grounded in user research."
  },
  {
    id: "person-omar",
    name: "Omar Haddad",
    title: "Design Systems Lead",
    email: "omar.haddad@example.com",
    bio: "Maintains reusable UI patterns and design tokens across product teams."
  },
  {
    id: "person-priya",
    name: "Priya Nair",
    title: "Growth Product Manager",
    email: "priya.nair@example.com",
    bio: "Prioritizes onboarding, activation, and experiment strategy."
  },
  {
    id: "person-ethan",
    name: "Ethan Miller",
    title: "Product Analyst",
    email: "ethan.miller@example.com",
    bio: "Finds product opportunities through funnels, cohorts, and experiments."
  },
  {
    id: "person-sara",
    name: "Sara Okafor",
    title: "Security Engineer",
    email: "sara.okafor@example.com",
    bio: "Leads threat modeling, identity reviews, and incident readiness."
  },
  {
    id: "person-jin",
    name: "Jin Park",
    title: "Infrastructure Security Engineer",
    email: "jin.park@example.com",
    bio: "Connects cloud infrastructure, IAM, and security automation."
  },
  {
    id: "person-camila",
    name: "Camila Silva",
    title: "iOS Engineer",
    email: "camila.silva@example.com",
    bio: "Builds high-quality native mobile experiences."
  },
  {
    id: "person-arin",
    name: "Arin Kapoor",
    title: "React Native Engineer",
    email: "arin.kapoor@example.com",
    bio: "Bridges web and mobile delivery with shared product architecture."
  },
  {
    id: "person-grace",
    name: "Grace Kim",
    title: "Engineering Manager",
    email: "grace.kim@example.com",
    bio: "Connects platform planning, team health, and cross-functional delivery."
  },
  {
    id: "person-ben",
    name: "Ben Thompson",
    title: "Backend Engineer",
    email: "ben.thompson@example.com",
    bio: "Builds Express services, graph queries, and API integrations."
  },
  {
    id: "person-iris",
    name: "Iris Mensah",
    title: "UX Researcher",
    email: "iris.mensah@example.com",
    bio: "Uncovers user friction and translates research into product direction."
  },
  {
    id: "person-kenji",
    name: "Kenji Sato",
    title: "DevOps Engineer",
    email: "kenji.sato@example.com",
    bio: "Automates deployments, infrastructure, and production recovery."
  }
];

export const projects = [
  {
    id: "project-orbit",
    name: "Orbit Onboarding",
    description: "A guided activation journey for new workspace admins.",
    status: "active"
  },
  {
    id: "project-compass",
    name: "Compass Recommendations",
    description: "Personalized next-best-action recommendations for customers.",
    status: "planning"
  },
  {
    id: "project-keystone",
    name: "Keystone Identity",
    description: "A safer identity and permission review workflow.",
    status: "active"
  },
  {
    id: "project-beacon",
    name: "Beacon Mobile",
    description: "Mobile notification and engagement improvements.",
    status: "active"
  },
  {
    id: "project-lattice",
    name: "Lattice Design System",
    description: "A shared interface foundation for faster product delivery.",
    status: "completed"
  },
  {
    id: "project-atlas",
    name: "Atlas Graph Explorer",
    description: "Internal graph exploration for support and operations teams.",
    status: "planning"
  },
  {
    id: "project-harbor",
    name: "Harbor Reliability",
    description: "Production observability, rollback, and incident workflows.",
    status: "active"
  },
  {
    id: "project-prism",
    name: "Prism Experimentation",
    description: "Self-serve experiment setup and readouts for product teams.",
    status: "active"
  }
];

export const memberOf = [
  ["person-aanya", "team-platform"],
  ["person-noah", "team-platform"],
  ["person-grace", "team-platform"],
  ["person-ben", "team-platform"],
  ["person-luis", "team-data"],
  ["person-fatima", "team-data"],
  ["person-elena", "team-data"],
  ["person-zoe", "team-design"],
  ["person-omar", "team-design"],
  ["person-iris", "team-design"],
  ["person-priya", "team-growth"],
  ["person-ethan", "team-growth"],
  ["person-sara", "team-security"],
  ["person-jin", "team-security"],
  ["person-camila", "team-mobile"],
  ["person-arin", "team-mobile"],
  ["person-maya", "team-growth"],
  ["person-kenji", "team-platform"]
].map(([personId, teamId]) => ({ personId, teamId }));

export const hasSkill = [
  ["person-aanya", "skill-node", 5, 8],
  ["person-aanya", "skill-express", 5, 6],
  ["person-aanya", "skill-cypher", 4, 3],
  ["person-aanya", "skill-neo4j", 4, 3],
  ["person-noah", "skill-kubernetes", 5, 7],
  ["person-noah", "skill-observability", 5, 6],
  ["person-noah", "skill-terraform", 4, 5],
  ["person-maya", "skill-react", 5, 5],
  ["person-maya", "skill-accessibility", 4, 3],
  ["person-maya", "skill-ab-testing", 3, 2],
  ["person-luis", "skill-python", 5, 7],
  ["person-luis", "skill-recommendations", 5, 4],
  ["person-luis", "skill-product-analytics", 4, 5],
  ["person-fatima", "skill-mlops", 5, 5],
  ["person-fatima", "skill-python", 5, 6],
  ["person-fatima", "skill-recommendations", 4, 3],
  ["person-elena", "skill-sql", 5, 8],
  ["person-elena", "skill-python", 4, 5],
  ["person-elena", "skill-observability", 3, 2],
  ["person-zoe", "skill-ux", 5, 7],
  ["person-zoe", "skill-accessibility", 5, 5],
  ["person-omar", "skill-design-systems", 5, 8],
  ["person-omar", "skill-accessibility", 4, 4],
  ["person-priya", "skill-roadmapping", 5, 7],
  ["person-priya", "skill-ab-testing", 4, 5],
  ["person-priya", "skill-product-analytics", 4, 4],
  ["person-ethan", "skill-sql", 5, 6],
  ["person-ethan", "skill-product-analytics", 5, 6],
  ["person-ethan", "skill-ab-testing", 5, 4],
  ["person-sara", "skill-threat-modeling", 5, 7],
  ["person-sara", "skill-iam", 5, 6],
  ["person-sara", "skill-incident-response", 4, 4],
  ["person-jin", "skill-iam", 5, 5],
  ["person-jin", "skill-terraform", 4, 4],
  ["person-jin", "skill-kubernetes", 4, 4],
  ["person-camila", "skill-ios", 5, 6],
  ["person-camila", "skill-accessibility", 3, 2],
  ["person-arin", "skill-react-native", 5, 5],
  ["person-arin", "skill-react", 4, 4],
  ["person-grace", "skill-roadmapping", 4, 7],
  ["person-grace", "skill-node", 4, 7],
  ["person-ben", "skill-node", 4, 4],
  ["person-ben", "skill-express", 4, 4],
  ["person-ben", "skill-cypher", 3, 2],
  ["person-iris", "skill-ux", 5, 6],
  ["person-iris", "skill-product-analytics", 3, 2],
  ["person-kenji", "skill-kubernetes", 4, 5],
  ["person-kenji", "skill-terraform", 5, 5],
  ["person-kenji", "skill-incident-response", 3, 3]
].map(([personId, skillId, level, years]) => ({ personId, skillId, level, years }));

export const ownedBy = [
  ["project-orbit", "team-growth"],
  ["project-compass", "team-data"],
  ["project-keystone", "team-security"],
  ["project-beacon", "team-mobile"],
  ["project-lattice", "team-design"],
  ["project-atlas", "team-platform"],
  ["project-harbor", "team-platform"],
  ["project-prism", "team-growth"]
].map(([projectId, teamId]) => ({ projectId, teamId }));

export const requiresSkill = [
  ["project-orbit", "skill-react", "must-have"],
  ["project-orbit", "skill-ab-testing", "must-have"],
  ["project-orbit", "skill-ux", "nice-to-have"],
  ["project-orbit", "skill-product-analytics", "nice-to-have"],
  ["project-compass", "skill-python", "must-have"],
  ["project-compass", "skill-recommendations", "must-have"],
  ["project-compass", "skill-mlops", "must-have"],
  ["project-compass", "skill-react", "nice-to-have"],
  ["project-keystone", "skill-iam", "must-have"],
  ["project-keystone", "skill-threat-modeling", "must-have"],
  ["project-keystone", "skill-node", "nice-to-have"],
  ["project-beacon", "skill-ios", "must-have"],
  ["project-beacon", "skill-react-native", "must-have"],
  ["project-beacon", "skill-product-analytics", "nice-to-have"],
  ["project-lattice", "skill-design-systems", "must-have"],
  ["project-lattice", "skill-accessibility", "must-have"],
  ["project-lattice", "skill-react", "nice-to-have"],
  ["project-atlas", "skill-cypher", "must-have"],
  ["project-atlas", "skill-neo4j", "must-have"],
  ["project-atlas", "skill-react", "must-have"],
  ["project-atlas", "skill-ux", "nice-to-have"],
  ["project-harbor", "skill-observability", "must-have"],
  ["project-harbor", "skill-kubernetes", "must-have"],
  ["project-harbor", "skill-incident-response", "nice-to-have"],
  ["project-prism", "skill-ab-testing", "must-have"],
  ["project-prism", "skill-product-analytics", "must-have"],
  ["project-prism", "skill-sql", "nice-to-have"]
].map(([projectId, skillId, priority]) => ({ projectId, skillId, priority }));

export const worksOn = [
  ["person-priya", "project-orbit", "Product Lead", "2026-01-12"],
  ["person-maya", "project-orbit", "Frontend Lead", "2026-01-18"],
  ["person-iris", "project-orbit", "Research Partner", "2026-02-02"],
  ["person-luis", "project-compass", "Modeling Lead", "2026-02-20"],
  ["person-elena", "project-compass", "Data Pipeline Owner", "2026-02-24"],
  ["person-maya", "project-compass", "Prototype Engineer", "2026-03-01"],
  ["person-sara", "project-keystone", "Security Lead", "2026-01-05"],
  ["person-jin", "project-keystone", "IAM Engineer", "2026-01-09"],
  ["person-aanya", "project-keystone", "API Reviewer", "2026-01-16"],
  ["person-camila", "project-beacon", "iOS Lead", "2026-03-12"],
  ["person-arin", "project-beacon", "Mobile Platform", "2026-03-15"],
  ["person-priya", "project-beacon", "Growth Advisor", "2026-03-18"],
  ["person-zoe", "project-lattice", "Product Designer", "2025-10-01"],
  ["person-omar", "project-lattice", "Design Systems Lead", "2025-10-01"],
  ["person-maya", "project-lattice", "Frontend Partner", "2025-10-10"],
  ["person-aanya", "project-atlas", "Backend Lead", "2026-04-04"],
  ["person-ben", "project-atlas", "Graph API Engineer", "2026-04-08"],
  ["person-omar", "project-atlas", "Design Advisor", "2026-04-15"],
  ["person-noah", "project-harbor", "Reliability Lead", "2026-02-01"],
  ["person-kenji", "project-harbor", "Infrastructure Engineer", "2026-02-05"],
  ["person-sara", "project-harbor", "Incident Partner", "2026-02-08"],
  ["person-priya", "project-prism", "Product Lead", "2026-05-01"],
  ["person-ethan", "project-prism", "Analytics Lead", "2026-05-01"],
  ["person-elena", "project-prism", "Data Partner", "2026-05-06"]
].map(([personId, projectId, role, since]) => ({ personId, projectId, role, since }));

export const mentors = [
  ["person-aanya", "person-ben"],
  ["person-grace", "person-noah"],
  ["person-luis", "person-fatima"],
  ["person-omar", "person-zoe"],
  ["person-priya", "person-ethan"],
  ["person-sara", "person-jin"],
  ["person-camila", "person-arin"],
  ["person-grace", "person-priya"]
].map(([mentorId, menteeId]) => ({ mentorId, menteeId }));

export function getSeedGraph() {
  return {
    teams,
    skills,
    people,
    projects,
    memberOf,
    hasSkill,
    ownedBy,
    requiresSkill,
    worksOn,
    mentors
  };
}
