import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ExpensesProvider } from "@/contexts/ExpensesContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { SalesProvider } from "@/contexts/SalesContext";

// Auth pages
import LandingPage from "./pages/LandingPage";
import OwnerSignupPage from "./pages/OwnerSignupPage";
import AgentSignupPage from "./pages/AgentSignupPage";
import LoginPage from "./pages/LoginPage";

// Owner pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ServiceDashboard from "./pages/owner/ServiceDashboard";
import HealthBreakdownPage from "./pages/owner/HealthBreakdownPage";
import InventoryPage from "./pages/owner/InventoryPage";
import ProductDetailPage from "./pages/owner/ProductDetailPage";
import AddProductPage from "./pages/owner/AddProductPage";
import AgentsPage from "./pages/owner/AgentsPage";
import AgentDetailPage from "./pages/owner/AgentDetailPage";
import ReportsPage from "./pages/owner/ReportsPage";
import RevenueBreakdownPage from "./pages/owner/RevenueBreakdownPage";
import CostBreakdownPage from "./pages/owner/CostBreakdownPage";
import NetProfitBreakdownPage from "./pages/owner/NetProfitBreakdownPage";
import RestockPage from "./pages/owner/RestockPage";
import DistributorPage from "./pages/owner/DistributorPage";
import DistributorProfilePage from "./pages/owner/DistributorProfilePage";
import OwnerNotificationsPage from "./pages/owner/OwnerNotificationsPage";
import OwnerSettingsPage from "./pages/owner/OwnerSettingsPage";
import LogExpensePage from "./pages/owner/LogExpensePage";
import ExpensesHistoryPage from "./pages/owner/ExpensesHistoryPage";
import ServicesChipsPage from "./pages/owner/ServicesChipsPage";
import AddServicePage from "./pages/owner/AddServicePage";
import OwnerRecordSalePage from "./pages/owner/OwnerRecordSalePage";
import PromiseTrackerPage from "./pages/owner/PromiseTrackerPage";

// Agent pages
import AgentHomePage from "./pages/agent/AgentHomePage";
import RecordSalePage from "./pages/agent/RecordSalePage";
import ServiceRecordSalePage from "./pages/agent/ServiceRecordSalePage";
import StockCountPage from "./pages/agent/StockCountPage";
import PerformancePage from "./pages/agent/PerformancePage";
import RecommendationsPage from "./pages/agent/RecommendationsPage";
import AgentSettingsPage from "./pages/agent/AgentSettingsPage";
import TargetBreakdownPage from "./pages/agent/TargetBreakdownPage";
import AgentLogExpensePage from "./pages/agent/LogExpensePage";

// Shared pages
import FeedPage from "./pages/shared/FeedPage";
import OwnerBottomNav from "./components/OwnerBottomNav";
import AgentBottomNav from "./components/AgentBottomNav";

// Smart router components
import OwnerHome from "./pages/owner/OwnerHome";
import AgentRecordSale from "./pages/agent/AgentRecordSale";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ExpensesProvider>
          <ServiceProvider>
            <SalesProvider>
              <BrowserRouter>
                <Routes>
                  {/* Auth */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup/owner" element={<OwnerSignupPage />} />
                  <Route path="/signup/agent" element={<AgentSignupPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Owner */}
                  <Route path="/owner" element={<OwnerHome />} />
                  <Route path="/owner/health" element={<HealthBreakdownPage />} />
                  <Route path="/owner/inventory" element={<InventoryPage />} />
                  <Route path="/owner/product/:id" element={<ProductDetailPage />} />
                  <Route path="/owner/product/add" element={<AddProductPage />} />
                  <Route path="/owner/product/edit/:id" element={<AddProductPage />} />
                  <Route path="/owner/services" element={<ServicesChipsPage />} />
                  <Route path="/owner/service/add" element={<AddServicePage />} />
                  <Route path="/owner/agents" element={<AgentsPage />} />
                  <Route path="/owner/agent/:id" element={<AgentDetailPage />} />
                  <Route path="/owner/reports" element={<ReportsPage />} />
                  <Route path="/owner/reports/revenue" element={<RevenueBreakdownPage />} />
                  <Route path="/owner/reports/cost" element={<CostBreakdownPage />} />
                  <Route path="/owner/reports/profit" element={<NetProfitBreakdownPage />} />
                  <Route path="/owner/restock" element={<RestockPage />} />
                  <Route path="/owner/distributor" element={<DistributorPage />} />
                  <Route path="/owner/distributor/:id" element={<DistributorProfilePage />} />
                  <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
                  <Route path="/owner/settings" element={<OwnerSettingsPage />} />
                  <Route path="/owner/expenses" element={<ExpensesHistoryPage />} />
                  <Route path="/owner/expenses/log" element={<LogExpensePage />} />
                  <Route path="/owner/record-sale" element={<OwnerRecordSalePage />} />
                  <Route path="/owner/promises" element={<PromiseTrackerPage />} />
                  <Route path="/owner/feed" element={<FeedPage variant="owner" BottomNav={OwnerBottomNav} />} />

                  {/* Agent */}
                  <Route path="/agent" element={<AgentHomePage />} />
                  <Route path="/agent/record-sale" element={<AgentRecordSale />} />
                  <Route path="/agent/stock-count" element={<StockCountPage />} />
                  <Route path="/agent/performance" element={<PerformancePage />} />
                  <Route path="/agent/recommendations" element={<RecommendationsPage />} />
                  <Route path="/agent/settings" element={<AgentSettingsPage />} />
                  <Route path="/agent/target-breakdown" element={<TargetBreakdownPage />} />
                  <Route path="/agent/log-expense" element={<AgentLogExpensePage />} />
                  <Route path="/agent/feed" element={<FeedPage variant="agent" BottomNav={AgentBottomNav} />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SalesProvider>
          </ServiceProvider>
        </ExpensesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
