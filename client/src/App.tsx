import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DuckOriginalHTML from "./pages/DuckOriginalHTML";
import DuckMegaHTML from "./pages/DuckMegaHTML";
import DuckStudioModern from "./pages/DuckStudioModern";
import DuckFullStudioWorkspace from "./pages/DuckFullStudioWorkspace";
import DuckFullStudioPro from "./pages/DuckFullStudioPro";
import DuckAuditStudio from "./pages/DuckAuditStudio";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={DuckFullStudioPro} />
      <Route path={"/workspace"} component={DuckFullStudioWorkspace} />
      <Route path={"/public"} component={DuckStudioModern} />
      <Route path={"/mega"} component={DuckMegaHTML} />
      <Route path={"/original"} component={DuckOriginalHTML} />
      <Route path={"/audit"} component={DuckAuditStudio} />
      <Route path={"/react"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
