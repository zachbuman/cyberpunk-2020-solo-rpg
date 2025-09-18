import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import CharacterCreation from "@/pages/character-creation";
import Characters from "@/pages/characters";
import CharacterDetail from "@/pages/character-detail";
import CyberwareShopPage from "@/pages/cyberware-shop";
import Dice from "@/pages/dice";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/character-creation" component={CharacterCreation} />
      <Route path="/characters" component={Characters} />
      <Route path="/characters/:id" component={CharacterDetail} />
      <Route path="/characters/:id/cyberware" component={CyberwareShopPage} />
      <Route path="/dice" component={Dice} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative scan-lines">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
