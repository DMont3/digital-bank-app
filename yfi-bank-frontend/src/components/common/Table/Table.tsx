import React from 'react';
import { Paper, Table as MUITable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T]) => React.ReactNode;
  }[];
}

const Table = <T extends object>({ data, columns }: TableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <MUITable sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={`${index}-${String(column.key)}`}>
                  {column.render ? column.render(row[column.key]) : String(row[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  );
};

export default Table;