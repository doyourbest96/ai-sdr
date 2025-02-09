"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getPhones, PhoneProps, setupPhone } from "@/services/phoneService";
import { handleError, runService } from "@/utils/service_utils";
import { toast } from "react-toastify";

const SetupPhone = () => {
  const [start, setStart] = useState<boolean>(false);
  const { me, setMe } = useAuth();
  const [phones, setPhones] = useState<PhoneProps[]>([]);

  useEffect(() => {
    runService(
      undefined,
      getPhones,
      (data) => {
        setPhones(data);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  }, []);

  const handleSetupPhone = (phone: PhoneProps) => {
    runService(
      phone.id,
      setupPhone,
      (data) => {
        if (data.id) {
          toast.success("Phone number setup successfully");
          setMe({ ...me, phone: `${phone.phoneNumber}` });
        }
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  return (
    <div className="p-4 flex flex-1 justify-center items-center gap-2 text-sm">
      {!start ? (
        <div className="max-w-4xl p-4 flex flex-col items-center">
          <Image
            className="m-4"
            src={"/assets/images/icon/phoneadd.png"}
            alt={"nodata"}
            width={120}
            height={120}
          />
          <p className="text-lg">No phone number set up</p>
          <p className="text-gray-700">Get a phone number to start calling</p>
          <button className="btn-primary mt-4" onClick={() => setStart(true)}>
            Set up phone number
          </button>
        </div>
      ) : (
        <div className="max-w-4xl p-4 flex flex-col gap-4 rounded-lg shadow-lg bg-white">
          <p className="text-lg">Get New VoIP Phone Number</p>
          <hr />
          <p className="text-gray-700">
            Select a local phone number from the list below.
          </p>
          <p className="text-gray-700">
            Alternatively, enter a three-digit US area code to find a local
            number. If you're calling from outside the US, enter the ISO Alpha-2
            country code of your location.
          </p>

          <div className="relative flex flex-row items-center gap-4">
            <input
              type="text"
              name="phone"
              id="phone"
              className="input-primary"
            />
            <Button variant="outline" className="flex items-center" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <hr />
          <table className="border rounded-md ">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {phones.map((phone, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 fill-green-500 stroke-white" />
                      <p>{phone.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleSetupPhone(phone);
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SetupPhone;
