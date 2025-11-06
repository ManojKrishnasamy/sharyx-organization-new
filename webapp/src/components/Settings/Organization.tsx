import React, { useEffect, useState } from "react";

const Organization = () => {
  const [form, setForm] = useState({
    organization_name: "",
    organization_unique_id: "",
    concurrency_limit: 1,
  });

  useEffect(() => {
    const raw = localStorage.getItem("forum");
    if (!raw) return;

    const data = JSON.parse(raw);

    setForm({
      organization_name: data.customer_data?.name || "",
      organization_unique_id: data.customer_data?.id || "",
      concurrency_limit: 1, // no value stored — default
    });
  }, []);

  return (
    <div className="space-y-4">

      {/* Organization Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Organization Name</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.organization_name}
          disabled
        />
      </div>

      {/* Organization ID */}
      <div>
        <label className="block text-sm font-medium mb-1">Organization ID</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.organization_unique_id}
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

export default Organization;
