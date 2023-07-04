import styled from "@emotion/styled";
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Workbook } from "exceljs";
import { useState } from "react";
import GenerateConfigCard from "./GenerateConfigCard";
import LeaveDaysGrid from "./LeaveDaysGrid";
import StaffCalendar from "./StaffCalendar";
import StaffDetailCard from "./StaffDetailCard";
import { OfficerState, StaffState, useConfigStore } from "./store/configStore";

function App() {
  const [open, setOpen] = useState(false);
  const staffData = useConfigStore((state: StaffState) => state.staffData);
  const officerData = useConfigStore((state: OfficerState) => state.officerData);

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

  const getWorkbook = async () => {
    const response = await fetch("./timesheet_template.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = new Workbook();
    workbook.calcProperties.fullCalcOnLoad = true;
    await workbook.xlsx.load(arrayBuffer);
    return workbook;
  };

  const onGenerate = async (startDate: Dayjs, remarks: string) => {
    const workbook = await getWorkbook();
    const worksheet = workbook.getWorksheet(1);
    worksheet.getCell("D9").value = startDate.add(8, "hour").toDate();
    worksheet.getCell("D9").numFmt = "dd-mmm-yyyy";
    worksheet.getCell("E60").value = remarks;

    // set staff data
    worksheet.getCell("D5").value = staffData.staffName;
    worksheet.getCell("D6").value = staffData.contractorName;
    worksheet.getCell("D7").value = staffData.staffCategory;
    worksheet.getCell("D8").value = staffData.department;
    worksheet.getCell("L8").value = staffData.postUnit;

    // set officer data
    worksheet.getCell("E12").value = officerData.officerName;
    worksheet.getCell("E13").value = officerData.postTitle;
    worksheet.getCell("K13").value = officerData.email;
    worksheet.getCell("E14").value = officerData.commitmentRef;
    if (dayjs(officerData.certifiedOn).isValid()) {
      const certifiedOn = dayjs(officerData.certifiedOn).add(8, "hour").toDate();
      worksheet.getCell("K14").value = certifiedOn;
      worksheet.getCell("K14").numFmt = "dd-mmm-yyyy";
    }

    await downloadExcel(workbook);
  };

  const downloadExcel = async (workbook: Workbook) => {
    const excelFileBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([excelFileBuffer], { type: "application/xlsx" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Timesheet_${new Date().toLocaleString()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
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
              <GenerateConfigCard onGenerate={onGenerate} />
            </Grid>
            <Grid xs>
              <LeaveDaysGrid />
            </Grid>
            <Grid>
              <StaffCalendar />
            </Grid>
          </Grid>
        </StyledContainer>
      </OutterContainer>
    </LocalizationProvider>
  );
}

export default App;
