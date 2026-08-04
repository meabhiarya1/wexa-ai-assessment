import React from "react";
import { createRoot } from "react-dom/client";
import { Network, Server, Users, Workflow } from "lucide-react";
import "./styles.css";

const features = [
  {
    icon: Users,
    title: "People and skills",
    description: "Browse people by team, skill, project work, and mentorship context."
  },
  {
    icon: Workflow,
    title: "Project staffing gaps",
    description: "Use graph traversals to find missing project skills and matching candidates."
  },
  {
    icon: Network,
    title: "Shortest paths",
    description: "Explain how two people connect through teams, projects, and mentors."
  },
  {
    icon: Server,
    title: "CognoDB powered",
    description: "All graph data will be queried through the official Neo4j driver over Bolt."
  }
];

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">TalentGraph</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
            Org intelligence built for graph-shaped questions.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            A React and Express application backed by CognoDB. It will show who knows what, who has worked with whom,
            and who can fill the next project gap.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                <h2 className="mt-4 font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
