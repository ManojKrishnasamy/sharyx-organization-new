import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { setPageTitle } from "../store/themeConfigSlice";
import Profile from "../../components/Settings/Profile";
import Organization from "../../components/Settings/Organization";
import WorkSpace from "../../components/Settings/WorkSpace";
const SystemSettings = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");

//   useEffect(() => {
//     dispatch(setPageTitle("System Settings"));
//   }, [dispatch]);

  return (
    <div className="panel p-4 mt-6 min-h-[500px]">
      <h2 className="text-xl font-semibold mb-6">System Settings</h2>

      <div className="flex gap-6">

        {/* Sidebar */}
        <div className="w-60 border-r pr-4 flex flex-col gap-3">

          <button
            className={`text-left pb-2 ${
              activeTab === "profile"
                ? "border-l-4 border-primary text-primary font-semibold pl-2"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          {/* <button
            className={`text-left pb-2 ${
              activeTab === "members"
                ? "border-l-4 border-primary text-primary font-semibold pl-2"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button> */}

          <button
            className={`text-left pb-2 ${
              activeTab === "organization"
                ? "border-l-4 border-primary text-primary font-semibold pl-2"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("organization")}
          >
            Organization
          </button>

          <button
            className={`text-left pb-2 ${
              activeTab === "workspace"
                ? "border-l-4 border-primary text-primary font-semibold pl-2"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("workspace")}
          >
            Workspace
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">

          {activeTab === "profile" && (
            <div>
              <Profile/>
            </div>
          )}

          {/* {activeTab === "members" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Members</h3>
              <p className="text-gray-600">Manage users and roles here…</p>
            </div>
          )} */}

          {activeTab === "organization" && (
            <div>
            <Organization/>
            </div>
          )}

          {activeTab === "workspace" && (
            <div>
                <WorkSpace/>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
