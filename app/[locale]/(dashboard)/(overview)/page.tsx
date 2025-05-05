import { Suspense } from "react";
import ErgInProgressCallsCount from "./ErgInProgressCallsCount";

const Dashboard = () => {
  return (
    <div className="page" id="dashboard">
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ErgInProgressCallsCount />
      </Suspense>
    </div>
  );
};

export default Dashboard;
