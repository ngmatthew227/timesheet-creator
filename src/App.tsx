import { Button, Divider, IconButton, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Workbook } from "exceljs";
import { StaffState, useConfigStore } from "./store/configStore";
import StaffDetailCard from "./StaffDetailCard";
import styled from "@emotion/styled";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Grid from "@mui/material/Unstable_Grid2";
import LeaveDaysGrid from './LeaveDaysGrid';
import GenerateConfigCard from './GenerateConfigCard';
import StaffCalendar from './StaffCalendar';

function App() {
  const [open, setOpen] = useState(false);

  const staffData = useConfigStore((state: StaffState) => state.staffData);

  const OutterContainer = styled.div`
    height: 100vh;
    width: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
  `;

  const StyledContainer = styled.div`
    background-color: #fff;
    border-radius: 0.375rem;
    height: 100%;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  `;

  const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #282c34;
    padding: 0.1rem;
    margin-bottom: 0.8rem;
  `;

  const TitleContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
  `;

  const downloadExcelFile = async () => {
    fetch("./timesheet_template.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // Use exceljs to read the file
        const workbook = new Workbook();
        workbook.calcProperties.fullCalcOnLoad = true;
        return workbook.xlsx.load(buffer);
      })
      .then(async (workbook) => {
        console.log("[workbook ] >", workbook);
        const worksheet = workbook.getWorksheet("Automated Form - ONLY Modify D9");

        // Set the value of cell D9 as a date
        const dateValue = new Date(Date.UTC(2023, 4, 1));
        worksheet.getCell("D9").value = dateValue;
        worksheet.getCell("D9").numFmt = "dd-mmm-yyyy";

        const excelFileBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([excelFileBuffer], { type: "application/xlsx" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // make the file name into Timesheet_{current datatime}.xlsx
        a.download = `Timesheet_${new Date().toLocaleString()}.xlsx`;

        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaffDetailCard open={open} setOpen={setOpen} />
      <OutterContainer>
        <StyledContainer>
          <HeaderContainer>
            <TitleContainer>Timesheet Generator</TitleContainer>
            <IconButton aria-label="setting" onClick={() => setOpen(!open)}>
              <SettingsIcon />
            </IconButton>
          </HeaderContainer>
          <Divider />
          <Grid container spacing={2} padding={2}>
          <Grid xs={12} md={12}>
            <GenerateConfigCard />
            </Grid>
            <Grid xs>
              <LeaveDaysGrid />
            </Grid>
            <Grid >
              <StaffCalendar />
            </Grid>
          </Grid>
        </StyledContainer>
      </OutterContainer>
    </LocalizationProvider>
  );
}

export default App;
