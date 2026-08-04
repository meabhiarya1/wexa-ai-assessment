import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BriefcaseBusiness,
  GitFork,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { fetchJson, toQuery } from "./api.js";
import {
  Badge,
  CypherInspector,
  DbBanner,
  EmptyState,
  ErrorState,
  GraphView,
  LoadingBlock,
  PersonRow
} from "./components.jsx";
import { cypherSnippets } from "./cypherSnippets.js";
import "./styles.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Sparkles },
  { id: "people", label: "People", icon: Users },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "connect", label: "Connect", icon: GitFork },
  { id: "explore", label: "Explore", icon: Network }
];

function useResource(path, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    fetchJson(path)
      .then((data) => {
        if (active) setState({ loading: false, data, error: null });
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error });
      });

    return () => {
      active = false;
    };
  }, deps);

  const retry = () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    fetchJson(path)
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }));
  };

  return { ...state, retry };
}

function App() {
  const [page, setPage] = useState("dashboard");
  const health = useResource("/api/health", []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>TG</span>
          <div>
            <strong>TalentGraph</strong>
            <small>CognoDB org intelligence</small>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}>
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <DbBanner health={health.data} loading={health.loading} error={health.error} onRetry={health.retry} />
        {page === "dashboard" && <Dashboard />}
        {page === "people" && <People />}
        {page === "projects" && <Projects />}
        {page === "connect" && <Connect />}
        {page === "explore" && <Explore />}
      </main>
    </div>
  );
}

