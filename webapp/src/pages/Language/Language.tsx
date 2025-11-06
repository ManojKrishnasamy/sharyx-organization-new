import React, { Fragment, useEffect, useState } from "react";
import IconListCheck from "../../components/Icon/IconListCheck";
import IconSearch from "../../components/Icon/IconSearch";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import IconEdit from "../../components/Icon/IconEdit";
import IconTrashLines from "../../components/Icon/icon-trash-lines";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import IconX from "../../components/Icon/IconX";
import sortBy from "lodash/sortBy";
import { CommonHelper } from "../../helper/helper";
import { CommonService } from "../../service/commonservice.page";
import Swal from "sweetalert2";

const LanguagePage = () => {
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

  const [addDialog, setAddDialog] = useState(false);
  const [LanguageData, setLanguageData] = useState<any>({});
  const [LanguageValidation, setLanguageValidation] = useState<any>({});

  const LanguageFormGroup = [
    { name: "name", validation: [{ type: "required", message: "Required" }] },
    { name: "code", validation: [{ type: "required", message: "Required" }] },
    { name: "type", validation: [{ type: "required", message: "Required" }] },
  ];

  useEffect(() => {
    fetchLanguages();
  }, [pageSize]);

  useEffect(() => {
    const filtered = allRecords.filter(
      (item: any) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.code?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.type?.toLowerCase()?.includes(search?.toLowerCase())
    );
    const sorted = sortBy(filtered, sortStatus.columnAccessor);
    const finalRecords =
      sortStatus.direction === "desc" ? sorted.reverse() : sorted;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setFilteredRecords(finalRecords.slice(from, to));
  }, [allRecords, page, pageSize, search, sortStatus]);

  const fetchLanguages = async () => {
    CommonHelper.Showspinner();
    const res = await CommonService.GetAll("/v1/Language/List");
    if (res && res.length > 0) {
      setAllRecords(res);
      setPage(1);
    } else {
      setAllRecords([]);
    }
    CommonHelper.Hidespinner();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setLanguageData((prev: any) => ({ ...prev, [id]: value }));
  };

  const editLanguage = (language: any) => {
    setLanguageData(language);
    setAddDialog(true);
  };

  const SaveOrUpdate = async () => {
    if (
      CommonHelper.FormValidation(setLanguageValidation, LanguageFormGroup, LanguageData)
    ) {
      CommonHelper.Showspinner();
      let res: any;
      const payload = {
        name: LanguageData.name,
        code: LanguageData.code,
        type: LanguageData.type,
        status: LanguageData.status ?? true,
      };

      if (LanguageData.id) {
        res = await CommonService.CommonPut(payload, `/v1/Language/Update/${LanguageData.id}`);
      } else {
        res = await CommonService.CommonPost(payload, "/v1/Language/Insert");
      }

      if (res.Type === "S") {
        fetchLanguages();
        setAddDialog(false);
        CommonHelper.SuccessToaster(res.Message);
      } else {
        CommonHelper.ErrorToaster(res.Message);
      }
      CommonHelper.Hidespinner();
    } else {
      CommonHelper.Hidespinner();
    }
  };

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
        res = await CommonService.CommonDelete(`/v1/Language/Delete/${id}`);
        if (res.Type === "S") {
          fetchLanguages();
          CommonHelper.SuccessToaster(res.Message);
        } else {
          CommonHelper.ErrorToaster(res.Message);
        }
      }
    });
  };

  return (
    <div className="panel mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl">Language List</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setLanguageData({ status: true });
              setAddDialog(true);
            }}
          >
            <IconListCheck className="ltr:mr-2 rtl:ml-2" />
            Add Language
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Language"
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

      <div className="datatables pagination-padding">
        <DataTable
          noRecordsText="No results match your search query"
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={filteredRecords}
          columns={[
            { accessor: "name", title: "Language Name", sortable: true },
            { accessor: "code", title: "Language Code", sortable: true },
            {
              accessor: "type",
              title: "Type",
              render: ({ type }) => (
                <span className="uppercase font-semibold">{type || "—"}</span>
              ),
            },
            {
              accessor: "status",
              title: "Status",
              render: ({ status }) => (
                <span
                  className={`badge ${
                    status ? "badge-outline-success" : "badge-outline-danger"
                  }`}
                >
                  {status ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              accessor: "action",
              title: "Actions",
              textAlignment: "center",
              render: (language) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <button
                    type="button"
                    className="flex text-white p-2 rounded-full bg-primary"
                    onClick={() => editLanguage(language)}
                  >
                    <IconEdit className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    className="flex text-danger p-2 rounded-full border border-danger"
                    onClick={() => Delete(language.id, language.name)}
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
          minHeight={200}
          paginationText={({ from, to, totalRecords }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`
          }
        />
      </div>

      {/* Add/Edit Dialog */}
      <Transition appear show={addDialog} as={Fragment}>
        <Dialog
          as="div"
          open={addDialog}
          onClose={() => setAddDialog(false)}
          className="relative z-50"
        >
          <TransitionChild as={Fragment}>
            <div className="fixed inset-0 bg-[black]/60" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <TransitionChild as={Fragment}>
                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setAddDialog(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                  <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 rtl:pr-5 dark:bg-[#121c2c]">
                    {LanguageData.id ? "Edit Language" : "Add Language"}
                  </div>
                  <div className="p-5">
                    <form>
                      <div className="mb-5">
                        <label htmlFor="name" className="required-label">
                          Language Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter Language Name"
                          className="form-input"
                          value={LanguageData.name || ""}
                          onChange={handleInputChange}
                        />
                        <span className="text-danger">
                          {LanguageValidation["name"]}
                        </span>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="code" className="required-label">
                          Language Code
                        </label>
                        <input
                          id="code"
                          type="text"
                          placeholder="Enter Language Code"
                          className="form-input"
                          value={LanguageData.code || ""}
                          onChange={handleInputChange}
                        />
                        <span className="text-danger">
                          {LanguageValidation["code"]}
                        </span>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="type" className="required-label">
                          Language Type
                        </label>
                        <select
                          id="type"
                          className="form-select"
                          value={LanguageData.type || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Type</option>
                          <option value="llm">LLM (Large Language Model)</option>
                          <option value="stt">STT (Speech to Text)</option>
                          <option value="tts">TTS (Text to Speech)</option>
                        </select>
                        <span className="text-danger">
                          {LanguageValidation["type"]}
                        </span>
                      </div>

                      <div className="flex items-center mb-5">
                        <input
                          id="status"
                          type="checkbox"
                          checked={LanguageData.status ?? true}
                          onChange={(e) =>
                            setLanguageData({
                              ...LanguageData,
                              status: e.target.checked,
                            })
                          }
                          className="form-checkbox"
                        />
                        <label htmlFor="status" className="ml-2">
                          Active
                        </label>
                      </div>

                      <div className="mt-8 flex items-center justify-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setAddDialog(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={SaveOrUpdate}
                        >
                          {LanguageData.id ? "Update" : "Add"}
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LanguagePage;
