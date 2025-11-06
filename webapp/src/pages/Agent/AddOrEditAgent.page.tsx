import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommonHelper } from "../../helper/helper";
import { CommonService } from "../../service/commonservice.page";
import LLMConfig from "../../components/LLMconfig";
import TTSConfig from "../../components/TTSconfig";
import STTConfig from "../../components/STTconfig";

const AddOrEditAgentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);

  const [form, setForm] = useState({
    name: "",
    workspace_id: "",
    customer_id: "",
    status: true,
  });
  const LLMData = {
     "welcome_message": "string",
  "objective": "string",
  "system_prompt": "string",
  "language": "string",
  "config_json": {},
  "temperature": 1,
  "ai_provider_id": "string",
  "sub_ai_model_provider_id": "string",
  "agent_id": "string"
  }

  // ✅ Track agent ID (existing OR newly created)
  const [agentId, setAgentId] = useState(id || null);

  // ---------------- Fetch Existing Agent ---------------- //
  const fetchAgent = async () => {
        CommonHelper.Showspinner();
    try {
      const response = await CommonService.GetById(id, "/v1/Agent/ById");
      setForm(response); 
    } catch (err) {
      console.log(err);
    }
    CommonHelper.Hidespinner();
  };

  // ---------------- Component Init ---------------- //
  useEffect(() => {
          CommonHelper.Showspinner();
    const forumRaw = localStorage.getItem("forum");
    if (forumRaw) {
      const forum = JSON.parse(forumRaw);

      setForm((prev) => ({
        ...prev,
        customer_id: forum.customer_data.id,
        workspace_id: forum.workspace_data.id,
      }));
    }

    // ✅ Only fetch when editing
    if (id) {
      fetchAgent();
    }
          CommonHelper.Hidespinner();
  }, [id]);

  // ---------------- Form Submit ---------------- //
const handleSubmit = async () => {
  CommonHelper.Showspinner();

  try {
    let response;

    if (agentId) {
      // ✅ Update existing
      response = await CommonService.CommonPut(form, `/v1/Agent/Update/${agentId}`);
    } else {
      // ✅ Create new
      response = await CommonService.CommonPost(form, "/v1/Agent/Insert");
    }

    if (response?.Type === "S") {
      CommonHelper.SuccessToaster(response.Message || "Saved successfully!");

      if (!agentId) {
        // ✅ Set agentId for tabs visibility
        setAgentId(response.AddtionalData);

        // ✅ Navigate so refresh works
        navigate(`/AddOrEditAgentPage/${response.AddtionalData}`);

        // ✅ Move to next tab
        setActiveTab(2);
      }

    } else {
      CommonHelper.ErrorToaster(response.Message || "Failed to save!");
    }

  } catch (error: any) {
    CommonHelper.ErrorToaster(
      error?.response?.data?.Message || "Something went wrong!"
    );
  } finally {
    CommonHelper.Hidespinner();
  }
};

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="panel p-4 mt-6">
      <h2 className="text-xl mb-4">
        {agentId ? "Edit Agent" : "Add Agent"}
         {/* <TTSConfig/>
          */}
      </h2>

      {/* ---------------- Tabs ---------------- */}
      {agentId && (
        <div className="w-full border-b-2 border-gray-300 mb-4 flex gap-6">
          <button
            className={`pb-2 ${
              activeTab === 1
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Add Agent
          </button>

          <button
            className={`pb-2 ${
              activeTab === 2
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(2)}
          >
            LLM Config
          </button>

          <button
            className={`pb-2 ${
              activeTab === 3
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(3)}
          >
            STT Config
          </button>

          <button
            className={`pb-2 ${
              activeTab === 4
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(4)}
          >
            TTS Config
          </button>
        </div>
      )}

      {/* ---------------- Tab Content ---------------- */}
      {activeTab === 1 && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Agent Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* hidden automatic values */}
          <input type="hidden" value={form.customer_id} />
          <input type="hidden" value={form.workspace_id} />

          <div className="flex justify-end ">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {agentId ? "Update" : "Create Agent"}
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={() => navigate("/agentlist")}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {agentId && activeTab === 2 && (
        <div>
          {/* <h3 className="text-lg font-medium mb-2">LLM Configuration</h3>
          <p className="text-gray-600">
            Your LLM settings UI goes here…
            
          </p> */}
          <LLMConfig agentId={agentId}/>
        </div>
      )}

      {agentId && activeTab === 3 && (
        <div>
         <STTConfig agentId={agentId} />
        </div>
      )}

      {agentId && activeTab === 4 && (
        <div>
            <TTSConfig agentId={agentId}/>
        </div>
      )}
    </div>
  );
};

export default AddOrEditAgentPage;
