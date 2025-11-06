import React, { useState, useEffect } from "react";
import { CommonHelper } from "../helper/helper";
import { CommonService } from "../service/commonservice.page";

interface LLMConfigProps {
  agentId: string;
}

const LLMConfig: React.FC<LLMConfigProps> = ({ agentId }) => {
  const helper = CommonHelper;

  // Local UI state
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [objective, setObjective] = useState("");
  const [temperature, setTemperature] = useState(1);
  const [languages, setLanguages] = useState<any[]>([]);
  const [language, setLanguage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  // Track config ID for updates
  const [configId, setConfigId] = useState<string | null>(null);

  // AI Provider data
  const [providers, setProviders] = useState<any[]>([]);
  const [providerId, setProviderId] = useState("");

  // Sub AI model provider data
  const [subProviders, setSubProviders] = useState<any[]>([]);
  const [subProviderId, setSubProviderId] = useState("");

  const [filteredLanguages, setFilteredLanguages] = useState<any[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing config if editing
  const fetchConfig = async () => {
    helper.Showspinner();[]
    try {
      const res = await CommonService.GetById(agentId,"/v1/LLMConfig/GetByAgentId");
      if (res) {
        setConfigId(res.id);
        setWelcomeMessage(res.welcome_message || "");
        setObjective(res.objective || "");
        setTemperature(res.temperature ?? 1);
        setLanguage(res.language_id  || "");
        setSystemPrompt(res.system_prompt || "");
        setProviderId(res.ai_provider_id || "");
        setSubProviderId(res.sub_ai_model_provider_id || "");
      } else {
        setConfigId(null);
      }
        console.log("fetch",res)
    } catch (err) {
      console.log("❌ Fetch Config Error:", err);
    }
    helper.Hidespinner();
    setLoading(false);
  };

  const fetchLanguageByModelId = async (id: string) => {
  try {
    const res = await CommonService.GetById(
      id,
      "/v1/SubAIModelProvider/GetLanguageByModelID"
    );

    console.log("languageID",res)
    if (res) {
      // wrap it if your API returns a single object (common case)
      const arr = Array.isArray(res) ? res : [res];

      setFilteredLanguages(arr);

      // auto-select the first language
      if (arr.length > 0) {
         setLanguage(arr[0].language.code);
      }
    }
  } catch (err) {
    console.log("❌ fetchLanguageByModelId Error:", err);
  }
};



  // ✅ Fetch provider list
  const fetchProviders = async () => {
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (res) setProviders(res);
    } catch (err) {
      console.log("❌ Fetch Providers Error:", err);
    }
  };


   const fetchLanguages = async () => {
    try {
      const res = await CommonService.GetAll("/v1/Language/List");
      if (res) setLanguages(res);
      //  console.log("language",res)
    } catch (err) {
      console.log("❌ Fetch Language Error:", err);
    }
  };

  // ✅ Fetch Sub-AI Model providers
  const fetchSubProviders = async () => {
    try {
      const res = await CommonService.GetAll("/v1/SubAIModelProvider/List");
      if (res) setSubProviders(res);
    } catch (err) {
      console.log("❌ Fetch Sub Providers Error:", err);
    }
  };

  // ✅ Initial Load & when agent changes
  useEffect(() => {
    if (!agentId) return;  
    setLoading(true);
    fetchConfig();
    fetchProviders();
    fetchSubProviders();
    fetchLanguages();
  }, [agentId]);

  // ✅ Save Handler (insert OR update)
const saveConfig = async () => {
  if (!providerId) {
    return helper.ErrorToaster("Please choose an AI provider before saving.");
  }

  if (!subProviderId) {
    return helper.ErrorToaster("Please choose a sub model before saving.");
  }

  helper.Showspinner();

  const payload = {
    welcome_message: welcomeMessage,
    objective,
    system_prompt: systemPrompt,
    language_id: language,
    config_json: {},
    temperature,
    ai_provider_id: providerId,
    sub_ai_model_provider_id: subProviderId,
    agent_id: agentId,
  };

  try {
    let response;

    if (configId) {
      response = await CommonService.CommonPut(
        payload,
        `/v1/LLMConfig/Update/${configId}`
      );
    } else {
      response = await CommonService.CommonPost(
        payload,
        "/v1/LLMConfig/Insert"
      );
    }

    if (response?.Type === "S") {
      setConfigId(response?.AddtionalData ?? response?.result?.id);
      helper.SuccessToaster(response.Message || "Saved successfully!");
    } else {
      helper.ErrorToaster(response?.Message || "Failed to save!");
    }

  } catch (error: any) {
    helper.ErrorToaster(
      error?.response?.data?.Message || "Something went wrong!"
    );
  } finally {
    helper.Hidespinner();
  }
};


  // ✅ Block UI until loaded
  if (loading) {
    return <div>Loading LLM configuration...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">LLM Configuration</h3>

      <div className="grid grid-cols-2 gap-4">

        {/* AI Provider List */}
        <div>
          <label className="block text-sm font-medium mb-1">AI Provider</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          >
              <option value="">Select Provider</option>
              {providers
                .filter(item => item.type.toLowerCase() === "llm")
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}

          </select>
        </div>

        {/* Sub Provider List */}
        <div>
          <label className="block text-sm font-medium mb-1">AI Sub Model</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={subProviderId}
            onChange={(e) => {
            const id = e.target.value;
            setSubProviderId(id);
            setFilteredLanguages([]); // reset
            setLanguage("");          // reset
            if (id) fetchLanguageByModelId(id);
          }}
          >
            <option value="">Select Sub Model</option>
            {subProviders
              .filter((item) => item.ai_provider_id === providerId)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.model_name}
                </option>
              ))}
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium mb-1">Temperature</label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            className="w-full border rounded-md px-3 py-2"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>

        {/* Welcome Message */}
        <div>
          <label className="block text-sm font-medium mb-1">Welcome Message</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-medium mb-1">Objective</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select Language</option>

            {(filteredLanguages.length > 0 ? filteredLanguages : languages).map(item => (
              <option
                key={item.language?.id ?? item.id}
                value={item.language?.id ?? item.id}
              >
                {item.language?.name ?? item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-sm font-medium mb-1">System Prompt</label>
        <textarea
          className="w-full border rounded-md px-3 py-2 h-24"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={saveConfig}>
          {configId ? "Update LLM Config" : "Save LLM Config"}
        </button>
      </div>

    </div>
  );
};

export default LLMConfig;
