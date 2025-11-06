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

const UserPage = () => {

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "first_name",
    direction: "asc",
  });

  // Modal + data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  // 🔹 Fetch roles for dropdown
  const fetchUserRoles = async () => {
    try {
      const res = await CommonService.GetAll("/v1/UserRole/List");
      if (res && Array.isArray(res)) {
        setUserRoles(res);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // 🔹 Fetch users
  const fetchUserList = async () => {
    // CommonHelper.Showspinner();
    try {
      const res = await CommonService.GetAll("/v1/User/List");
      if (res && Array.isArray(res)) {
        setAllRecords(res);
        setPage(1);
      } else {
        setAllRecords([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    CommonHelper.Hidespinner();
  };

  useEffect(() => {
    fetchUserList();
    fetchUserRoles();
  }, [pageSize]);

  // 🔹 Filter + sort logic
  useEffect(() => {
    const filtered = allRecords.filter(
      (item: any) =>
        item?.first_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.email?.toLowerCase()?.includes(search?.toLowerCase())
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
    setSelectedUser({
      first_name: "",
      email: "",
      user_role_id: "",
      status: true,
      password: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // 🔹 Open Edit modal
const openEditModal = (user: any) => {
  setSelectedUser({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name || "",
    email: user.email,
    mobile: user.mobile || "",
    user_role_id: user.user_role?.id || "",
    status: user.status,
    // 👇 make sure password fields are cleared
    password: "",
    confirm_password: undefined,
  });
  setIsEditing(true);
  setIsModalOpen(true);
};


  // 🔹 Save handler
const handleSaveUser = async () => {
  if (!selectedUser.first_name?.trim()) {
    CommonHelper.ErrorToaster("First Name is required");
    return;
  }
  if (!selectedUser.email?.trim()) {
    CommonHelper.ErrorToaster("Email is required");
    return;
  }
  if (!selectedUser.user_role_id) {
    CommonHelper.ErrorToaster("Please select a role");
    return;
  }

  if (!isEditing) {
    const password = selectedUser.password?.trim();
    const confirmPassword = selectedUser.confirm_password?.trim();

    if (!password) {
      CommonHelper.ErrorToaster("Password is required");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      CommonHelper.ErrorToaster(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      CommonHelper.ErrorToaster("Passwords do not match");
      return;
    }
  }

  try {
    let res: any;

    const payload: any = {
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name || null,
      email: selectedUser.email,
      user_role_id: selectedUser.user_role_id,
      mobile: selectedUser.mobile || null,
      status: selectedUser.status,
    };

    if (isEditing) {
      // add a fallback password ONLY for update
      payload.password = selectedUser.password || "Temp@123";
      res = await CommonService.CommonPut(
        payload,
        `/v1/User/Update/${selectedUser.id}`
      );
    } else {
      payload.password = selectedUser.password;
      res = await CommonService.CommonPost(payload, `/v1/User/Insert`);
    }

    if (res?.Type === "S") {
      CommonHelper.SuccessToaster(res.Message);
      setIsModalOpen(false);
      fetchUserList();
    } else {
      CommonHelper.ErrorToaster(res?.Message || "Failed to save user");
    }
  } catch (error) {
    console.error("Error saving user:", error);
    CommonHelper.ErrorToaster("Something went wrong while saving user");
  }
};

// 🔹 Activate or Suspend User
const handleToggleStatus = async (user: any) => {
  try {
    const newStatus = !user.status; // true → deactivate, false → activate
    const res = await CommonService.CommonPatch(
      {},
      `/v1/User/SuspendOrActivate/${user.id}`
    );
    console.log("hello",JSON.stringify(res))

    if (res?.Type === "S") {
      CommonHelper.SuccessToaster(
        newStatus ? "User Activated Successfully" : "User Suspended Successfully"
      );
      fetchUserList();
    } else {
      CommonHelper.ErrorToaster(res?.Message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    CommonHelper.ErrorToaster("Something went wrong while updating status");
  }
};



  return (
    <div className="panel mt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl">{("User List")}</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={openAddModal}
          >
            <IconUserPlus className="w-4 h-4" />
            {("Add User")}
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder={("Search User")}
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
          noRecordsText={("No results match your search query")}
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={filteredRecords}
          columns={[
            { accessor: "first_name", title: ("Name") },
            { accessor: "email", title: ("Email") },
            {
              accessor: "user_role",
              title: ("Role"),
              render: (row) => row.user_role?.name || "—",
            },
            {
              accessor: "status",
              title: ("Status"),
              render: (row) =>
                row.status ? (
                  <span className="text-green-500 font-semibold">Active</span>
                ) : (
                  <span className="text-red-500 font-semibold">Inactive</span>
                ),
            },
            {
            accessor: "action",
            title: "Action",
            render: (row) => (
              <div className="flex gap-2">
                {/* ✏️ Edit Button */}
                <button
                  type="button"
                  className="flex text-white p-2 rounded-full bg-primary"
                  onClick={() => openEditModal(row)}
                >
                  <IconEdit className="h-4.5 w-4.5" />
                </button>

                {/* 🔁 Activate / Suspend Button */}
                <button
                  type="button"
                  className={`flex items-center text-white p-2 rounded-full ${
                    row.status ? "bg-red-500" : "bg-green-500"
                  }`}
                  onClick={() => handleToggleStatus(row)}
                >
                  {row.status ? "Suspend" : "Activate"}
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
                {isEditing ? ("Edit User") : ("Add User")}
              </h3>

              {selectedUser && (
                <form className="space-y-6" autoComplete="off">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">{("First Name")}</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={selectedUser.first_name || ""}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, first_name: e.target.value })
                        }
                      />
                    </div>

                    {/* Last Name (only for add user or edit user if you added this field) */}
                    <div>
                      <label className="block text-sm font-medium mb-1">{("Last Name")}</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={selectedUser.last_name || ""}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, last_name: e.target.value })
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">{("Email")}</label>
                      <input
                        type="email"
                        autoComplete="new-email"
                        className="form-input w-full"
                        value={selectedUser.email || ""}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, email: e.target.value })
                        }
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium mb-1">{("Mobile Number")}</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={selectedUser.mobile || ""}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, mobile: e.target.value })
                        }
                      />
                    </div>

                    {/* Role dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-1">{("Role")}</label>
                      <select
                        className="form-select w-full"
                        value={selectedUser.user_role_id}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            user_role_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Role</option>
                        {userRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Password (only for add user) */}
                    {!isEditing && (
                      <div>
                        <label className="block text-sm font-medium mb-1">{("Password")}</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          className="form-input w-full"
                          value={selectedUser.password || ""}
                          onChange={(e) =>
                            setSelectedUser({ ...selectedUser, password: e.target.value })
                          }
                        />
                      </div>
                    )}

                    {/* Confirm Password (only for add user) */}
                    {!isEditing && (
                      <div>
                        <label className="block text-sm font-medium mb-1">{("Confirm Password")}</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          className="form-input w-full"
                          value={selectedUser.confirm_password || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Status toggle - single full-width row */}
                  {/* <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedUser.status}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, status: e.target.checked })
                      }
                    />
                    <label>{t("Active")}</label>
                  </div> */}
                </form>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  {("Cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveUser}
                >
                  {isEditing ? ("Update") : ("Create")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserPage;
