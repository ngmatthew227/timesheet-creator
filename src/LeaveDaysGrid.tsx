import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Alert, Box, Button, Card, Snackbar, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { isNil } from "lodash";
import { v4 as uniqueId } from "uuid";
import { useEffect, useState } from "react";
import { LeaveData, useConfigStore } from "./store/configStore";
import dayjs from "dayjs";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

const GridWrappr = styled("div")(({ theme }) => ({
  height: "100%",
  width: "100%",
  "& .MuiDataGrid-cell--editing": { backgroundColor: "rgb(255,215,115, 0.19)", color: "#1a3e72", "& .MuiInputBase-root": { height: "100%" } },
  "& .Mui-error": { backgroundColor: `rgb(126,10,15, ${theme.palette.mode === "dark" ? 0 : 0.1})`, color: theme.palette.error.main },
}));

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;
  const handleClick = () => {
    const id = uniqueId();
    setRows((oldRows) => [...oldRows, { id, isNew: true }]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: "nonChargeDate" } }));
  };
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
};
const LeaveDaysGrid = () => {
  const [open, setOpen] = useState(false);
  const [tabIdx, setTabIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const leaveDays = useConfigStore((state) => state.leaveDays);
  const setLeaveDays = useConfigStore((state) => state.setLeaveDays);
  const [rows, setRows] = useState<LeaveData[]>(leaveDays);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  const processRowUpdate = (newRow: GridRowModel) => {
    console.log("row update now");
    if (isNil(newRow.nonChargeDate)) {
      return Promise.reject("Please enter a valid date");
    }
    if (isNil(newRow.nonChargeDays)) {
      return Promise.reject("Please enter a valid number");
    }
    if (newRow.nonChargeDays < 0 || newRow.nonChargeDays > 1) {
      return Promise.reject("Please enter a valid number between 0 and 1");
    }
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setLeaveDays(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  const rowUpdateErrorHandler = (params: any) => {
    setErrorMsg(params);
    setOpen(true);
  };
  const columns: GridColDef[] = [
    {
      field: "nonChargeDate",
      headerName: "Date",
      type: "date",
      width: 150,
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === null;
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => {
        const value = params.value;
        return dayjs(value).toDate();
      },
    },
    {
      field: "nonChargeDays",
      headerName: "Non-Chargable Day",
      type: "number",
      width: 150,
      editable: true,
      renderEditCell: (params) => <GridEditInputCell {...params} fullWidth type="number" inputProps={{ min: 0, max: 1, step: 0.5 }} />,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value < 0 || params.props.value > 1;
        return { ...params.props, error: hasError };
      },
    },
    { field: "remark", headerName: "Remarks", type: "string", flex: 1, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [<GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} color="inherit" />];
        }
        return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />];
      },
    },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIdx}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTabIdx(newValue);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Leave Days" />
          <Tab label="OT (To be finish)" />
        </Tabs>
      </Box>
      {tabIdx === 0 && (
        <GridWrappr>
          <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
            <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: "100%" }}>
              {errorMsg}
            </Alert>
          </Snackbar>

          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ sorting: { sortModel: [{ field: "nonChargeDate", sort: "desc" }] } }}
            rowHeight={38}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newRowModesModel: GridRowModesModel) => {
              setRowModesModel(newRowModesModel);
            }}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={rowUpdateErrorHandler}
            slots={{ toolbar: EditToolbar }}
            slotProps={{ toolbar: { setRows, setRowModesModel } }}
          />
        </GridWrappr>
      )}
    </Card>
  );
};
export default LeaveDaysGrid;
