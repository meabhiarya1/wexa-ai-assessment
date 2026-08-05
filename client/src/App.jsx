import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { AppDataProvider } from "./context/AppDataContext.jsx";
import { AppShell } from "./layout/AppShell.jsx";

export function App() {
  return (
    <ErrorBoundary>
      <AppDataProvider>
        <AppShell />
      </AppDataProvider>
    </ErrorBoundary>
  );
}
