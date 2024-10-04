import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSider from "../components/DashSider";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComment from "../components/DashComment";
import DashboardComp from "../components/DashboardComp";

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
      {tab === "dash" && <DashboardComp />}
      {tab === "profile" && <DashProfile />}

      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComment />}
    </div>
  );
}

export default Dashboard;
