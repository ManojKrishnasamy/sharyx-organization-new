import React, { useEffect, useState } from "react";
import { CommonService } from "../service/commonservice.page";
import { CommonHelper } from "../helper/helper";
import Swal from "sweetalert2";

interface TTSConfigProps {
  agentId: string;
}

const TTSConfig: React.FC<TTSConfigProps> = ({ agentId }) => {
  const helper = CommonHelper;

  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [subProviders, setSubProviders] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedAiProvider, setSelectedAiProvider] = useState("");
  const [selectedSubProvider, setSelectedSubProvider] = useState("");
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({
    language: "",
    voice: "",
    speaking_rate: 1.0,
    pitch: 0,
    fallback: { provider: "", model: "" },
  });

  // ✅ Fetch AI Providers (only TTS)
  const fetchAIProviders = async () => {
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (Array.isArray(res)) {
        const ttsProviders = res.filter((p: any) => p.type?.toLowerCase() === "tts");
        setAiProviders(ttsProviders);
      }
    } catch (err) {
      console.error("❌ Error fetching AI providers:", err);
    }
  };

  // ✅ Fetch existing TTS Config (for Update)
  const fetchTTSConfig = async () => {
    try {
      helper.Showspinner();
      const res = await CommonService.GetById(agentId, "/v1/TTSConfig/GetByAgentId");
      if (res) {
        setConfigId(res.id);
        setSelectedAiProvider(res.ai_provider_id || "");
        setSelectedSubProvider(res.sub_ai_model_provider_id || "");
        setConfig(res.config_json || {
          language: "",
          voice: "",
          speaking_rate: 1.0,
          pitch: 0,
          fallback: { provider: "", model: "" },
        });

        // fetch related subproviders + languages
        if (res.ai_provider_id) await fetchSubProviders(res.ai_provider_id);
        if (res.sub_ai_model_provider_id) await fetchLanguagesBySubProvider(res.sub_ai_model_provider_id);
      } else {
        setConfigId(null);
      }
    } catch (error) {
      console.error("❌ Error fetching TTS config:", error);
    }
    helper.Hidespinner();
  };

  // ✅ Fetch Languages by Sub-AI Provider
  const fetchLanguagesBySubProvider = async (subProviderId: string) => {
    try {
      if (!subProviderId) return;
      const res = await CommonService.GetAll(
        `/v1/SubAIModelProvider/GetLanguageByModelID/${subProviderId}`
      );
      setLanguages(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("❌ Error fetching languages:", err);
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

  // ✅ On Mount
  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    Promise.all([fetchAIProviders(), fetchTTSConfig()]).finally(() => setLoading(false));
  }, [agentId]);

  // ✅ Handle AI Provider change
  const handleAiProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    setSelectedAiProvider(providerId);
    setSelectedSubProvider("");
    setSubProviders([]);
    if (providerId) fetchSubProviders(providerId);
  };

  // ✅ Handle Sub-AI Provider change
  const handleSubProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setSelectedSubProvider(subId);
    const selectedSub = subProviders.find((sp) => sp.id === subId);
    if (selectedSub?.configuration) {
      setConfig({
        ...selectedSub.configuration,
        fallback: selectedSub.configuration.fallback || { provider: "", model: "" },
      });
    }
    if (subId) fetchLanguagesBySubProvider(subId);
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

  // ✅ Save or Update configuration
  const saveConfig = async () => {
    if (!selectedAiProvider || !selectedSubProvider || !config.language) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please select AI Provider, Sub-Provider, and Language.",
      });
      return;
    }

    helper.Showspinner();

    const payload = {
      ai_provider_id: selectedAiProvider,
      sub_ai_model_provider_id: selectedSubProvider,
      agent_id: agentId,
      language_id: config.language,
      config_json: config,
    };

    try {
      if (configId) {
        // ✅ UPDATE existing config
        await CommonService.CommonPut(payload, `/v1/TTSConfig/Update/${configId}`);
        Swal.fire({ icon: "success", title: "TTS Config Updated Successfully!" });
      } else {
        // ✅ INSERT new config
        await CommonService.CommonPost(payload, "/v1/TTSConfig/Insert");
        Swal.fire({ icon: "success", title: "TTS Config Saved Successfully!" });
      }
    } catch (error) {
      console.error("❌ Save/Update Config Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Save/Update",
        text: "Something went wrong!",
      });
    }

    helper.Hidespinner();
  };

  if (loading) return <div>Loading TTS configuration...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">TTS Configuration</h3>

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
            onChange={handleSubProviderChange}
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
            value={config.language || ""}
            onChange={(e) => handleConfigChange("language", e.target.value)}
            disabled={!languages.length}
          >
            <option value="">Select Language</option>
            {languages.map((item) => (
              <option key={item.language.id} value={item.language.id}>
                {item.language.name} ({item.language.code})
              </option>
            ))}
          </select>
        </div>

        {/* Voice */}
        <div>
          <label className="block text-sm font-medium mb-1">Voice</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={config.voice || ""}
            onChange={(e) => handleConfigChange("voice", e.target.value)}
          />
        </div>

        {/* Speaking Rate */}
        <div>
          <label className="block text-sm font-medium mb-1">Speaking Rate</label>
          <input
            type="number"
            step="0.1"
            className="w-full border rounded-md px-3 py-2"
            value={config.speaking_rate || 1.0}
            onChange={(e) =>
              handleConfigChange("speaking_rate", parseFloat(e.target.value))
            }
          />
        </div>

        {/* Pitch */}
        <div>
          <label className="block text-sm font-medium mb-1">Pitch</label>
          <input
            type="number"
            step="0.1"
            className="w-full border rounded-md px-3 py-2"
            value={config.pitch || 0}
            onChange={(e) =>
              handleConfigChange("pitch", parseFloat(e.target.value))
            }
          />
        </div>

        {/* Fallback Provider */}
        <div>
          <label className="block text-sm font-medium mb-1">Fallback Provider</label>
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
          <label className="block text-sm font-medium mb-1">Fallback Model</label>
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

      <div className="flex justify-end">
        <button
          onClick={saveConfig}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {configId ? "Update TTS Config" : "Save TTS Config"}
        </button>
      </div>
    </div>
  );
};

export default TTSConfig;
