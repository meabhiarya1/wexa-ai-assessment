import { useEffect, useState } from "react";
import { toQuery } from "../api.js";
import {
  Badge,
  CypherInspector,
  EmptyState,
  ErrorState,
  LoadingBlock,
  PaginationControls,
  PersonRow
} from "../components.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { PAGE_LIMIT } from "../constants/pagination.js";
import { useAppData } from "../context/AppDataContext.jsx";
import { cypherSnippets } from "../cypherSnippets.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useResource } from "../hooks/useResource.js";
import { uniqueBy } from "../utils/collections.js";

export function ProjectsPage() {
  const { teams } = useAppData();
  const [filters, setFilters] = useState({ search: "", teamId: "", status: "" });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const projects = useResource(
    `/api/projects${toQuery({ ...filters, search: debouncedSearch, page, limit: PAGE_LIMIT })}`,
    [debouncedSearch, filters.teamId, filters.status, page]
  );
  const detail = useResource(selectedId ? `/api/projects/${selectedId}` : null, [selectedId]);
  const gaps = useResource(selectedId ? `/api/projects/${selectedId}/gaps` : null, [selectedId]);
  const projectItems = projects.data?.items || [];
  const projectRequiredSkills = uniqueBy(detail.data?.requiredSkills, (skill) => skill.id);
  const projectMembers = uniqueBy(detail.data?.members, (person) => `${person.id}:${person.role}`);
  const projectGaps = uniqueBy(gaps.data, (gap) => gap.skill.id);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.teamId, filters.status]);

  return (
    <section className="page-stack">
      <PageHeader eyebrow="Staffing" title="Spot project skill gaps and recommended candidates." />
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
          {projectItems.length === 0 && !projects.loading && <EmptyState title="No projects found" />}
          <div className="grid-list">
            {projectItems.map((project) => (
              <button key={project.id} className="project-button" onClick={() => setSelectedId(project.id)}>
                <span>
                  <strong>{project.name}</strong>
                  <small>{project.team?.name}</small>
                </span>
                <Badge tone={project.status}>{project.status}</Badge>
              </button>
            ))}
          </div>
          <PaginationControls pagination={projects.data?.pagination} onPageChange={setPage} />
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
                {projectRequiredSkills.map((skill) => (
                  <Badge key={skill.id} tone={skill.priority === "must-have" ? "project" : "neutral"}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
              <h3>Current team</h3>
              {projectMembers.map((person) => (
                <PersonRow key={`${person.id}-${person.role}`} person={person} right={person.role} />
              ))}
              <h3>Skill gap analysis</h3>
              {gaps.loading && <LoadingBlock label="Running graph traversal" />}
              {gaps.error && <ErrorState error={gaps.error} onRetry={gaps.retry} />}
              {gaps.data?.length === 0 && <EmptyState title="No gaps found" description="Every required skill is covered by the current team." />}
              {projectGaps.map((gap) => (
                <div className="gap-card" key={gap.skill.id}>
                  <div>
                    <Badge tone="skill">{gap.skill.name}</Badge>
                    <Badge tone={gap.priority === "must-have" ? "project" : "neutral"}>{gap.priority}</Badge>
                  </div>
                  {uniqueBy(gap.candidates, (candidate) => candidate.id).map((candidate) => (
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
