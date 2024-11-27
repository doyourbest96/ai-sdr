/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";

import { getMe, UserModel } from "@/services/userService";
import { handleError, runService } from "@/utils/service_utils";

interface TwilioContextType {
  device: any;
  incomingConnection: any;
  outgoingConnection: any;
  twilioLogs: string[];
  callStatus: string;
  callDuration: number;

  addTwilioLog: (log: string) => void;
  setTwilioLogs: (logs: string[]) => void;
  handleCallOut: (number: string) => void;
  handleHangUp: () => void;
  handleAcceptCall: () => void;
  handleRejectCall: () => void;
}

const TwilioContext = createContext<TwilioContextType | undefined>(undefined);

export function TwilioProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel>();
  const [device, setDevice] = useState<any>(null);
  const [callStatus, setCallStatus] = useState("init");
  const [incomingConnection, setIncomingConnection] = useState<any>(null);
  const [outgoingConnection, setOutgoingConnection] = useState<any>(null);
  const [twilioLogs, setTwilioLogs] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const callStartTime = useRef<number | null>(null);
  const callDurationInterval = useRef<NodeJS.Timeout | null>(null);

  const addTwilioLog = (log: string) => {
    // setTwilioLogs((prevLogs) => [...prevLogs, log]);
    console.log(log);
  };

  const handleCallOut = (number: string) => {
    if (!device || !user?.phone || callStatus !== "ready") return;

    addTwilioLog(`Calling ${number}...`);

    const params = {
      To: number,
      From: user?.phone,
    };

    const newConn = device.connect(params);

    newConn.on("ringing", () => {
      setCallStatus("outgoing");
      addTwilioLog("Ringing...");
    });

    newConn.on("reject", () => {
      setCallStatus("ready");
      addTwilioLog("Rejected!");
    });

    newConn.on("disconnect", () => {
      setCallStatus("ready");
      addTwilioLog("Disconnected.");
      outgoingConnection?.disconnect();
    });

    setOutgoingConnection(newConn);
    setCallStatus("outgoing");
  };

  const handleHangUp = () => {
    incomingConnection?.disconnect();
    outgoingConnection?.disconnect();

    setCallStatus("ready");
  };

  const handleAcceptCall = () => {
    if (incomingConnection) {
      incomingConnection.accept();
      setCallStatus("connected");
      addTwilioLog("Call Accepted!");
    }
  };

  const handleRejectCall = () => {
    incomingConnection?.reject();

    addTwilioLog("Rejected call...");
    setCallStatus("ready");
  };

  useEffect(() => {
    if (callStatus === "connected") {
      if (callStartTime.current === null) {
        callStartTime.current = Date.now();
      }
      if (!callDurationInterval.current) {
        callDurationInterval.current = setInterval(() => {
          setCallDuration(
            Math.floor((Date.now() - (callStartTime.current as number)) / 1000)
          );
        }, 1000);
      }
    } else if (callStatus !== "connected" && callStartTime.current !== null) {
      clearInterval(callDurationInterval.current!);
      callStartTime.current = null;
      setCallDuration(0);
    }

    return () => {
      if (callDurationInterval.current) {
        clearInterval(callDurationInterval.current);
      }
    };
  }, [callStatus]);

  const initializeTwilio = async () => {
    if (typeof window === "undefined") return;

    device?.destroy();
    addTwilioLog("Checking audio devices...");

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioInput = devices.some(
        (device) => device.kind === "audioinput"
      );

      if (!hasAudioInput) {
        throw new Error("No audio input devices found");
      }

      addTwilioLog("Requesting Access Token...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TWILIO_URL}/token`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          credentials: "include",
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }
      const data = await response.json();

      addTwilioLog("Got a token.");
      console.log("data", data);
      console.log("Token: " + data.token);
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const { Device, Connection } = await import("twilio-client");
      const newDevice = new Device(data.token, {
        codecPreferences: [Connection.Codec.PCMU, Connection.Codec.Opus],
        fakeLocalDTMF: true,
        enableRingingState: true,
        debug: true,
        allowIncomingWhileBusy: true,
        edge: ["ashburn", "dublin", "singapore"],
      });

      newDevice.on("ready", () => {
        setCallStatus("ready");
        addTwilioLog("Twilio.Device Ready!");
      });

      newDevice.on("error", (error) => {
        addTwilioLog("Twilio.Device Error: " + error.message);
      });

      newDevice.on("connect", () => {
        setCallStatus("connected");
        addTwilioLog("Successfully established call!");
      });

      newDevice.on("incoming", (conn) => {
        console.log("Incoming connection: ", conn);
        setCallStatus("incoming");
        setIncomingConnection(conn);
        addTwilioLog("Incoming connection from " + conn.parameters.From);

        conn.on("accept", () => {
          setCallStatus("connected");
          addTwilioLog("Call Accepted!");
        });

        conn.on("disconnect", () => {
          setCallStatus("ready");
          addTwilioLog("Call ended.");
          setIncomingConnection(null);
        });
      });

      newDevice.on("cancel", () => {
        setCallStatus("ready");
        addTwilioLog("Call cancelled.");
      });

      newDevice.on("disconnect", () => {
        setCallStatus("ready");
        addTwilioLog("Call ended.");
        setIncomingConnection(null);
      });

      setDevice(newDevice);
    } catch (error) {
      console.warn(error);
      addTwilioLog(
        error instanceof Error
          ? error.message
          : "Failed to initialize audio device"
      );
    }
  };

  const fetchUserData = () => {
    runService(
      undefined,
      getMe,
      (data) => {
        setUser(data);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  useEffect(() => {
    if (user?.phone) {
      initializeTwilio();
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <TwilioContext.Provider
      value={{
        device,
        incomingConnection,
        outgoingConnection,
        twilioLogs,
        callStatus,
        callDuration,
        addTwilioLog,
        setTwilioLogs,
        handleCallOut,
        handleHangUp,
        handleAcceptCall,
        handleRejectCall,
      }}
    >
      {children}
    </TwilioContext.Provider>
  );
}

export function useTwilioContext() {
  const context = useContext(TwilioContext);
  if (context === undefined) {
    throw new Error("useTwilioContext must be used within a TwilioProvider");
  }
  return context;
}
