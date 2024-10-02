import CheckBox from "@/components/extends/CheckBox";
import { useLeadFilter } from "@/contexts/FilterLeadContext";
import { useLeadSelection } from "@/contexts/LeadSelectionContext";
import { contain } from "@/utils/string";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/extends/Pagination/Pagination";
import { CountModel, LeadProps } from "@/types";
import { handleError, runService } from "@/utils/service_utils";
import {
  getLeads,
  getLeadTotalCount,
  LeadModelWithCompanyModel,
} from "@/services/leadService";
import Link from "next/link";
import LeadOverview from "./LeadOverview";

const LeadTable = () => {
  const { leadFilterConfig } = useLeadFilter();
  const {
    totalLeads,
    setTotalLeads,
    savedLeads,
    setSavedLeads,
    selectedLeads,
    setSelectedLeads,
  } = useLeadSelection();

  const [overview, setOverview] = useState(false);
  const [selected, setSelected] = useState<LeadModelWithCompanyModel>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [allSelected, setAllSelected] = useState(false);
  const searchParams = useSearchParams();

  const fetchLeads = (targeted: boolean = false) => {
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    runService(
      {
        offset,
        limit,
        targeted,
        jobTitle: leadFilterConfig.title,
        companyName: leadFilterConfig.company,
        location: leadFilterConfig.location,
        industry: leadFilterConfig.industry,
      },
      getLeads,
      (data) => {
        console.log("leads data", data);
        setTotalLeads([...data]); // if total changed, leads will update
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  const fetchTotalCount = (targeted: boolean = false) => {
    runService(
      {
        targeted,
        jobTitle: leadFilterConfig.title,
        companyName: leadFilterConfig.company,
        location: leadFilterConfig.location,
        industry: leadFilterConfig.industry,
      },
      getLeadTotalCount,
      (data: CountModel) => {
        setTotalCount(data?.count ? data?.count : 0);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  useEffect(() => {
    fetchTotalCount();
    fetchLeads();
  }, []);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams);
    if (currentParams.targeted) {
      fetchTotalCount(true);
      fetchLeads(true);
    } else {
      fetchTotalCount();
      fetchLeads(false);
    }
  }, [leadFilterConfig, searchParams, currentPage, pageSize]);

  const handleAllSelected = (id: any, checked: boolean) => {
    if (checked) {
      setSelectedLeads(totalLeads.map((lead: any) => lead));
    } else {
      setSelectedLeads([]);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto">
        <LeadOverview
          show={overview}
          lead={selected}
          handleClose={() => setOverview(false)}
        />
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-300 overflow-auto">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                >
                  <div className="flex gap-2">
                    <CheckBox
                      id="All Selection"
                      content=""
                      checked={allSelected}
                      onChange={(id, checked) => {
                        handleAllSelected(id, checked);
                        setAllSelected(!allSelected);
                      }}
                    />{" "}
                    Name
                  </div>
                </th>
                {/* <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th> */}
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Current Location
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Company Location
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Employees
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Industry
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {totalLeads.map((lead: LeadModelWithCompanyModel) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer even:bg-blue-50 hover:bg-gray-300 "
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 rounded-l-md">
                    <div className="flex gap-2">
                      <CheckBox
                        id={lead.id}
                        key={lead.id}
                        content=""
                        value={lead}
                        checked={selectedLeads.find(
                          (itemLead: any) => itemLead.id === lead.id
                        )}
                        onChange={(changedLead, checked) => {
                          if (!checked) {
                            setSelectedLeads(
                              selectedLeads.filter(
                                (lead: any) => changedLead.id !== lead.id
                              )
                            );
                          } else {
                            console.log(checked);
                            setSelectedLeads([...selectedLeads, changedLead]);
                          }
                        }}
                      />
                      <span
                        className="hover:underline hover:text-blue-500"
                        onClick={() => {
                          setSelected(lead);
                          setOverview(true);
                        }}
                      >
                        {lead.firstName} {lead.lastName}
                      </span>
                    </div>
                  </td>
                  {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                    {lead.name}
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <a
                      className="hover:underline hover:text-blue-900"
                      href={`companies/${lead.company?.id}`}
                    >
                      {lead.company?.name}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.company?.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.company?.size}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lead.company?.industry}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end px-16">
          <Pagination
            className="pagination-bar"
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(pageSize: number, currentPage: number) => {
              setPageSize(pageSize);
              setCurrentPage(currentPage);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LeadTable;
