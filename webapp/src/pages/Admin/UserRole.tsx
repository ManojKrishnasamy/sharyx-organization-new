import React, { Fragment, useEffect, useState } from "react";
import IconUserPlus from "../../components/Icon/icon-user-plus";
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

const UserRolePage = () => {
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

  const [addRoleDialog, setAddRoleDialog] = useState(false);
  const [RoleData, setRoleData] = useState<any>({});
  const [RoleValidation, setRoleValidation] = useState<any>({});

  const RoleFormGroup = [
    {
      name: "name",
      validation: [{ type: "required", message: "Required" }],
    },
    {
      name: "code",
      validation: [{ type: "required", message: "Required" }],
    },
  ];

  useEffect(() => {
    fetchUserRoles();
  }, [pageSize]);

  useEffect(() => {
    const filtered = allRecords.filter((item: any) =>
      item?.name?.toLowerCase()?.includes(search?.toLowerCase())
    );
    const sorted = sortBy(filtered, sortStatus.columnAccessor);
    const finalRecords =
      sortStatus.direction === "desc" ? sorted.reverse() : sorted;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setFilteredRecords(finalRecords.slice(from, to));
  }, [allRecords, page, pageSize, search, sortStatus]);

  const fetchUserRoles = async () => {
    CommonHelper.Showspinner();
    const res = await CommonService.GetAll("/v1/UserRole/List");
    if (res.length > 0) {
      setAllRecords(res);
      setPage(1);
    } else {
      setAllRecords([]);
    }
    CommonHelper.Hidespinner();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRoleData((prev: any) => ({ ...prev, [id]: value }));
  };

  const editRole = async (role: any) => {
    setRoleData(role);
    setAddRoleDialog(true);
  };

  const Saveorupdate = async () => {
    if (
      CommonHelper.FormValidation(setRoleValidation, RoleFormGroup, RoleData)
    ) {
      CommonHelper.Showspinner();
      let res: any;
      if (RoleData.id) {
        res = await CommonService.CommonPut(
          RoleData,
          `/v1/UserRole/Update/${RoleData.id}`
        );
      } else {
        const payload = {
          name: RoleData.name,
          code: RoleData.code,
        };
        res = await CommonService.CommonPost(payload, "/v1/UserRole/Insert");
      }

      if (res.Type === "S") {
        fetchUserRoles();
        setAddRoleDialog(false);
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
        res = await CommonService.CommonDelete(`/v1/UserRole/Delete/${id}`);
        if (res.Type === "S") {
          fetchUserRoles();
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
        <h2 className="text-xl">User Role List</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setRoleData({});
              setAddRoleDialog(true);
            }}
          >
            <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
            Add Role
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Role"
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
            { accessor: "name", title: "Role Name", sortable: true },
            { accessor: "code", title: "Role Code", sortable: true },
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
              sortable: false,
              textAlignment: "center",
              render: (role) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <button
                    type="button"
                    className="flex text-white p-2 rounded-full bg-primary"
                    onClick={() => editRole(role)}
                  >
                    <IconEdit className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    className="flex text-danger p-2 rounded-full border border-danger"
                    onClick={() => Delete(role.id, role.name)}
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
      <Transition appear show={addRoleDialog} as={Fragment}>
        <Dialog
          as="div"
          open={addRoleDialog}
          onClose={() => setAddRoleDialog(false)}
          className="relative z-50"
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setAddRoleDialog(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                  <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 rtl:pr-5 dark:bg-[#121c2c]">
                    {RoleData.id ? "Edit Role" : "Add Role"}
                  </div>
                  <div className="p-5">
                    <form>
                      <div className="mb-5">
                        <label htmlFor="name" className="required-label">
                          Role Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter Role Name"
                          className="form-input"
                          value={RoleData.name || ""}
                          onChange={handleInputChange}
                        />
                        <span className="text-danger">
                          {RoleValidation["name"]}
                        </span>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="code" className="required-label">
                          Role Code
                        </label>
                        <input
                          id="code"
                          type="text"
                          placeholder="Enter Role Code"
                          className="form-input"
                          value={RoleData.code || ""}
                          onChange={handleInputChange}
                        />
                        <span className="text-danger">
                          {RoleValidation["code"]}
                        </span>
                      </div>

                      <div className="mt-8 flex items-center justify-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => setAddRoleDialog(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={Saveorupdate}
                        >
                          {RoleData.id ? "Update" : "Add"}
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

export default UserRolePage;
