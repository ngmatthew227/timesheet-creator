import { Badge, Card } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { LeaveData, useConfigStore } from "./store/configStore";

function CustomDay(props: PickersDayProps<Dayjs> & { highlightedDate?: LeaveData[] }) {
  const { highlightedDate = [], day, outsideCurrentMonth, ...other } = props;

  const nonChargeDays = highlightedDate.find((ele) => dayjs(ele.nonChargeDate).isSame(day, "day"))?.nonChargeDays || 0;
  const badgeContentText = nonChargeDays == "0.5" ? "✈️" : nonChargeDays == "1" ? "🚀" : undefined;
  const finalBadgeContent = outsideCurrentMonth ? undefined : badgeContentText;
  return (
    <Badge key={props.day.toString()} overlap="circular" badgeContent={finalBadgeContent}>
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const StaffCalendar = () => {
  const leaveDays = useConfigStore((state) => state.leaveDays);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <DateCalendar
          slots={{
            day: CustomDay,
          }}
          slotProps={{
            day: {
              highlightedDate: leaveDays,
            } as any,
          }}
        />
      </Card>
    </LocalizationProvider>
  );
};

export default StaffCalendar;
