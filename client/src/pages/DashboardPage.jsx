import { useState } from "react";
import { BriefcaseBusiness, GitFork, Network, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { toQuery } from "../api.js";
import { Badge, CypherInspector, EmptyState, ErrorState, LoadingBlock, PersonRow } from "../components.jsx";
import { cypherSnippets } from "../cypherSnippets.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useResource } from "../hooks/useResource.js";

export function DashboardPage() {
  const stats = useResource("/api/stats", []);
  const bridges = useResource("/api/insights/bridges", []);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const searchResults = useResource(`/api/search${toQuery({ q: debouncedSearch })}`, [debouncedSearch]);

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
        {debouncedSearch.length >= 2 && searchResults.loading && <LoadingBlock label="Searching" />}
        {debouncedSearch.length >= 2 && searchResults.error && <ErrorState error={searchResults.error} />}
        {debouncedSearch.length >= 2 && searchResults.data?.length === 0 && (
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
