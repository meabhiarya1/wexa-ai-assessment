import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { AlertTriangle, ChevronLeft, ChevronRight, Code2, Database, Loader2, Maximize2, Move, Network, ZoomIn } from "lucide-react";

const nodeColors = {
  Person: "#2563eb",
  Team: "#d97706",
  Skill: "#059669",
  Project: "#e11d48"
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
  const missingVars = error?.details?.missingVars || error?.details?.error?.details?.missingVars;

  return (
    <div className="state state-error">
      <AlertTriangle size={20} aria-hidden="true" />
      <strong>{error?.message || "Something went wrong."}</strong>
      {missingVars && <span>Missing: {missingVars.join(", ")}</span>}
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

export function PaginationControls({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="pagination">
      <span>
        Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
      </span>
      <div>
        <button disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.page - 1)}>
          <ChevronLeft size={15} aria-hidden="true" />
          Previous
        </button>
        <button disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)}>
          Next
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function GraphView({ graph, height = 360 }) {
  const wrapperRef = useRef(null);
  const graphRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!wrapperRef.current) return undefined;

    const element = wrapperRef.current;
    const updateWidth = () => setWidth(element.clientWidth);
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(element);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  const graphData = useMemo(
    () => ({
      nodes: graph?.nodes?.map((node) => ({ ...node })) || [],
      links: graph?.links?.map((link) => ({ ...link })) || []
    }),
    [graph]
  );

  useEffect(() => {
    if (!graphRef.current || !graphData.nodes.length) return undefined;

    const timer = window.setTimeout(() => {
      graphRef.current?.zoomToFit(500, 54);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [graphData]);

  if (!graph?.nodes?.length) {
    return <EmptyState title="No graph data" description="There are no nodes to draw for this view." />;
  }

  const fitGraph = () => graphRef.current?.zoomToFit(500, 54);
  const zoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.25, 300);

  function drawNode(node, ctx, globalScale) {
    const color = nodeColors[node.type] || "#64748b";
    const radius = hoveredNode?.id === node.id ? 8 : 6;
    const label = node.label;
    const fontSize = Math.max(3.8, 11 / globalScale);
    const labelVisible = graphData.nodes.length <= 28 || globalScale > 1.25 || hoveredNode?.id === node.id;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = `${color}22`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = hoveredNode?.id === node.id ? 2.4 : 1.4;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    if (!labelVisible) return;

    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const boxWidth = textWidth + 12;
    const boxHeight = fontSize + 8;
    const boxX = node.x - boxWidth / 2;
    const boxY = node.y + radius + 8;

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "rgba(148,163,184,0.45)";
    ctx.lineWidth = 1 / globalScale;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 5 / globalScale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1f2937";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, node.x, boxY + boxHeight / 2);
  }

  return (
    <div className="graph-shell" ref={wrapperRef}>
      <div className="graph-toolbar">
        <div className="graph-hints">
          <span>
            <Move size={14} aria-hidden="true" />
            Drag nodes
          </span>
          <span>
            <ZoomIn size={14} aria-hidden="true" />
            Scroll to zoom
          </span>
        </div>
        <button onClick={zoomIn}>
          <ZoomIn size={15} aria-hidden="true" />
          Zoom
        </button>
        <button onClick={fitGraph}>
          <Maximize2 size={15} aria-hidden="true" />
          Fit
        </button>
      </div>

      <div className="graph-canvas" style={{ height }}>
        {width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={width}
            height={height}
            nodeId="id"
            nodeLabel={(node) => `${node.label}${node.sublabel ? ` - ${node.sublabel}` : ""}`}
            nodeRelSize={5.5}
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI, false);
              ctx.fill();
            }}
            linkColor={() => "rgba(71,85,105,0.35)"}
            linkWidth={(link) => (isConnectedToHovered(link, hoveredNode) ? 2.4 : 1.2)}
            linkDirectionalParticles={(link) =>
              isConnectedToHovered(link, hoveredNode) ? 2 : 0
            }
            linkDirectionalParticleSpeed={0.006}
            linkDirectionalParticleWidth={2}
            d3AlphaDecay={0.028}
            d3VelocityDecay={0.34}
            cooldownTicks={120}
            onNodeHover={setHoveredNode}
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
            }}
            backgroundColor="rgba(0,0,0,0)"
          />
        )}
        {hoveredNode && (
          <div className="graph-tooltip">
            <strong>{hoveredNode.label}</strong>
            <span>{hoveredNode.type}</span>
            {hoveredNode.sublabel && <small>{hoveredNode.sublabel}</small>}
          </div>
        )}
      </div>

      <div className="legend graph-legend">
        {Object.entries(nodeColors).map(([type, color]) => (
          <span key={type}>
            <i style={{ background: color }} />
            {type}
          </span>
        ))}
        <span>{graphData.nodes.length} nodes</span>
        <span>{graphData.links.length} relationships</span>
      </div>
    </div>
  );
}

function isConnectedToHovered(link, hoveredNode) {
  if (!hoveredNode) return false;

  const sourceId = typeof link.source === "object" ? link.source.id : link.source;
  const targetId = typeof link.target === "object" ? link.target.id : link.target;

  return sourceId === hoveredNode.id || targetId === hoveredNode.id;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
