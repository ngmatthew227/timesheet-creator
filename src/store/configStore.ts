import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StaffData {
  staffName: string;
  contractorName: string;
  staffCategory: string;
  department: string;
  postUnit: string;
}

export interface OfficerData {
  officerName: string;
  postTitle: string;
  email: string;
  commitmentRef?: string;
  certifiedOn: null | Date;
}

export interface StaffState {
  staffData: StaffData;
  setStaffData: (data: StaffData) => void;
}

export interface OfficerState {
  officerData: OfficerData;
  setOfficerData: (data: OfficerData) => void;
}

export const useConfigStore = create<StaffState & OfficerState, [["zustand/persist", StaffState]]>(
  persist(
    (set) => ({
      staffData: {
        staffName: "",
        contractorName: "",
        staffCategory: "",
        department: "",
        postUnit: "",
      },
      officerData: {
        officerName: "",
        postTitle: "",
        email: "",
        commitmentRef: "",
        certifiedOn: null,
      },
      setStaffData: (data: StaffData) => {
        set({ staffData: data });
      },
      setOfficerData: (data: OfficerData) => {
        set({ officerData: data });
      },
    }),
    {
      name: "timesheet-creator-store",
    }
  )
);
