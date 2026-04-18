import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Farm from "./pages/Farm";
import EmotionalFarming from "./pages/EmotionalFarming";
import AIBioMentor from "./pages/AIBioMentor";
import GeneticLab from "./pages/GeneticLab";
import ClimateTourism from "./pages/ClimateTourism";
import BioNarrative from "./pages/BioNarrative";
import ARScanner from "./pages/ARScanner";
import Craftsmanship from "./pages/Craftsmanship";
import CryptoBotany from "./pages/CryptoBotany";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/emotional-farming" element={<EmotionalFarming />} />
          <Route path="/ai-mentor" element={<AIBioMentor />} />
          <Route path="/genetic-lab" element={<GeneticLab />} />
          <Route path="/climate-tourism" element={<ClimateTourism />} />
          <Route path="/bio-narrative" element={<BioNarrative />} />
          <Route path="/ar-scanner" element={<ARScanner />} />
          <Route path="/craftsmanship" element={<Craftsmanship />} />
          <Route path="/crypto-botany" element={<CryptoBotany />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
