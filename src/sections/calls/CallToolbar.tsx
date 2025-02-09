import { useCallFilter } from "@/contexts/FilterCallContext";
import { CallStatistics } from "@/services/callService";
import { classNames } from "@/utils";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CallToolbar = ({ statistics }: { statistics: CallStatistics }) => {
  const path = usePathname();
  const currentParams = Object.fromEntries(useSearchParams());
  const { callFilterConfig, setCallFilterConfig } = useCallFilter();

  return (
    <div className="flex justify-between items-center gap-2 p-1">
      <button
        className="btn-secondary"
        onClick={() => {
          setCallFilterConfig((prev) => ({
            ...prev,
            isOpen: !prev.isOpen,
          }));
        }}
      >
        <AdjustmentsHorizontalIcon className="w-4 h-4" />
        <span className="text-sm">
          {callFilterConfig.isOpen ? "Hide Filters" : "Show Filters"}
        </span>
      </button>
      <div></div>
      <div className="flex gap-2 overflow-auto">
        {Object.entries(statistics).map(([key, count]) => (
          <Link key={key} href={`${path}?${key}=true`}>
            <div
              className={classNames(
                "min-w-20 py-1 flex flex-col text-xs text-center text-nowrap cursor-pointer border-b",
                currentParams[key]
                  ? "border-b-blue-500 bg-gray-100"
                  : "hover:bg-gray-100 hover:border-b-blue-500"
              )}
              onClick={() =>
                setCallFilterConfig((prev) => ({
                  ...prev,
                  params: { [key]: "true" },
                }))
              }
            >
              <span className="text-inherit">{count}</span>
              <span className="text-inherit capitalize">
                {key
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CallToolbar;
