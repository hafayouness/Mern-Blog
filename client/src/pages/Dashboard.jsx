import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSider from "../components/DashSider";
import DashProfile from "../components/DashProfile";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
      console.log(tabFormUrl);
    }
  }, [location.search]);
  return (
    <div className="dashboardCss flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSider />
      </div>
      {/* {tab === "profile" && <DashProfile />} */}
      {tab === "profile" ? (
        <DashProfile className="text-gray-800" />
      ) : (
        <p>No profile selected</p>
      )}
    </div>
  );
}

export default Dashboard;
