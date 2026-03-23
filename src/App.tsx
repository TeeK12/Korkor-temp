import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth pages
import LandingPage from "./pages/LandingPage";
import OwnerSignupPage from "./pages/OwnerSignupPage";
import AgentSignupPage from "./pages/AgentSignupPage";
import LoginPage from "./pages/LoginPage";

// Owner pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import InventoryPage from "./pages/owner/InventoryPage";
import ProductDetailPage from "./pages/owner/ProductDetailPage";
import AddProductPage from "./pages/owner/AddProductPage";
import AgentsPage from "./pages/owner/AgentsPage";
import AgentDetailPage from "./pages/owner/AgentDetailPage";
import ReportsPage from "./pages/owner/ReportsPage";
import RestockPage from "./pages/owner/RestockPage";
import DistributorPage from "./pages/owner/DistributorPage";
import OwnerNotificationsPage from "./pages/owner/OwnerNotificationsPage";
import OwnerSettingsPage from "./pages/owner/OwnerSettingsPage";

// Agent pages
import AgentHomePage from "./pages/agent/AgentHomePage";
import RecordSalePage from "./pages/agent/RecordSalePage";
import StockCountPage from "./pages/agent/StockCountPage";
import PerformancePage from "./pages/agent/PerformancePage";
import RecommendationsPage from "./pages/agent/RecommendationsPage";
import AgentSettingsPage from "./pages/agent/AgentSettingsPage";

// Shared pages
import FeedPage from "./pages/shared/FeedPage";
import OwnerBottomNav from "./components/OwnerBottomNav";
import AgentBottomNav from "./components/AgentBottomNav";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup/owner" element={<OwnerSignupPage />} />
            <Route path="/signup/agent" element={<AgentSignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Owner */}
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/inventory" element={<InventoryPage />} />
            <Route path="/owner/product/:id" element={<ProductDetailPage />} />
            <Route path="/owner/product/add" element={<AddProductPage />} />
            <Route path="/owner/product/edit/:id" element={<AddProductPage />} />
            <Route path="/owner/agents" element={<AgentsPage />} />
            <Route path="/owner/agent/:id" element={<AgentDetailPage />} />
            <Route path="/owner/reports" element={<ReportsPage />} />
            <Route path="/owner/restock" element={<RestockPage />} />
            <Route path="/owner/distributor" element={<DistributorPage />} />
            <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
            <Route path="/owner/settings" element={<OwnerSettingsPage />} />
            <Route path="/owner/feed" element={<FeedPage variant="owner" BottomNav={OwnerBottomNav} />} />

            {/* Agent */}
            <Route path="/agent" element={<AgentHomePage />} />
            <Route path="/agent/record-sale" element={<RecordSalePage />} />
            <Route path="/agent/stock-count" element={<StockCountPage />} />
            <Route path="/agent/performance" element={<PerformancePage />} />
            <Route path="/agent/recommendations" element={<RecommendationsPage />} />
            <Route path="/agent/settings" element={<AgentSettingsPage />} />
            <Route path="/agent/feed" element={<FeedPage variant="agent" BottomNav={AgentBottomNav} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
