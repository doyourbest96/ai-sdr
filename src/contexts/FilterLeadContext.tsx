import React, { createContext, useState, useContext, ReactNode } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  isSelected?: boolean;
}

interface LeadFilterConfig {
  isOpen: boolean;
  persona: Option | Option[] | null;
  title: string;
  company: string;
  location: string;
  employee: Option | Option[] | null;
  keyword: string;
}

interface LeadFilterContextType {
  leadFilterConfig: LeadFilterConfig;
  setLeadFilterConfig: React.Dispatch<React.SetStateAction<LeadFilterConfig>>;
}

export const LeadFilterContext = createContext<
  LeadFilterContextType | undefined
>(undefined);

export const LeadFilterProvider = ({ children }: { children: ReactNode }) => {
  const [leadFilterConfig, setLeadFilterConfig] = useState<LeadFilterConfig>({
    isOpen: true,
    persona: [],
    title: "",
    company: "",
    location: "",
    employee: [],
    keyword: "",
  });

  const updateLeadFilterConfig = (config: LeadFilterConfig) => {
    setLeadFilterConfig(config);
  };

  return (
    <LeadFilterContext.Provider
      value={{ leadFilterConfig, setLeadFilterConfig }}
    >
      {children}
    </LeadFilterContext.Provider>
  );
};

export const useLeadFilter = (): LeadFilterContextType => {
  const context = useContext(LeadFilterContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
