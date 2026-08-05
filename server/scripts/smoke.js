const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

const checks = [
  { name: "live health", path: "/api/health/live", status: 200 },
  { name: "db health", path: "/api/health", status: 200 },
  { name: "readiness", path: "/api/ready", status: 200 },
  { name: "stats", path: "/api/stats", status: 200, assert: (body) => body.people > 0 && body.relationships > 0 },
  { name: "teams", path: "/api/teams", status: 200, assert: Array.isArray },
  { name: "skills", path: "/api/skills", status: 200, assert: Array.isArray },
  { name: "people", path: "/api/people", status: 200, assert: (body) => Array.isArray(body) && body.length > 0 },
  { name: "person detail", path: "/api/people/person-aanya", status: 200, assert: (body) => Boolean(body.person?.id) },
  { name: "collaborators", path: "/api/people/person-aanya/collaborators", status: 200, assert: Array.isArray },
  { name: "projects", path: "/api/projects", status: 200, assert: (body) => Array.isArray(body) && body.length > 0 },
  { name: "project detail", path: "/api/projects/project-atlas", status: 200, assert: (body) => Boolean(body.project?.id) },
  { name: "skill gaps", path: "/api/projects/project-atlas/gaps", status: 200, assert: Array.isArray },
  { name: "bridges", path: "/api/insights/bridges?limit=3", status: 200, assert: (body) => Array.isArray(body) && body.length <= 3 },
  { name: "shortest path", path: "/api/path?from=person-aanya&to=person-camila", status: 200, assert: (body) => body.found === true },
  { name: "graph", path: "/api/graph", status: 200, assert: (body) => body.nodes?.length > 0 && body.links?.length > 0 },
  { name: "missing path params", path: "/api/path", status: 400, assert: (body) => body.code === "BAD_REQUEST" },
  { name: "missing person", path: "/api/people/person-not-real", status: 404, assert: (body) => body.code === "NOT_FOUND" },
  { name: "invalid route", path: "/api/not-real", status: 404, assert: (body) => body.code === "ROUTE_NOT_FOUND" }
];

let failed = 0;

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  try {
    const response = await fetch(url);
    const body = await response.json();
    const statusOk = response.status === check.status;
    const bodyOk = check.assert ? check.assert(body) : true;

    if (!statusOk || !bodyOk) {
      failed += 1;
      console.error(`FAIL ${check.name}: expected ${check.status}, got ${response.status}`);
      console.error(JSON.stringify(body));
      continue;
    }

    console.log(`PASS ${check.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${check.name}: ${error.message}`);
  }
}

if (failed > 0) {
  console.error(`${failed} smoke check(s) failed against ${baseUrl}.`);
  process.exitCode = 1;
} else {
  console.log(`All smoke checks passed against ${baseUrl}.`);
}
