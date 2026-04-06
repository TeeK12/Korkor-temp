import { useAuth } from "@/contexts/AuthContext";
import RecordSalePage from "./RecordSalePage";
import ServiceRecordSalePage from "./ServiceRecordSalePage";

const AgentRecordSale = () => {
  const { businessType } = useAuth();
  return businessType === "service" ? <ServiceRecordSalePage /> : <RecordSalePage />;
};

export default AgentRecordSale;
