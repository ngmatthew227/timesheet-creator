import { Button, Card, CardContent, Dialog, DialogActions, DialogTitle, DialogContent, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { OfficerData, OfficerState, StaffData, StaffState, useConfigStore } from "./store/configStore";

interface StaffDetailCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const StaffDetailCard = ({ open, setOpen }: StaffDetailCardProps) => {
  const staffData = useConfigStore((state: StaffState) => state.staffData);
  const setStaffData = useConfigStore((state: StaffState) => state.setStaffData);

  const officerData = useConfigStore((state: OfficerState) => state.officerData);
  const setOfficerData = useConfigStore((state: OfficerState) => state.setOfficerData);

  const [localStaffData, setLocalStaffData] = useState<StaffData>(staffData);
  const [localOfficerData, setLocalOfficerData] = useState<OfficerData>(officerData);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={"lg"}>
      <DialogTitle>Config</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid md={12}>
            <Divider>Staff Data</Divider>
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Name of Staff"
              variant="outlined"
              value={localStaffData.staffName}
              onChange={(e) => {
                setLocalStaffData({ ...localStaffData, staffName: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="T-Contractor Name"
              variant="outlined"
              value={localStaffData.contractorName}
              onChange={(e) => {
                setLocalStaffData({ ...localStaffData, contractorName: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Staff Category"
              variant="outlined"
              value={localStaffData.staffCategory}
              onChange={(e) => {
                setLocalStaffData({ ...localStaffData, staffCategory: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Department"
              variant="outlined"
              value={localStaffData.department}
              onChange={(e) => {
                setLocalStaffData({ ...localStaffData, department: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Post Unit"
              variant="outlined"
              value={localStaffData.postUnit}
              onChange={(e) => {
                setLocalStaffData({ ...localStaffData, postUnit: e.target.value });
              }}
            />
          </Grid>
          <Grid md={12}>
            <Divider>Officer Data</Divider>
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Name of Officer"
              variant="outlined"
              value={localOfficerData.officerName}
              onChange={(e) => {
                setLocalOfficerData({ ...localOfficerData, officerName: e.target.value });
              }}
            />
          </Grid>
          {/* certifiedOn?: Date; */}
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Post Title"
              variant="outlined"
              value={localOfficerData.postTitle}
              onChange={(e) => {
                setLocalOfficerData({ ...localOfficerData, postTitle: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Email"
              variant="outlined"
              value={localOfficerData.email}
              onChange={(e) => {
                setLocalOfficerData({ ...localOfficerData, email: e.target.value });
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <DatePicker
              value={localOfficerData.certifiedOn}
              label="Certified On"
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  size: "small",
                },
              }}
              onChange={(date) => {
                setLocalOfficerData({ ...localOfficerData, certifiedOn: date });
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setStaffData(localStaffData);
            setOfficerData(localOfficerData);
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffDetailCard;
