import { useState, useEffect } from "react";
import { handleError, runService } from "@/utils/service_utils";
import { getUsers, sendInviteLink, UserModel } from "@/services/userService";
import {
  EllipsisHorizontalIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import InviteUser from "./InviteUser";
import { setIn } from "formik";
import { toast } from "react-toastify";

const ManageStuff = () => {
  const [users, setUsers] = useState<UserModel[]>();
  const [invite, setInvite] = useState(false);

  const fetchUsers = () => {
    runService(
      undefined,
      getUsers,
      (data) => {
        console.log("users: ", data);
        setUsers(data);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      {invite && (
        <InviteUser
          open={invite}
          handleInvite={(email: string) => {
            sendInviteLink(email);
            setInvite(false);
          }}
          handleClose={() => setInvite(false)}
        />
      )}
      <div className="p-4 flex flex-1 flex-col gap-2 rounded-md bg-white overflow-auto">
        <div className="flex justify-between items-center">
          <form action="#" method="GET" className="relative hidden md:flex ">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            />
            <input
              id="search-field"
              name="search"
              type="search"
              placeholder="Search..."
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            />
          </form>
          <div className="flex gap-4">
            <div className="px-2 py-1.5 flex justify-center items-center gap-2 border-2 border-gray-300 rounded-md hover:bg-gray-200">
              <EllipsisVerticalIcon className="w-4 h-4" />
              <span className="text-sm">Bulk Action</span>
            </div>
            <div
              className="p-2 flex-center gap-2 rounded-md bg-blue-500 hover:bg-blue-400 cursor-pointer"
              onClick={() => setInvite(true)}
            >
              <PlusCircleIcon className="w-4 h-4 stroke-white" />
              <span className="text-sm text-white">Invite User</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Last Name
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
                  Title
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white overflow-auto">
              {users &&
                users.map((user, index) => (
                  <tr key={index} className="even:bg-blue-50 hover:bg-gray-300">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 rounded-l-md">
                      {user.firstName}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                      {user.lastName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-500">
                      <Menu>
                        <MenuButton className="">
                          <div className="p-1 border rounded-md hover:bg-white">
                            <EllipsisHorizontalIcon className="w-5 h-5 stroke-gray-500" />
                          </div>
                        </MenuButton>
                        <MenuItems
                          anchor="bottom end"
                          className="flex flex-col w-20 origin-top bg-white rounded-md shadow-md border border-white/5 text-gray-900 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-20"
                        >
                          <MenuItem>
                            <button className="p-2 text-xs flex w-full items-center rounded-lg data-[focus]:bg-blue-100">
                              Edit
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button className="p-2 text-xs flex w-full items-center rounded-lg data-[focus]:bg-blue-100">
                              Delete
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageStuff;
