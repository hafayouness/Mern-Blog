import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSider from "../components/DashSider";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";

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
    <div className="dashboardCss ">
      <div className="md:w-56">
        <DashSider />
      </div>
      {tab === "profile" && <DashProfile />}

      {tab === "posts" && <DashPosts />}
    </div>
  );
}

export default Dashboard;
