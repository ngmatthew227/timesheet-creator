import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Dayjs } from "dayjs";

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
  certifiedOn: null | Dayjs;
}

export interface LeaveData {
  id?: string;
  nonChargeDate?: string;
  nonChargeDays?: string;
  remark?: string;
  isNew: boolean;
}

export interface LeaveDaysState {
  leaveDays: LeaveData[];
  setLeaveDays: (data: LeaveData[]) => void;
  setLeaveDay: (data: LeaveData) => void;
}

export interface StaffState {
  staffData: StaffData;
  setStaffData: (data: StaffData) => void;
}

export interface OfficerState {
  officerData: OfficerData;
  setOfficerData: (data: OfficerData) => void;
}

export const useConfigStore = create<StaffState & OfficerState & LeaveDaysState, [["zustand/persist", StaffState]]>(
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
      leaveDays: [],
      setStaffData: (data: StaffData) => {
        set({ staffData: data });
      },
      setOfficerData: (data: OfficerData) => {
        set({ officerData: data });
      },
      setLeaveDays: (data: LeaveData[]) => {
        set({ leaveDays: data });
      },
      setLeaveDay: (data: LeaveData) => {
        set((state) => {
          const leaveDays = [...state.leaveDays];
          const index = leaveDays.findIndex((leave) => leave.id === data.id);
          if (index === -1) {
            leaveDays.push(data);
          } else {
            leaveDays[index] = data;
          }
          return { leaveDays };
        });
      },
    }),
    {
      name: "timesheet-creator-store",
    }
  )
);
