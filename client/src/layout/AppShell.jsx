import { DbBanner } from "../components.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useBrowserRoute } from "../router/useBrowserRoute.js";
import { getActivePage } from "../router/routes.jsx";
import { navItems } from "../router/navItems.jsx";

export function AppShell() {
  const { health } = useAppData();
  const [route, navigate] = useBrowserRoute();
  const ActivePage = getActivePage(route);

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
              <a
                key={item.path}
                href={item.path}
                className={route === item.path ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.path);
                }}
              >
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <DbBanner health={health.data} loading={health.loading} error={health.error} onRetry={health.retry} />
        <ActivePage />
      </main>
    </div>
  );
}
