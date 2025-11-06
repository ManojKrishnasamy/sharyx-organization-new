import React, { Fragment, useEffect, useState } from "react";
import IconSearch from "../../components/Icon/IconSearch";
import IconUserPlus from "../../components/Icon/icon-user-plus";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import IconEdit from "../../components/Icon/IconEdit";
import { CommonHelper } from "../../helper/helper";
import { CommonService } from "../../service/commonservice.page";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import sortBy from "lodash/sortBy";

const AgentListPage = () => {

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchAgentList();
  }, [pageSize]);

  useEffect(() => {
    const filtered = allRecords.filter(
      (item: any) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item?.secure_id?.toLowerCase()?.includes(search?.toLowerCase())
    );

    const sorted = sortBy(filtered, sortStatus.columnAccessor);
    const finalRecords =
      sortStatus.direction === "desc" ? sorted.reverse() : sorted;

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setFilteredRecords(finalRecords.slice(from, to));
  }, [allRecords, page, pageSize, search, sortStatus]);

  
  const fetchAgentList = async () => {
    CommonHelper.Showspinner();
    try {
      const res = await CommonService.GetAll("/v1/Agent/List");
      console.log("values", JSON.stringify(res));

      if (Array.isArray(res)) {
        setAllRecords(res);
        setPage(1);
      } else {
        setAllRecords([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllRecords([]);
    }
    CommonHelper.Hidespinner();
  };

  return (
    <div className="panel mt-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl">Agent List</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate("/AddOrEditAgentPage")}
        >
          <IconUserPlus className="w-4 h-4" />
          Add Agent
        </button>


          <div className="relative">
            <input
              type="text"
              placeholder="Search Agent"
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
            { accessor: "name", title: "Name" },
            { accessor: "secure_id", title: "Secure ID" },
            { accessor: "id", title: "Agent ID" },
            // { accessor: "status", title: "Status" },
            // {
            //   accessor: "created_on",
            //   title: "Created On",
            //   render: (row) => new Date(row.created_on).toLocaleString(),
            // },
          {
            accessor: "action",
            title: "Action",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex text-white p-2 rounded-full bg-primary"
                  onClick={() => navigate(`/AddOrEditAgentPage/${row.id}`)}
                >
                  <IconEdit className="h-4.5 w-4.5" />
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
    </div>
  );
};

export default AgentListPage;
