import { useMemo, useState } from "react";
import { toQuery } from "../api.js";
import { CypherInspector, ErrorState, GraphView, LoadingBlock } from "../components.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { cypherSnippets } from "../cypherSnippets.js";
import { useResource } from "../hooks/useResource.js";

export function ExplorePage() {
  const { teams } = useAppData();
  const [teamId, setTeamId] = useState("");
  const graph = useResource(`/api/graph${toQuery({ teamId })}`, [teamId]);
  const graphSummary = useMemo(() => {
    if (!graph.data) return { nodes: 0, relationships: 0, people: 0, projects: 0 };

    return {
      nodes: graph.data.nodes.length,
      relationships: graph.data.links.length,
      people: graph.data.nodes.filter((node) => node.type === "Person").length,
      projects: graph.data.nodes.filter((node) => node.type === "Project").length
    };
  }, [graph.data]);

  return (
    <section className="page-stack">
      <header className="page-header explorer-header">
        <div>
          <p className="eyebrow">Network explorer</p>
          <h1>Explore the organization like a live graph, not a table.</h1>
          <p>
            Drag nodes, zoom into clusters, and filter by team to understand how people, projects, and mentorship
            shape collaboration.
          </p>
        </div>
        <div className="explorer-metrics">
          <span>
            <strong>{graphSummary.nodes}</strong>
            nodes
          </span>
          <span>
            <strong>{graphSummary.relationships}</strong>
            relationships
          </span>
          <span>
            <strong>{graphSummary.people}</strong>
            people
          </span>
          <span>
            <strong>{graphSummary.projects}</strong>
            projects
          </span>
        </div>
      </header>
      <section className="panel graph-panel">
        <div className="panel-head graph-panel-head">
          <div>
            <h2>Live graph canvas</h2>
            <p>Force-directed, draggable, zoomable, and responsive to the panel width.</p>
          </div>
          <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
            <option value="">Whole organization</option>
            {teams.data?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        {graph.loading && <LoadingBlock label="Loading network graph" />}
        {graph.error && <ErrorState error={graph.error} onRetry={graph.retry} />}
        {graph.data && <GraphView graph={graph.data} height={620} />}
        <CypherInspector title="Cypher powering network explorer" query={cypherSnippets.network} />
      </section>
    </section>
  );
}
