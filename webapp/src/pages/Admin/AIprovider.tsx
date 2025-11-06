import React, { Fragment, useEffect, useState } from "react";
import IconSearch from "../../components/Icon/IconSearch";
import IconUserPlus from "../../components/Icon/icon-user-plus";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import IconEdit from "../../components/Icon/IconEdit";
import { CommonHelper } from "../../helper/helper";
import { CommonService } from "../../service/commonservice.page";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import sortBy from "lodash/sortBy";
import IconTrashLines from "../../components/Icon/icon-trash-lines";
import IconX from "../../components/Icon/IconX";
import Swal from "sweetalert2";

const AIProvider = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  // Modal + data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Fetch AI Providers
  const fetchAIProviders = async () => {
    CommonHelper.Showspinner();
    try {
      const res = await CommonService.GetAll("/v1/AIProvider/List");
      if (res && Array.isArray(res)) {
        setAllRecords(res);
        setPage(1);
      } else {
        setAllRecords([]);
      }
    } catch (error) {
      console.error("Error fetching AI providers:", error);
      CommonHelper.ErrorToaster("Failed to fetch AI providers");
    }
    CommonHelper.Hidespinner();
  };

  useEffect(() => {
    fetchAIProviders();
  }, [pageSize]);

  // 🔹 Filter + sort logic
  useEffect(() => {
    const filtered = allRecords.filter(
      (item: any) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.base_url?.toLowerCase()?.includes(search?.toLowerCase())
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
    setSelectedProvider({
      name: "",
      type: "",
      api_key: "",
      base_url: "",
      status: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 🔹 Open Edit modal
  const openEditModal = (provider: any) => {
    setSelectedProvider({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      api_key: provider.api_key,
      base_url: provider.base_url,
      status: provider.status,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // 🔹 Save handler
  // 🔹 Save handler
const handleSaveProvider = async () => {
  if (!selectedProvider.name?.trim()) {
    CommonHelper.ErrorToaster("Provider Name is required");
    return;
  }
  if (!selectedProvider.type) {
    CommonHelper.ErrorToaster("Provider Type is required");
    return;
  }
  if (!selectedProvider.api_key?.trim()) {
    CommonHelper.ErrorToaster("API Key is required");
    return;
  }
  if (!selectedProvider.base_url?.trim()) {
    CommonHelper.ErrorToaster("Base URL is required");
    return;
  }

  try {
    let res: any;

    const payload = {
      name: selectedProvider.name,
      type: selectedProvider.type, // Add this field
      api_key: selectedProvider.api_key,
      base_url: selectedProvider.base_url,
      status: selectedProvider.status,
    };

    if (isEditing) {
      res = await CommonService.CommonPut(
        payload,
        `/v1/AIProvider/Update/${selectedProvider.id}`
      );
    } else {
      res = await CommonService.CommonPost(payload, `/v1/AIProvider/Insert`);
    }

    if (res?.Type === "S") {
      CommonHelper.SuccessToaster(res.Message);
      setIsModalOpen(false);
      fetchAIProviders();
    } else {
      CommonHelper.ErrorToaster(res?.Message || "Failed to save AI provider");
    }
  } catch (error) {
    console.error("Error saving AI provider:", error);
    CommonHelper.ErrorToaster("Something went wrong while saving AI provider");
  }
};

  // 🔹 Delete Provider
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
            res = await CommonService.CommonDelete(`/v1/AIProvider/Delete/${id}`);
            if (res.Type === "S") {
                fetchAIProviders();
                CommonHelper.SuccessToaster(res.Message);
            } else {
                CommonHelper.ErrorToaster(res.Message);
            }
            }
        });
        };

  return (
    <div className="panel mt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl">AI Provider List</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={openAddModal}
          >
            <IconUserPlus className="w-4 h-4" />
            Add Provider
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Provider"
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
              accessor: "name", 
              title: "Provider Name",
              sortable: true
            },
            { 
                accessor: "type", 
                title: "Type",
                render: (row) => (
                <span className="uppercase font-semibold">
                    {row.type || "—"}
                </span>
                )
            },
            { 
              accessor: "api_key", 
              title: "API Key",
              render: (row) => (
                <span className="font-mono text-xs">
                  {row.api_key ? `${row.api_key.substring(0, 20)}...` : "—"}
                </span>
              )
            },
            { 
              accessor: "base_url", 
              title: "Base URL",
              render: (row) => (
                <span className="text-xs truncate max-w-[200px] block">
                  {row.base_url || "—"}
                </span>
              )
            },
              {
                accessor: "action",
                title: "Actions",
                sortable: false,
                textAlignment: "center",
                render: (provider) => (
                    <div className="mx-auto flex w-max items-center gap-4">
                    <button
                        type="button"
                        className="flex text-white p-2 rounded-full bg-primary"
                        onClick={() => openEditModal(provider)}
                    >
                        <IconEdit className="h-4.5 w-4.5" />
                    </button>
                    <button
                        type="button"
                        className="flex text-danger p-2 rounded-full border border-danger"
                        onClick={() => Delete(provider.id, provider.name)}
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
            <DialogPanel className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {isEditing ? "Edit AI Provider" : "Add AI Provider"}
              </h3>

              {selectedProvider && (
                <form className="space-y-6" autoComplete="off">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Provider Name */}
                        <div>
                        <label className="block text-sm font-medium mb-1">
                            Provider Name *
                        </label>
                        <input
                            type="text"
                            className="form-input w-full"
                            placeholder="e.g., OpenAI, Claude, Gemini"
                            value={selectedProvider.name || ""}
                            onChange={(e) =>
                            setSelectedProvider({ ...selectedProvider, name: e.target.value })
                            }
                        />
                        </div>

                        {/* Provider Type */}
                        <div>
                        <label className="block text-sm font-medium mb-1">
                            Provider Type *
                        </label>
                        <select
                            className="form-select w-full"
                            value={selectedProvider.type || ""}
                            onChange={(e) =>
                            setSelectedProvider({ ...selectedProvider, type: e.target.value })
                            }
                        >
                            <option value="">Select Provider Type</option>
                            <option value="llm">LLM (Large Language Model)</option>
                            <option value="stt">STT (Speech-to-Text)</option>
                            <option value="tts">TTS (Text-to-Speech)</option>
                        </select>
                        </div>

                        {/* API Key */}
                        <div>
                        <label className="block text-sm font-medium mb-1">
                            API Key *
                        </label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="form-input w-full"
                            placeholder="Enter API key"
                            value={selectedProvider.api_key || ""}
                            onChange={(e) =>
                            setSelectedProvider({ ...selectedProvider, api_key: e.target.value })
                            }
                        />
                        </div>

                        {/* Base URL */}
                        <div>
                        <label className="block text-sm font-medium mb-1">
                            Base URL *
                        </label>
                        <input
                            type="url"
                            className="form-input w-full"
                            placeholder="https://api.example.com/v1"
                            value={selectedProvider.base_url || ""}
                            onChange={(e) =>
                            setSelectedProvider({ ...selectedProvider, base_url: e.target.value })
                            }
                        />
                        </div>
                    </div>
                    </form>
              )}

              <div className="mt-6 flex justify-end gap-3">
                 <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                    >
                    <IconX />
                    </button>
                    {/* Cancel Button */}
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
                  onClick={handleSaveProvider}
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

export default AIProvider;