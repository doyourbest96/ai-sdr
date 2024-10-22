import { useCallFilter } from "@/contexts/FilterCallContext";
import { CallStatistics } from "@/services/callService";
import { classNames } from "@/utils";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const CallToolbar = () => {
  const path = usePathname();
  const currentParams = Object.fromEntries(useSearchParams());
  const { callFilterConfig, setCallFilterConfig } = useCallFilter();
  const [statistics, setStatistics] = useState<CallStatistics>({
    total: 0,
    active: 0,
    no_answer: 0,
    left_voicemail: 0,
    busy: 0,
    gatekeeper: 0,
    connected: 0,
    no_deposition: 0,
  });

  // const fetchStatistics = () => {
  //   runService(
  //     undefined,
  //     getCallStatistics,
  //     (data) => {
  //       setStatistics(data);
  //     },
  //     (status, error) => {
  //       console.log(status, error);
  //       handleError(status, error);
  //     }
  //   );
  // };

  // useEffect(() => {
  //   fetchStatistics();
  // }, []);

  return (
    <div className="flex items-center gap-2">
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
      <div className="flex gap-2 overflow-auto">
        {Object.entries(statistics).map(([key, count]) => (
          <Link key={key} href={`${path}?${key}=true`}>
            <div
              className={classNames(
                "w-24 min-w-20 py-1 flex flex-col text-xs text-center cursor-pointer border-b",
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
