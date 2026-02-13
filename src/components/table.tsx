import {
  Paper,
  Box,
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";

export interface ColumnConfig {
  field: string;
  headerName: string;
  minWidth?: number;
  align?: "center" | "left" | "right";
  // To handle custom buttons/actions
  renderCell?: (params: any) => React.ReactNode;
}

interface GenericTableProps<T> {
  columns: ColumnConfig[];
  rows: T[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  title: string;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export function GenericTable<T extends { id: string | number }>({
  columns,
  rows,
  isLoading,
  isError,
  error,
  title,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: GenericTableProps<T>) {
  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (isError)
    return (
      <Typography color="error" textAlign="center" sx={{ p: 5 }}>
        Error: {error}
      </Typography>
    );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", backgroundColor: "#f8f9fa" }}
      >
        {title}
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "center"}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#104179", // Your signature blue
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = (row as any)[column.field];
                  return (
                    <TableCell
                      key={column.field}
                      align={column.align || "center"}
                    >
                      {/* If renderCell exists (for buttons), use it. Otherwise, show value */}
                      {column.renderCell
                        ? column.renderCell({ row, id: row.id })
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount} 
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
      />
    </Paper>
  );
}
