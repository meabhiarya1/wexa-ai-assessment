import { AlertTriangle, Code2, Database, Loader2, Network } from "lucide-react";

const nodeColors = {
  Person: "#2563eb",
  Team: "#d97706",
  Skill: "#059669",
  Project: "#e11d48"
};

const relationshipLabels = {
  MEMBER_OF: "member of",
  HAS_SKILL: "has skill",
  WORKS_ON: "works on",
  MENTORS: "mentors",
  REQUIRES_SKILL: "requires",
  OWNED_BY: "owned by"
};

export function LoadingBlock({ label = "Loading" }) {
  return (
    <div className="state state-loading">
      <Loader2 className="spin" size={18} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="state">
      <Network size={20} aria-hidden="true" />
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state-error">
      <AlertTriangle size={20} aria-hidden="true" />
      <strong>{error?.message || "Something went wrong."}</strong>
      {error?.details?.missingVars && <span>Missing: {error.details.missingVars.join(", ")}</span>}
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function DbBanner({ health, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="db-banner">
        <Loader2 className="spin" size={16} aria-hidden="true" />
        Checking CognoDB connection...
      </div>
    );
  }

  if (error || !health?.ok) {
    return (
      <div className="db-banner db-banner-warning">
        <Database size={16} aria-hidden="true" />
        <span>{error?.message || health?.database?.message || "CognoDB is not connected."}</span>
        {onRetry && <button onClick={onRetry}>Retry</button>}
      </div>
    );
  }

  return (
    <div className="db-banner db-banner-ok">
      <Database size={16} aria-hidden="true" />
      Connected to CognoDB
    </div>
  );
}

export function CypherInspector({ title, query }) {
  return (
    <details className="cypher">
      <summary>
        <Code2 size={16} aria-hidden="true" />
        {title}
      </summary>
      <pre>{query}</pre>
    </details>
  );
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PersonAvatar({ name }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <span className="avatar">{initials}</span>;
}

export function PersonRow({ person, right, onClick }) {
  return (
    <button className="row-button" onClick={onClick}>
      <PersonAvatar name={person.name} />
      <span className="row-main">
        <strong>{person.name}</strong>
        <span>{person.title}</span>
      </span>
      {right && <span className="row-right">{right}</span>}
    </button>
  );
}

export function GraphView({ graph, height = 360 }) {
  if (!graph?.nodes?.length) {
    return <EmptyState title="No graph data" description="There are no nodes to draw for this view." />;
  }

  const width = 900;
  const radius = Math.min(width, height) * 0.38;
  const centerX = width / 2;
  const centerY = height / 2;
  const positions = new Map();

  graph.nodes.forEach((node, index) => {
    const angle = (index / graph.nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  });

  return (
    <div className="graph-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graph visualization">
        {graph.links.map((link, index) => {
          const source = positions.get(link.source);
          const target = positions.get(link.target);
          if (!source || !target) return null;

          return (
            <g key={`${link.source}-${link.target}-${index}`}>
              <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
              <title>{relationshipLabels[link.type] || link.type}</title>
            </g>
          );
        })}
        {graph.nodes.map((node) => {
          const position = positions.get(node.id);
          return (
            <g key={node.id} transform={`translate(${position.x} ${position.y})`}>
              <circle r="17" fill={nodeColors[node.type] || "#64748b"} />
              <text y="4" textAnchor="middle">
                {node.label.slice(0, 2).toUpperCase()}
              </text>
              <text className="node-label" y="34" textAnchor="middle">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {Object.entries(nodeColors).map(([type, color]) => (
          <span key={type}>
            <i style={{ background: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
