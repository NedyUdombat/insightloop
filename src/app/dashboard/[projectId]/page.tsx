import StateA from "./states/StateA";
import StateB from "./states/StateB";
import StateC from "./states/StateC";

// TEMP — replace with real data
const hasProject = false;
const hasEvents = false;

export default function DashboardPage() {
  if (!hasProject) return <StateA />;
  if (hasProject && !hasEvents) return <StateB />;
  return <StateC />;
}
