import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";

interface GenerateConfigCardProps {
  onGenerate: (startDate: dayjs.Dayjs, remarks: string) => void;
}

const GenerateConfigCard = (props: GenerateConfigCardProps) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [remarks, setRemarks] = useState("");

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <Typography variant="h6" component="div" marginBottom={2}>
              Generate Timesheet Configuration
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <DatePicker
              label="Timesheet Start Date"
              defaultValue={startDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              onChange={(date) => {
                if (date) {
                  setStartDate(date);
                }
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField label="T-contract Staff's Remarks" variant="outlined" size="small" multiline maxRows={4} fullWidth value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          sx={{ marginLeft: "auto" }}
          onClick={() => {
            props.onGenerate(startDate, remarks);
          }}
        >
          <FileDownloadRoundedIcon />
          Generate Timesheet
        </Button>
      </CardActions>
    </Card>
  );
};

export default GenerateConfigCard;