function Dashboard() {
  const stats = useResource("/api/stats", []);
  const bridges = useResource("/api/insights/bridges", []);
  const [search, setSearch] = useState("");
  const searchResults = useResource(`/api/search${toQuery({ q: search })}`, [search]);

  const statCards = [
    ["People", stats.data?.people, Users],
    ["Teams", stats.data?.teams, ShieldCheck],
    ["Skills", stats.data?.skills, Sparkles],
    ["Projects", stats.data?.projects, BriefcaseBusiness],
    ["Relationships", stats.data?.relationships, Network]
  ];

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Graph-powered talent operations</p>
          <h1>Find the right people through the relationships around them.</h1>
          <p>
            TalentGraph maps people, skills, teams, projects, and mentorship so staffing and collaboration questions
            become graph traversals instead of spreadsheet archaeology.
          </p>
        </div>
      </header>

      {stats.loading && <LoadingBlock label="Loading org stats" />}
      {stats.error && <ErrorState error={stats.error} onRetry={stats.retry} />}
      {stats.data && (
        <div className="stats-grid">
          {statCards.map(([label, value, Icon]) => (
            <article className="stat-card" key={label}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      )}

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Search the graph</h2>
            <p>Search people, projects, and skills from one place.</p>
          </div>
          <Search size={20} aria-hidden="true" />
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try React, Security, Orbit..." />
        {search.length >= 2 && searchResults.loading && <LoadingBlock label="Searching" />}
        {search.length >= 2 && searchResults.error && <ErrorState error={searchResults.error} />}
        {search.length >= 2 && searchResults.data?.length === 0 && (
          <EmptyState title="No matches" description="Try a person, project, skill, or category name." />
        )}
        {searchResults.data?.length > 0 && (
          <div className="result-list">
            {searchResults.data.map((item) => (
              <div className="result-row" key={`${item.type}-${item.id}`}>
                <Badge tone={item.type.toLowerCase()}>{item.type}</Badge>
                <strong>{item.label}</strong>
                <span>{item.sublabel}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Who bridges teams?</h2>
            <p>People connecting otherwise separate teams through shared project work.</p>
          </div>
          <GitFork size={20} aria-hidden="true" />
        </div>
        {bridges.loading && <LoadingBlock label="Finding bridge people" />}
        {bridges.error && <ErrorState error={bridges.error} onRetry={bridges.retry} />}
        {bridges.data?.length === 0 && <EmptyState title="No bridge people found" />}
        {bridges.data?.length > 0 && (
          <div className="grid-list">
            {bridges.data.map((person) => (
              <PersonRow
                key={`${person.id}-${person.connectedTeam.id}`}
                person={person}
                right={`${person.homeTeam.name} -> ${person.connectedTeam.name}`}
              />
            ))}
          </div>
        )}
        <CypherInspector title="Cypher powering this insight" query={cypherSnippets.bridgePeople} />
      </section>
    </section>
  );
}

function People() {
  const teams = useResource("/api/teams", []);
  const skills = useResource("/api/skills", []);
  const [filters, setFilters] = useState({ search: "", teamId: "", skillId: "" });
  const [selectedId, setSelectedId] = useState("");
  const people = useResource(`/api/people${toQuery(filters)}`, [filters.search, filters.teamId, filters.skillId]);
  const profile = useResource(selectedId ? `/api/people/${selectedId}` : "/api/people", [selectedId]);
  const collaborators = useResource(selectedId ? `/api/people/${selectedId}/collaborators` : "/api/people", [selectedId]);

  const selectedProfile = selectedId ? profile.data : null;

  return (
    <section className="page-stack">
      <Header eyebrow="Directory" title="People, skills, projects, and mentorship in one graph." />
      <FilterBar filters={filters} setFilters={setFilters} teams={teams.data} skills={skills.data} />

      <div className="split">
        <section className="panel">
          <h2>People</h2>
          {people.loading && <LoadingBlock label="Loading people" />}
          {people.error && <ErrorState error={people.error} onRetry={people.retry} />}
          {people.data?.length === 0 && <EmptyState title="No people found" />}
          <div className="grid-list">
            {people.data?.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                onClick={() => setSelectedId(person.id)}
                right={person.team?.name}
              />
            ))}
          </div>
        </section>

        <section className="panel sticky-panel">
          {!selectedId && <EmptyState title="Select a person" description="Open a profile to see skills and graph context." />}
          {selectedId && profile.loading && <LoadingBlock label="Loading profile" />}
          {selectedId && profile.error && <ErrorState error={profile.error} onRetry={profile.retry} />}
          {selectedProfile && (
            <div className="detail-stack">
              <div>
                <h2>{selectedProfile.person.name}</h2>
                <p>{selectedProfile.person.title}</p>
                <Badge tone="team">{selectedProfile.person.team?.name}</Badge>
              </div>
              <p>{selectedProfile.person.bio}</p>
              <h3>Skills</h3>
              <div className="badge-row">
                {selectedProfile.skills.map((skill) => (
                  <Badge key={skill.id} tone="skill">
                    {skill.name} L{skill.level}
                  </Badge>
                ))}
              </div>
              <h3>Projects</h3>
              <div className="mini-list">
                {selectedProfile.projects.map((project) => (
                  <span key={project.id}>
                    {project.name} <small>{project.role}</small>
                  </span>
                ))}
              </div>
              <h3>Collaborators</h3>
              {collaborators.loading && <LoadingBlock label="Loading collaborators" />}
              {collaborators.data?.map((person) => (
                <PersonRow key={person.id} person={person} right={`${person.strength} shared project(s)`} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function Projects() {
  const teams = useResource("/api/teams", []);
  const [filters, setFilters] = useState({ search: "", teamId: "", status: "" });
  const [selectedId, setSelectedId] = useState("");
  const projects = useResource(`/api/projects${toQuery(filters)}`, [filters.search, filters.teamId, filters.status]);
  const detail = useResource(selectedId ? `/api/projects/${selectedId}` : "/api/projects", [selectedId]);
  const gaps = useResource(selectedId ? `/api/projects/${selectedId}/gaps` : "/api/projects", [selectedId]);

  return (
    <section className="page-stack">
      <Header eyebrow="Staffing" title="Spot project skill gaps and recommended candidates." />
      <div className="filters">
        <input
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          placeholder="Search projects"
        />
        <select value={filters.teamId} onChange={(event) => setFilters({ ...filters, teamId: event.target.value })}>
          <option value="">All teams</option>
          {teams.data?.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">Any status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="split">
        <section className="panel">
          <h2>Projects</h2>
          {projects.loading && <LoadingBlock label="Loading projects" />}
          {projects.error && <ErrorState error={projects.error} onRetry={projects.retry} />}
          <div className="grid-list">
            {projects.data?.map((project) => (
              <button key={project.id} className="project-button" onClick={() => setSelectedId(project.id)}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.team?.name}</small>
                </span>
                <Badge tone={project.status}>{project.status}</Badge>
              </button>
            ))}
          </div>
        </section>

        <section className="panel sticky-panel">
          {!selectedId && <EmptyState title="Select a project" description="Open a project to inspect required skills and gaps." />}
          {selectedId && detail.loading && <LoadingBlock label="Loading project" />}
          {selectedId && detail.error && <ErrorState error={detail.error} onRetry={detail.retry} />}
          {detail.data?.project && (
            <div className="detail-stack">
              <div>
                <h2>{detail.data.project.name}</h2>
                <p>{detail.data.project.description}</p>
                <Badge tone="team">{detail.data.project.team?.name}</Badge>
              </div>
              <h3>Required skills</h3>
              <div className="badge-row">
                {detail.data.requiredSkills.map((skill) => (
                  <Badge key={skill.id} tone={skill.priority === "must-have" ? "project" : "neutral"}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
              <h3>Current team</h3>
              {detail.data.members.map((person) => (
                <PersonRow key={person.id} person={person} right={person.role} />
              ))}
              <h3>Skill gap analysis</h3>
              {gaps.loading && <LoadingBlock label="Running graph traversal" />}
              {gaps.error && <ErrorState error={gaps.error} onRetry={gaps.retry} />}
              {gaps.data?.length === 0 && <EmptyState title="No gaps found" description="Every required skill is covered by the current team." />}
              {gaps.data?.map((gap) => (
                <div className="gap-card" key={gap.skill.id}>
                  <div>
                    <Badge tone="skill">{gap.skill.name}</Badge>
                    <Badge tone={gap.priority === "must-have" ? "project" : "neutral"}>{gap.priority}</Badge>
                  </div>
                  {gap.candidates.map((candidate) => (
                    <PersonRow
                      key={candidate.id}
                      person={candidate}
                      right={`Fit ${candidate.fitScore} / L${candidate.level}`}
                    />
                  ))}
                </div>
              ))}
              <CypherInspector title="Cypher powering skill gap analysis" query={cypherSnippets.skillGaps} />
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function Connect() {
  const people = useResource("/api/people", []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const path = useResource(from && to ? `/api/path${toQuery({ from, to })}` : "/api/people", [from, to]);

  const nodeLabels = useMemo(() => {
    const labels = new Map();
    path.data?.graph?.nodes?.forEach((node) => labels.set(node.id, node.label));
    return labels;
  }, [path.data]);

  return (
    <section className="page-stack">
      <Header eyebrow="Shortest path" title="Explain how two people are connected." />
      {people.error && <ErrorState error={people.error} onRetry={people.retry} />}
      <div className="filters">
        <select value={from} onChange={(event) => setFrom(event.target.value)}>
          <option value="">From person</option>
          {people.data?.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <ArrowRight aria-hidden="true" />
        <select value={to} onChange={(event) => setTo(event.target.value)}>
          <option value="">To person</option>
          {people.data
            ?.filter((person) => person.id !== from)
            .map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
        </select>
      </div>
      {!from || !to ? (
        <EmptyState title="Pick two people" description="The app will ask CognoDB for the shortest path between them." />
      ) : (
        <section className="panel">
          {path.loading && <LoadingBlock label="Finding shortest path" />}
          {path.error && <ErrorState error={path.error} onRetry={path.retry} />}
          {path.data?.found === false && <EmptyState title="No path found" description="No connection was found within 8 hops." />}
          {path.data?.found && (
            <>
              <GraphView graph={path.data.graph} height={380} />
              <ol className="path-list">
                {path.data.graph.links.map((link, index) => (
                  <li key={`${link.source}-${link.target}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{nodeLabels.get(link.source) || link.source}</strong>
                    <em>{link.type.toLowerCase().replaceAll("_", " ")}</em>
                    <strong>{nodeLabels.get(link.target) || link.target}</strong>
                  </li>
                ))}
              </ol>
            </>
          )}
          <CypherInspector title="Cypher powering shortest path" query={cypherSnippets.shortestPath} />
        </section>
      )}
    </section>
  );
}

function Explore() {
  const teams = useResource("/api/teams", []);
  const [teamId, setTeamId] = useState("");
  const graph = useResource(`/api/graph${toQuery({ teamId })}`, [teamId]);

  return (
    <section className="page-stack">
      <Header eyebrow="Network explorer" title="See the organization as connected nodes and relationships." />
      <div className="filters">
        <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
          <option value="">Whole organization</option>
          {teams.data?.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <section className="panel">
        {graph.loading && <LoadingBlock label="Loading network graph" />}
        {graph.error && <ErrorState error={graph.error} onRetry={graph.retry} />}
        {graph.data && <GraphView graph={graph.data} height={520} />}
        <CypherInspector title="Cypher powering network explorer" query={cypherSnippets.network} />
      </section>
    </section>
  );
}

function FilterBar({ filters, setFilters, teams, skills }) {
  return (
    <div className="filters">
      <input
        value={filters.search}
        onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        placeholder="Search people"
      />
      <select value={filters.teamId} onChange={(event) => setFilters({ ...filters, teamId: event.target.value })}>
        <option value="">All teams</option>
        {teams?.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <select value={filters.skillId} onChange={(event) => setFilters({ ...filters, skillId: event.target.value })}>
        <option value="">Any skill</option>
        {skills?.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Header({ eyebrow, title }) {
  return (
    <header className="page-header compact">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </header>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
