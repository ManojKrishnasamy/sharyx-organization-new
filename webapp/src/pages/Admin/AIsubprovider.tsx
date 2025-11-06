import React, { Fragment, useEffect, useState } from "react";
import IconSearch from "../../components/Icon/IconSearch";
import IconUserPlus from "../../components/Icon/icon-user-plus";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import IconEdit from "../../components/Icon/IconEdit";
import IconTrashLines from "../../components/Icon/icon-trash-lines";
import { CommonHelper } from "../../helper/helper";
import { CommonService } from "../../service/commonservice.page";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import IconX from "../../components/Icon/IconX";
import sortBy from "lodash/sortBy";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AISubProvider = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "model_name",
    direction: "asc",
  });

  // Modal + data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const navigate = useNavigate();

  // Form validation rules
  const modelFormGroup = [
    {
      name: "model_name",
      validation: [{ type: "required", message: "Model Name is required" }],
    },
    {
      name: "ai_provider_id",
      validation: [{ type: "required", message: "AI Provider is required" }],
    },
  ];

  // 🔹 Fetch AI Providers for dropdown
  const fetchAIProviders = async () => {
    
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (res && Array.isArray(res)) {
        setAiProviders(res);
      }
    } catch (error) {
      console.error("Error fetching AI providers:", error);
    }
  };

  // 🔹 Fetch Sub AI Models
  const fetchSubAIModels = async () => {
    
    CommonHelper.Showspinner();
    try {
      const res = await CommonService.GetAll("/v1/SubAIModelProvider/List");
      if (res && Array.isArray(res)) {
        setAllRecords(res);
        setPage(1);
      } else {
        setAllRecords([]);
      }
    } catch (error) {
      console.error("Error fetching sub AI models:", error);
      CommonHelper.ErrorToaster("Failed to fetch AI models");
    }
    CommonHelper.Hidespinner();
  };

  useEffect(() => {
    
    fetchSubAIModels();
    fetchAIProviders();
  }, [pageSize]);

  // 🔹 Filter + sort logic
  useEffect(() => {
    
    const filtered = allRecords.filter(
      (item: any) =>
        item?.model_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.ai_provider?.name?.toLowerCase()?.includes(search?.toLowerCase())
    );

    const sorted = sortBy(filtered, sortStatus.columnAccessor);
    const finalRecords =
      sortStatus.direction === "desc" ? sorted.reverse() : sorted;

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setFilteredRecords(finalRecords.slice(from, to));
  }, [allRecords, page, pageSize, search, sortStatus]);

  // 🔹 Open Add modal
  const openAddModal = () => {
    setSelectedModel({
      model_name: "",
      ai_provider_id: "",
      configuration: {},
      status: true,
    });
    setIsEditing(false);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // 🔹 Open Edit modal
  const openEditModal = (model: any) => {
    setSelectedModel({
      id: model.id,
      model_name: model.model_name,
      ai_provider_id: model.ai_provider_id,
      configuration: model.configuration || {},
      status: model.status,
    });
    setIsEditing(true);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // 🔹 Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSelectedModel((prev: any) => ({ ...prev, [id]: value }));
  };

  // 🔹 Save handler
  const handleSaveModel = async () => {
    if (CommonHelper.FormValidation(setValidationErrors, modelFormGroup, selectedModel)) {
      CommonHelper.Showspinner();
      try {
        let res: any;

        const payload = {
          model_name: selectedModel.model_name,
          ai_provider_id: selectedModel.ai_provider_id,
          configuration: selectedModel.configuration,
          status: selectedModel.status,
        };

        if (isEditing) {
          res = await CommonService.CommonPut(
            payload,
            `/v1/SubAIModelProvider/Update/${selectedModel.id}`
          );
        } else {
          res = await CommonService.CommonPost(payload, `/v1/SubAIModelProvider/Insert`);
        }

        if (res?.Type === "S") {
          CommonHelper.SuccessToaster(res.Message);
          setIsModalOpen(false);
          fetchSubAIModels();
        } else {
          CommonHelper.ErrorToaster(res?.Message || "Failed to save AI model");
        }
      } catch (error) {
        console.error("Error saving AI model:", error);
        CommonHelper.ErrorToaster("Something went wrong while saving AI model");
      }
      CommonHelper.Hidespinner();
    }
  };

  // 🔹 Delete handler
  const Delete = async (id: any, name: any) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `You want to delete ${name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      padding: "2em",
      customClass: { popup: "sweet-alerts" },
    }).then(async (result) => {
      if (result.value) {
        let res: any;
        res = await CommonService.CommonDelete(`/v1/SubAIModelProvider/Delete/${id}`);
        if (res.Type === "S") {
          fetchSubAIModels();
          CommonHelper.SuccessToaster(res.Message);
        } else {
          CommonHelper.ErrorToaster(res.Message);
        }
      }
    });
  };


  const NavigatePage = (id: string) =>{
      navigate('/AddOrEditSubProvider/' + id);
  }

  return (

    <div className="panel mt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl">AI Model List</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={() => NavigatePage('0')}
          >
            <IconUserPlus className="w-4 h-4" />
            Add Model
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Model"
              className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]"
            >
              <IconSearch className="mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="datatables pagination-padding">
        <DataTable
          noRecordsText="No results match your search query"
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={filteredRecords}
          columns={[
 
  {
    accessor: "ai_provider_id",
    title: "AI Provider",
    render: (row) => {
      // Comprehensive provider name lookup
      if (row?.ai_provider?.name) {
        return `${row.ai_provider.name} (${row.ai_provider.type})`;
      }
      
      // Fallback to provider list lookup
      const provider = aiProviders.find(p => p.id === row.ai_provider_id);
      if (provider) {
        return `${provider.name} (${provider.type})`;
      }
      
      // Final fallback
      return row.providerName || "—";
    },
    sortable: true
  },
   { 
    accessor: "model_name", 
    title: "Model Name",
    sortable: true
  },
  {
    accessor: "action",
    title: "Actions",
    sortable: false,
    textAlignment: "center",
    render: (model) => (
      <div className="mx-auto flex w-max items-center gap-4">
        <button
          type="button"
          className="flex text-white p-2 rounded-full bg-primary"
          onClick={() => NavigatePage(model.id)}
        >
          <IconEdit className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="flex text-danger p-2 rounded-full border border-danger"
          onClick={() => Delete(model.id, model.model_name)}
        >
          <IconTrashLines className="h-4.5 w-4.5" />
        </button>
      </div>
    ),
  },
]}
          totalRecords={allRecords.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={setPage}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </div>

      {/* Add/Edit Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <TransitionChild as={Fragment}>
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-lg">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
              >
                <IconX />
              </button>
              
              <h3 className="text-lg font-semibold mb-4">
                {isEditing ? "Edit AI Model" : "Add AI Model"}
              </h3>

              {selectedModel && (
                <form className="space-y-6" autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="model_name" className="block text-sm font-medium mb-1 required-label">
                        Model Name *
                      </label>
                      <input
                        id="model_name"
                        type="text"
                        className="form-input w-full"
                        placeholder="e.g., gpt-4, claude-3, gemini-pro"
                        value={selectedModel.model_name || ""}
                        onChange={handleInputChange}
                      />
                      <span className="text-danger text-sm">
                        {validationErrors["model_name"]}
                      </span>
                    </div>

                    {/* AI Provider */}
                    <div className="md:col-span-2">
                      <label htmlFor="ai_provider_id" className="block text-sm font-medium mb-1 required-label">
                        AI Provider *
                      </label>
                      <select
                        id="ai_provider_id"
                        className="form-select w-full"
                        value={selectedModel.ai_provider_id || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select AI Provider</option>
                        {aiProviders.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name} ({provider.type})
                          </option>
                        ))}
                      </select>
                      <span className="text-danger text-sm">
                        {validationErrors["ai_provider_id"]}
                      </span>
                    </div>

                    {/* Configuration JSON */}
                    <div className="md:col-span-2">
                    <label htmlFor="configuration" className="block text-sm font-medium mb-1">
                        Configuration
                    </label>
                    <input
                        id="configuration"
                        type="text"
                        className="form-input w-full"
                        placeholder="Enter configuration details"
                        value={selectedModel.configuration || ""}
                        onChange={handleInputChange}
                    />
                    </div>

                    {/* Status toggle */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="status"
                        checked={selectedModel.status || false}
                        onChange={(e) =>
                          setSelectedModel({ ...selectedModel, status: e.target.checked })
                        }
                        className="form-checkbox"
                      />
                      <label htmlFor="status" className="cursor-pointer text-sm">
                        Active
                      </label>
                    </div>
                  </div>
                </form>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveModel}
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AISubProvider;