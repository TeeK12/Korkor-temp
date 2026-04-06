import { useAuth } from "@/contexts/AuthContext";
import OwnerDashboard from "./OwnerDashboard";
import ServiceDashboard from "./ServiceDashboard";

const OwnerHome = () => {
  const { businessType } = useAuth();
  return businessType === "service" ? <ServiceDashboard /> : <OwnerDashboard />;
};

export default OwnerHome;
