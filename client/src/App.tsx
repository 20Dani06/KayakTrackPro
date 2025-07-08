import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Sessions from "@/pages/sessions";
import Analytics from "@/pages/analytics";
import FitnessStats from "@/pages/fitness-stats";
import Diary from "@/pages/diary";
import Login from "@/pages/login";
import Navigation from "@/components/navigation";
import MobileNav from "@/components/mobile-nav";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-16 md:pb-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/sessions" component={Sessions} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/fitness" component={FitnessStats} />
          <Route path="/diary" component={Diary} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
