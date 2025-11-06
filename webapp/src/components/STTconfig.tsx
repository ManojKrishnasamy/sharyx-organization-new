import React, { useEffect, useState } from "react";
import { CommonService } from "../service/commonservice.page";
import { CommonHelper } from "../helper/helper";
import Swal from "sweetalert2";

interface STTConfigProps {
  agentId: string;
}

const STTConfig: React.FC<STTConfigProps> = ({ agentId }) => {
  const helper = CommonHelper;

  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [subProviders, setSubProviders] = useState<any[]>([]);
  const [selectedAiProvider, setSelectedAiProvider] = useState("");
  const [selectedSubProvider, setSelectedSubProvider] = useState("");
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState<string | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [config, setConfig] = useState<any>({
    provider: "",
    model: "",
    language: "",
    encoding: "wav",
    sample_rate: 16000,
    noise_cancellation: false,
    fallback: {
      provider: "",
      model: "",
    },
  });

  // ✅ Fetch AI Providers (only STT)
  const fetchAIProviders = async () => {
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (Array.isArray(res)) {
        const sttProviders = res.filter(
          (p: any) => p.type?.toLowerCase() === "stt"
        );
        setAiProviders(sttProviders);
      }
    } catch (err) {
      console.error("❌ Error fetching AI providers:", err);
    }
  };

  // ✅ Fetch Sub-AI Providers by AI Provider ID
  const fetchSubProviders = async (aiProviderId: string) => {
    try {
      if (!aiProviderId) return;
      const res = await CommonService.GetAll(
        `/v1/SubAIModelProvider/GetByAIProvidedId/${aiProviderId}`
      );
      if (Array.isArray(res)) {
        setSubProviders(res);
      } else if (res?.status) {
        setSubProviders([res]);
      } else {
        setSubProviders([]);
      }
    } catch (err) {
      console.error("❌ Error fetching Sub-AI providers:", err);
    }
  };
  // ✅ Fetch Languages by SubAI Provider (Model ID)
const fetchLanguages = async (subProviderId: string) => {
  try {
    if (!subProviderId) return;
    const res = await CommonService.GetAll(
      `/v1/SubAIModelProvider/GetLanguageByModelID/${subProviderId}`
    );
    if (Array.isArray(res)) {
      setLanguages(res);
    } else if (res?.status) {
      setLanguages([res]);
    } else {
      setLanguages([]);
    }
  } catch (err) {
    console.error("❌ Error fetching languages:", err);
    setLanguages([]);
  }
};


   // ✅ Fetch existing STT config (for update)
const fetchSTTConfig = async () => {
  try {
    helper.Showspinner();
    const res = await CommonService.GetById(agentId, "/v1/STTConfig/GetByAgentId");
    if (res) {
      setConfigId(res.id);
      setSelectedAiProvider(res.ai_provider_id || "");
      setSelectedSubProvider(res.sub_ai_model_provider_id || "");
      setSelectedLanguage(res.language_id || "");
      setConfig(res.config_json || {
        encoding: "wav",
        sample_rate: 16000,
        noise_cancellation: false,
        fallback: { provider: "", model: "" },
      });

      // Fetch subProviders for existing AI Provider
      if (res.ai_provider_id) {
        await fetchSubProviders(res.ai_provider_id);
      }

      // Fetch languages for existing Sub Provider
      if (res.sub_ai_model_provider_id) {
        await fetchLanguages(res.sub_ai_model_provider_id);
      }
    } else {
      setConfigId(null);
    }
  } catch (error) {
    console.error("❌ Error fetching STT config:", error);
  }
  helper.Hidespinner();
};

  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    Promise.all([fetchAIProviders(), fetchSTTConfig()]).finally(() =>
      setLoading(false)
    );
  }, [agentId]);

  // ✅ Handle AI Provider selection
  const handleAiProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    setSelectedAiProvider(providerId);
    setSelectedSubProvider("");
    setSubProviders([]);
    if (providerId) fetchSubProviders(providerId);
  };

  // ✅ Handle Sub-AI Provider selection
const handleSubProviderChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const subId = e.target.value;
  setSelectedSubProvider(subId);
  setSelectedLanguage("");
  setLanguages([]);

  if (subId) {
    await fetchLanguages(subId);

    // Only set default config if no saved config exists
    if (!configId) {
      const selectedSub = subProviders.find((sp) => sp.id === subId);
      if (selectedSub?.configuration) {
        setConfig({
          ...selectedSub.configuration,
          fallback: selectedSub.configuration.fallback || { provider: "", model: "" },
        });
      }
    }
  }
};


  // ✅ Update config dynamically
  const handleConfigChange = (key: string, value: any, nestedKey?: string) => {
    setConfig((prev: any) => {
      const newConfig = { ...prev };
      if (nestedKey) {
        newConfig[nestedKey] = { ...newConfig[nestedKey], [key]: value };
      } else {
        newConfig[key] = value;
      }
      return newConfig;
    });
  };

  // ✅ Save configuration (Insert OR Update)
const saveConfig = async () => {
  if (!selectedAiProvider || !selectedSubProvider || !selectedLanguage) {
    Swal.fire({
      icon: "warning",
      title: "Required Fields Missing",
      text: "Please select AI Provider, Sub-AI Provider, and Language",
    });
    return;
  }

  helper.Showspinner();

  const payload = {
    ai_provider_id: selectedAiProvider,
    sub_ai_model_provider_id: selectedSubProvider,
    agent_id: agentId,
    language_id: selectedLanguage,
    config_json: config,
  };

  try {
    if (configId) {
      // ✅ UPDATE existing config
      await CommonService.CommonPut(payload, `/v1/STTConfig/Update/${configId}`);
      Swal.fire({ icon: "success", title: "STT Config Updated!" });
    } else {
      // ✅ INSERT new config
      await CommonService.CommonPost(payload, "/v1/STTConfig/Insert");
      Swal.fire({ icon: "success", title: "STT Config Saved!" });
    }
  } catch (error) {
    console.error("❌ Save Config Error:", error);
    Swal.fire({ icon: "error", title: "Failed to save config" });
  }

  helper.Hidespinner();
};



  if (loading) return <div>Loading STT configuration...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">STT Configuration</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* AI Provider */}
        <div>
          <label className="block text-sm font-medium mb-1">AI Provider</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedAiProvider}
            onChange={handleAiProviderChange}
          >
            <option value="">Select AI Provider</option>
            {aiProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-AI Provider */}
        <div>
          <label className="block text-sm font-medium mb-1">Sub-AI Provider</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedSubProvider}
            onChange={(e) => handleSubProviderChange(e)}
            disabled={!subProviders.length}
          >
            <option value="">Select Sub-AI Provider</option>
            {subProviders.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.model_name}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={!languages.length}
          >
            <option value="">Select Language</option>
             {languages.map((item) => (
            <option key={item.id} value={item.language_id}>
              {item.language.name}
            </option>
          ))}
          </select>
        </div>

        {/* Encoding */}
        <div>
          <label className="block text-sm font-medium mb-1">Encoding</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={config.encoding || "wav"}
            onChange={(e) => handleConfigChange("encoding", e.target.value)}
          >
            <option value="wav">WAV</option>
            <option value="mp3">MP3</option>
            <option value="flac">FLAC</option>
          </select>
        </div>

        {/* Sample Rate */}
        <div>
          <label className="block text-sm font-medium mb-1">Sample Rate</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={config.sample_rate || 16000}
            onChange={(e) =>
              handleConfigChange("sample_rate", parseInt(e.target.value))
            }
          />
        </div>

        {/* Noise Cancellation */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            className="mr-2"
            checked={config.noise_cancellation || false}
            onChange={(e) =>
              handleConfigChange("noise_cancellation", e.target.checked)
            }
          />
          <label className="text-sm font-medium">Noise Cancellation</label>
        </div>

        {/* Fallback Provider */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fallback Provider
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={config.fallback?.provider || ""}
            onChange={(e) =>
              handleConfigChange("provider", e.target.value, "fallback")
            }
          />
        </div>

        {/* Fallback Model */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fallback Model
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={config.fallback?.model || ""}
            onChange={(e) =>
              handleConfigChange("model", e.target.value, "fallback")
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveConfig}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {configId ? "Save STT Config" : "Save STT Config"}
        </button>
      </div>
    </div>
  );
};

export default STTConfig;
