"use client";
import { useState } from "react";
import CompanyTable from "@/sections/companies/CompanyTable";

import FilterCompany from "@/components/Filter/filterCompany";
import CompanyToolbar from "@/sections/companies/CompanyToolbar";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCompanyFilter } from "@/contexts/FilterCompanyContext";
import { Suspense } from "react";
import { ChevronDownIcon } from "lucide-react";
import CreateCompany from "@/sections/companies/CreateCompany";
import { classNames } from "@/utils";

export default function Companies() {
  const [create, setCreate] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { companyFilterConfig } = useCompanyFilter();

  // Get the current query parameters
  const currentParams = Object.fromEntries(searchParams.entries());

  const handleSavedView = () => {
    // Check if the parameter exists
    if (!currentParams.targeted) {
      // Add the new query parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set("targeted", "yes");

      // Update the URL
      router.push(`${pathname}?${newParams.toString()}`);
    }
  };

  const handleTotalView = () => {
    // Check if the parameter exists
    if (currentParams.targeted) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("targeted");
      router.push(`${pathname}?${newParams.toString()}`);
    }
  };

  const handleSave = () => {};

  const handleClose = () => {
    setCreate(false);
  };

  return (
    <div className="flex p-4 gap-4 overflow-auto flex-1">
      {create && (
        <CreateCompany
          open={create}
          handleSave={handleSave}
          handleClose={handleClose}
        />
      )}
      {companyFilterConfig.isOpen && <FilterCompany />}
      <div className="card p-4 pt-7 flex-1 flex flex-col gap-2 overflow-auto shadow-lg min-w-[420px]">
        <div className="flex-1 flex flex-col gap-2 overflow-auto">
          <div className="border-b border-gray-100 flex gap-2 overflow-auto p-1">
            <button
              className={classNames(
                "pb-1 px-3 text-sm/6 font-semibold focus:outline-none hover:text-blue-400",
                currentParams.targeted
                  ? ""
                  : "border-b-2 text-blue-500 border-b-blue-500"
              )}
              onClick={() => handleTotalView()}
            >
              Total
            </button>
            <button
              className={classNames(
                "pb-1 px-3 text-sm/6 font-semibold focus:outline-none hover:text-blue-400 ",
                currentParams.targeted
                  ? "border-b-2 text-blue-500 border-b-blue-400"
                  : ""
              )}
              onClick={() => handleSavedView()}
            >
              Saved
            </button>
            <div className="flex flex-1 justify-end items-center">
              <Menu>
                <MenuButton className="btn-primary">
                  <span className="text-sm text-white">Import</span>
                  <ChevronDownIcon className="w-3 h-3 stroke-white stroke-2" />
                </MenuButton>
                <MenuItems
                  anchor="bottom end"
                  className="flex flex-col w-32 origin-top-right bg-white rounded-md shadow-md border border-white/5 text-gray-900 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-20"
                >
                  <MenuItem>
                    <button
                      className="p-2 text-sm flex w-full items-center rounded-lg data-[focus]:bg-blue-100 text-nowrap"
                      onClick={() => setCreate(true)}
                    >
                      Single Company
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="p-2 text-sm flex w-full items-center rounded-lg data-[focus]:bg-blue-100"
                      onClick={() => router.push("/contacts/import")}
                    >
                      CSV
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-auto">
            <CompanyToolbar />
            <div className="flex-1 overflow-auto flex">
              <Suspense>
                <CompanyTable />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
