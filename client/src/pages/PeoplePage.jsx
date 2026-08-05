import { useEffect, useState } from "react";
import { toQuery } from "../api.js";
import { Badge, EmptyState, ErrorState, LoadingBlock, PaginationControls, PersonRow } from "../components.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { PeopleFilterBar } from "../components/PeopleFilterBar.jsx";
import { PAGE_LIMIT } from "../constants/pagination.js";
import { useAppData } from "../context/AppDataContext.jsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useResource } from "../hooks/useResource.js";
import { uniqueBy } from "../utils/collections.js";

export function PeoplePage() {
  const { teams, skills } = useAppData();
  const [filters, setFilters] = useState({ search: "", teamId: "", skillId: "" });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const people = useResource(
    `/api/people${toQuery({ ...filters, search: debouncedSearch, page, limit: PAGE_LIMIT })}`,
    [debouncedSearch, filters.teamId, filters.skillId, page]
  );
  const profile = useResource(selectedId ? `/api/people/${selectedId}` : null, [selectedId]);
  const collaborators = useResource(selectedId ? `/api/people/${selectedId}/collaborators` : null, [selectedId]);
  const peopleItems = people.data?.items || [];
  const selectedProfile = selectedId ? profile.data : null;
  const profileSkills = uniqueBy(selectedProfile?.skills, (skill) => skill.id);
  const profileProjects = uniqueBy(selectedProfile?.projects, (project) => `${project.id}:${project.role}`);
  const profileCollaborators = uniqueBy(collaborators.data, (person) => person.id);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.teamId, filters.skillId]);

  return (
    <section className="page-stack">
      <PageHeader eyebrow="Directory" title="People, skills, projects, and mentorship in one graph." />
      <PeopleFilterBar filters={filters} setFilters={setFilters} teams={teams.data} skills={skills.data} />

      <div className="split">
        <section className="panel">
          <h2>People</h2>
          {people.loading && <LoadingBlock label="Loading people" />}
          {people.error && <ErrorState error={people.error} onRetry={people.retry} />}
          {peopleItems.length === 0 && !people.loading && <EmptyState title="No people found" />}
          <div className="grid-list">
            {peopleItems.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                onClick={() => setSelectedId(person.id)}
                right={person.team?.name}
              />
            ))}
          </div>
          <PaginationControls pagination={people.data?.pagination} onPageChange={setPage} />
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
                {profileSkills.map((skill) => (
                  <Badge key={skill.id} tone="skill">
                    {skill.name} L{skill.level}
                  </Badge>
                ))}
              </div>
              <h3>Projects</h3>
              <div className="mini-list">
                {profileProjects.map((project) => (
                  <span key={`${project.id}-${project.role}`}>
                    {project.name} <small>{project.role}</small>
                  </span>
                ))}
              </div>
              <h3>Collaborators</h3>
              {collaborators.loading && <LoadingBlock label="Loading collaborators" />}
              {profileCollaborators.map((person) => (
                <PersonRow key={person.id} person={person} right={`${person.strength} shared project(s)`} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
