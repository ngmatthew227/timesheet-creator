import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import Grid from "@mui/material/Unstable_Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const GenerateConfigCard = () => {
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
            <DatePicker label="Timesheet Start Date" defaultValue={dayjs().startOf("month")} slotProps={{ textField: { size: "small", fullWidth: true } }} />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField label="T-contract Staff's Remarks" variant="outlined" size="small" multiline maxRows={4} fullWidth />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <Button sx={{ marginLeft: "auto" }}>
          <FileDownloadRoundedIcon />
          Generate Timesheet
        </Button>
      </CardActions>
    </Card>
  );
};

export default GenerateConfigCard;
