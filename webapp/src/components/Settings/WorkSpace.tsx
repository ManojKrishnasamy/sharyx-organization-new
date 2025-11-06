import React, { useEffect, useState } from "react";

const WorkSpace = () => {
  const [form, setForm] = useState({
    workspace_name: "",
    workspace_unique_id: "",
    concurrency_limit: 1,
  });

  useEffect(() => {
    const raw = localStorage.getItem("forum");
    if (!raw) return;

    const data = JSON.parse(raw);

    setForm({
      workspace_name: data.workspace_data?.name || "",
      workspace_unique_id: data.workspace_data?.id || "",
      concurrency_limit: 1, // no value in LS, defaulting
    });
  }, []);

  return (
    <div className="space-y-4">

      {/* Workspace Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Workspace Name</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.workspace_name}
          disabled
        />
      </div>

      {/* Workspace ID */}
      <div>
        <label className="block text-sm font-medium mb-1">Workspace ID</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.workspace_unique_id}
          disabled
        />
      </div>

      {/* Concurrency Limit */}
      <div>
        <label className="block text-sm font-medium mb-1">Concurrency Limit</label>
        <input
          type="number"
          className="form-input w-full"
          value={form.concurrency_limit}
          disabled
        />
      </div>

    </div>
  );
};

export default WorkSpace;
