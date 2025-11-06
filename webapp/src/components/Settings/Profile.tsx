import React, { useEffect, useState } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    workspace_name: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("forum");
    if (!raw) return;

    const data = JSON.parse(raw);

    setForm({
      name: data.customer_data?.name || "",
      email: data.email || "",
      phone: data.customer_data?.phone || "",
      workspace_name:data.customer_data?.workspace_name || "",
    });
  }, []);

  return (
    <div className="space-y-4">

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="form-input w-full"
          value={form.email}
          disabled
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.name}
          disabled
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.phone || "Null"}
          disabled
        />
      </div>

      
      {/* Workspace */}
      <div>
        <label className="block text-sm font-medium mb-1">Workspace</label>
        <input
          type="text"
          className="form-input w-full"
          value={form.workspace_name || "Null"}
          disabled
        />
      </div>


    </div>
  );
};

export default Profile;
