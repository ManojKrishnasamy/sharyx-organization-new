import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommonService } from "../../service/commonservice.page";
import { CommonHelper } from "../../helper/helper";

const AddOrEditSubProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    ai_provider_id: "",
    model_name: "",
    configuration: "{}",
    language_ids: [] as string[],
  });
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [selectedProviderType, setSelectedProviderType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLangIds, setSelectedLangIds] = useState<string[]>([]);


  // Default configurations
  const defaultConfigs = {
    llm: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.7,
      system_prompt: "You are Mozhiva Jewellery's AI assistant for lead qualification. You will speak in a mix of Hindi and English (hi-en). Politely engage customers, confirm their interest, and collect lead details like name, product interest, and preferred contact method. Keep your tone natural and conversational.",
      conversation_mode: "voice",
      fallback: {
        retry_attempts: 2,
        default_response: "Sorry, mujhe samajh nahi aaya. Kya aap dobara bolenge?"
      }
    },
    tts: {
      provider: "cartesia",
      model: "cartesia-tts-hi-en-v1",
      voice: "female_friendly_hi_en",
      speed: 1.0,
      pitch: 1.0,
      language: "hi-en",
      format: "mp3",
      fallback: {
        provider: "gcp",
        voice: "hi-IN-Wavenet-A"
      }
    },
    stt: {
      provider: "deepgram",
      model: "deepgram-hi-en",
      language: "hi-en",
      encoding: "wav",
      sample_rate: 16000,
      noise_cancellation: true,
      fallback: {
        provider: "openai-whisper",
        model: "whisper-1"
      }
    }
  };

  // Fetch AI providers
  const fetchAIProviders = async () => {
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (Array.isArray(res)) setAiProviders(res);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchAIProviders();
    fetchLanguages();
  }, []);

  // Fetch record if editing
  useEffect(() => {
    if (id && id !== "0") {
      fetchSubProviderById(id);
    } else {
      // Reset form for new record
      setFormData({
        ai_provider_id: "",
        model_name: "",
        configuration: "{}",
        language_ids: [],
      });
      setSelectedProviderType("");
    }
  }, [id]);

  const fetchLanguages = async () => {
  try {
    const res = await CommonService.GetAll("/v1/Language/List");
    if (Array.isArray(res)) setLanguages(res);
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};


  const fetchSubProviderById = async (subId: string) => {
  try {
    setIsLoading(true);
    CommonHelper.Showspinner();

    const res = await CommonService.GetById(subId, `/v1/SubAIModelProvider/ById`);

    const langRes = await CommonService.GetAll(`/v1/SubAIModelProvider/GetLanguageByModelID/${subId}`);

    const selectedLangIds = Array.isArray(langRes)
      ? langRes.map((lang) => lang.language_id || lang.id)
      : [];

    if (res) {
      setFormData({
        ai_provider_id: res.ai_provider_id || "",
        model_name: res.model_name || "",
        configuration: JSON.stringify(res.configuration || {}, null, 2),
        language_ids: selectedLangIds,
      });

      const selectedProvider = aiProviders.find((p) => p.id === res.ai_provider_id);
      setSelectedProviderType(selectedProvider?.type || "");
    }
  } catch (error) {
    console.error("Error fetching sub provider:", error);
    CommonHelper.ErrorToaster("Failed to fetch sub-provider details");
  } finally {
    setIsLoading(false);
    CommonHelper.Hidespinner();
  }
};


  // Handle provider selection change
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    const selectedProvider = aiProviders.find(p => p.id === providerId);
    
    setFormData(prev => ({ ...prev, ai_provider_id: providerId }));
    setSelectedProviderType(selectedProvider?.type || "");
    
    // Set default configuration based on provider type
    if (selectedProvider?.type && defaultConfigs[selectedProvider.type.toLowerCase() as keyof typeof defaultConfigs]) {
      const defaultConfig = defaultConfigs[selectedProvider.type.toLowerCase() as keyof typeof defaultConfigs];
      setFormData(prev => ({
        ...prev,
        configuration: JSON.stringify(defaultConfig, null, 2)
      }));
    } else {
      // Reset configuration if no default found
      setFormData(prev => ({
        ...prev,
        configuration: "{}"
      }));
    }
  };

  // Handle configuration field changes
  const handleConfigChange = (key: string, value: any, nestedKey?: string) => {
    setFormData(prev => {
      const currentConfig = JSON.parse(prev.configuration || "{}");
      
      if (nestedKey) {
        if (!currentConfig[nestedKey]) {
          currentConfig[nestedKey] = {};
        }
        currentConfig[nestedKey][key] = value;
      } else {
        currentConfig[key] = value;
      }
      
      return {
        ...prev,
        configuration: JSON.stringify(currentConfig, null, 2)
      };
    });
  };

  // Input change handler for model name
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Save or update
  const handleSave = async () => {
    try {
      CommonHelper.Showspinner();

      const payload = {
        ai_provider_id: formData.ai_provider_id,
        model_name: formData.model_name,
        configuration: JSON.parse(formData.configuration || "{}"),
        language_ids: formData.language_ids,
      };

      let res: any;
      if (id === "0") {
        res = await CommonService.CommonPost(payload, `/v1/SubAIModelProvider/Insert`);
      } else {
        res = await CommonService.CommonPut(payload, `/v1/SubAIModelProvider/Update/${id}`);
      }

      if (res?.Type === "S") {
        CommonHelper.SuccessToaster(res.Message);
        navigate("/AISubProvider");
      } else {
        CommonHelper.ErrorToaster(res?.Message || "Failed to save sub-provider");
      }
    } catch (error) {
      console.error("Error saving sub provider:", error);
      CommonHelper.ErrorToaster("Something went wrong while saving");
    } finally {
      CommonHelper.Hidespinner();
    }
  };

  // Get current configuration
  const getCurrentConfig = () => {
    try {
      return JSON.parse(formData.configuration || "{}");
    } catch (error) {
      console.error("Error parsing configuration:", error);
      return {};
    }
  };

  // Render configuration fields based on provider type
  const renderConfigurationFields = () => {
    const config = getCurrentConfig();
    const providerType = selectedProviderType.toLowerCase();
    
    switch (providerType) {
      case "llm":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LLM Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.provider || ""}
                  onChange={(e) => handleConfigChange("provider", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.model || ""}
                  onChange={(e) => handleConfigChange("model", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.temperature || 0.7}
                  onChange={(e) => handleConfigChange("temperature", parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Conversation Mode</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={config.conversation_mode || "voice"}
                  onChange={(e) => handleConfigChange("conversation_mode", e.target.value)}
                >
                  <option value="voice">Voice</option>
                  <option value="text">Text</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">System Prompt</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 h-24"
                value={config.system_prompt || ""}
                onChange={(e) => handleConfigChange("system_prompt", e.target.value)}
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Fallback Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Retry Attempts</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.retry_attempts || 2}
                    onChange={(e) => handleConfigChange("retry_attempts", parseInt(e.target.value), "fallback")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Response</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.default_response || ""}
                    onChange={(e) => handleConfigChange("default_response", e.target.value, "fallback")}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "tts":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">TTS Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.provider || ""}
                  onChange={(e) => handleConfigChange("provider", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.model || ""}
                  onChange={(e) => handleConfigChange("model", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Voice</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.voice || ""}
                  onChange={(e) => handleConfigChange("voice", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.language || ""}
                  onChange={(e) => handleConfigChange("language", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Speed</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.speed || 1.0}
                  onChange={(e) => handleConfigChange("speed", parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pitch</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.pitch || 1.0}
                  onChange={(e) => handleConfigChange("pitch", parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={config.format || "mp3"}
                  onChange={(e) => handleConfigChange("format", e.target.value)}
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="pcm">PCM</option>
                </select>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Fallback Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fallback Provider</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.provider || ""}
                    onChange={(e) => handleConfigChange("provider", e.target.value, "fallback")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Fallback Voice</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.voice || ""}
                    onChange={(e) => handleConfigChange("voice", e.target.value, "fallback")}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "stt":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">STT Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.provider || ""}
                  onChange={(e) => handleConfigChange("provider", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.model || ""}
                  onChange={(e) => handleConfigChange("model", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.language || ""}
                  onChange={(e) => handleConfigChange("language", e.target.value)}
                />
              </div>
              
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Sample Rate</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  value={config.sample_rate || 16000}
                  onChange={(e) => handleConfigChange("sample_rate", parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={config.noise_cancellation || false}
                  onChange={(e) => handleConfigChange("noise_cancellation", e.target.checked)}
                />
                <label className="text-sm font-medium">Noise Cancellation</label>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Fallback Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fallback Provider</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.provider || ""}
                    onChange={(e) => handleConfigChange("provider", e.target.value, "fallback")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Fallback Model</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={config.fallback?.model || ""}
                    onChange={(e) => handleConfigChange("model", e.target.value, "fallback")}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            Select an AI Provider to see configuration options
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p>Loading sub-provider details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {id === "0" ? "Create Sub Provider" : "Edit Sub Provider"}
        </h2>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Provider */}
          <div>
            <label htmlFor="ai_provider_id" className="block text-sm font-medium mb-2">
              AI Provider <span className="text-red-500">*</span>
            </label>
            <select
              id="ai_provider_id"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              value={formData.ai_provider_id}
              onChange={handleProviderChange}
            >
              <option value="">Select Provider</option>
              {aiProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
            
            <span className="text-red-500 text-sm">{validationErrors["ai_provider_id"]}</span>
          </div>

          {/* Model Name */}
          <div>
            <label htmlFor="model_name" className="block text-sm font-medium mb-2">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              id="model_name"
              type="text"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g., gpt-4o-mini, cartesia-tts-hi-en-v1, deepgram-hi-en"
              value={formData.model_name}
              onChange={handleChange}
            />
            <span className="text-red-500 text-sm">{validationErrors["model_name"]}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Supported Languages <span className="text-red-500">*</span>
          </label>

          <div className="border rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto space-y-2">
            {languages.length > 0 ? (
              languages.map((lang) => (
                <label key={lang.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={formData.language_ids.includes(lang.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.language_ids, lang.id]
                        : formData.language_ids.filter((id) => id !== lang.id);
                      setFormData({ ...formData, language_ids: updated });
                    }}
                  />
                  <span className="text-sm">
                    {lang.name} <span className="text-gray-500">({lang.code})</span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">Loading languages...</p>
            )}
          </div>
        </div>


        {/* Configuration Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Configuration
          </label>
          <div className="border rounded-md p-4 bg-gray-50">
            {renderConfigurationFields()}
          </div>
        </div>

        {/* JSON Preview (hidden but still in form data) */}
        <textarea
          id="configuration"
          className="hidden"
          value={formData.configuration}
          readOnly
        />
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            {/* Cancel Button */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/AISubProvider")}
            >
              Cancel
            </button>

            {/* Create / Update Button */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {id === "0" ? "Create" : "Update"}
            </button>
          </div>

      </div>
    </div>
  );
};

export default AddOrEditSubProvider;