import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toQuery } from "../api.js";
import { CypherInspector, EmptyState, ErrorState, GraphView, LoadingBlock } from "../components.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { DIRECTORY_LIMIT } from "../constants/pagination.js";
import { cypherSnippets } from "../cypherSnippets.js";
import { useResource } from "../hooks/useResource.js";

export function ConnectPage() {
  const people = useResource(`/api/people${toQuery({ limit: DIRECTORY_LIMIT })}`, []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const path = useResource(from && to ? `/api/path${toQuery({ from, to })}` : null, [from, to]);
  const peopleItems = people.data?.items || [];

  const nodeLabels = useMemo(() => {
    const labels = new Map();
    path.data?.graph?.nodes?.forEach((node) => labels.set(node.id, node.label));
    return labels;
  }, [path.data]);

  return (
    <section className="page-stack">
      <PageHeader eyebrow="Shortest path" title="Explain how two people are connected." />
      {people.error && <ErrorState error={people.error} onRetry={people.retry} />}
      <div className="filters">
        <select value={from} onChange={(event) => setFrom(event.target.value)}>
          <option value="">From person</option>
          {peopleItems.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <ArrowRight aria-hidden="true" />
        <select value={to} onChange={(event) => setTo(event.target.value)}>
          <option value="">To person</option>
          {peopleItems
            .filter((person) => person.id !== from)
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
