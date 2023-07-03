import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

function CustomDay(props: PickersDayProps<Dayjs> & { highlightedDate?: any[] }) {
  const { highlightedDate = [], day, outsideCurrentMonth, ...other } = props;

  const nonChargeDays = highlightedDate.find((ele) => dayjs(ele.date).isSame(day, "day"))?.nonChargeDays;
  const badgeContentText = nonChargeDays == 0.5 ? "✈️" : nonChargeDays == 1 ? "🚀" : undefined;

  return (
    <Badge key={props.day.toString()} overlap="circular" badgeContent={badgeContentText}>
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const StaffCalendar = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        slots={{
          day: CustomDay,
        }}
        slotProps={{
          day: {
            highlightedDate: [
              { date: dayjs("2023-6-1"), nonChargeDays: 1 },
              { date: dayjs("2023-7-1"), nonChargeDays: 0.5 },
              { date: dayjs("2023-7-2"), nonChargeDays: 0.5 },
              { date: dayjs("2023-7-3"), nonChargeDays: 1 },
            ],
          } as any,
        }}
      />
    </LocalizationProvider>
  );
};

export default StaffCalendar;
