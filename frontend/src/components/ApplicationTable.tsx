import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TableSortLabel,
  Button,
  Box
} from '@mui/material';
import { Application } from '../types';
import { createLetter } from '@/utils/api';
import { Socket } from 'socket.io-client';

interface Props {
  applications: Application[];
  socket: Socket;
  onSelect: (application: Application) => void;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof Application['data'] | 'id';

interface HeadCell {
  id: keyof Application['data'] | 'actions' | 'id';
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'id', label: 'ID' },
  { id: 'headline', label: 'Job Title' },
  { id: 'employer', label: 'Company' },
  { id: 'workplace_address', label: 'Location' },
  { id: 'application_deadline', label: 'Deadline' },
  { id: 'actions', label: 'Actions' },
];

export default function ApplicationsTable({ applications, socket, onSelect }: Props) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('headline');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

 const handleCreateLetter = async (applicationId: string) => {
    try {
      await createLetter(applicationId);
      console.log('Letter id: ' + applicationId + ' created successfully');
    } catch (error) {
      console.error('Error creating letter:', error);
    }
  };

  const sortedApplications = React.useMemo(() => {
    const comparator = (a: Application, b: Application) => {
      let aValue: any;
      let bValue: any;

      if (orderBy === 'id') {
        aValue = Number(a.id);
        bValue = Number(b.id);
      } else if (orderBy === 'employer') {
        aValue = a.data.employer.name;
        bValue = b.data.employer.name;
      } else if (orderBy === 'workplace_address') {
        aValue = a.data.workplace_address.city;
        bValue = b.data.workplace_address.city;
      } else {
        aValue = a.data[orderBy];
        bValue = b.data[orderBy];
      }

      if (bValue < aValue) return order === 'asc' ? 1 : -1;
      if (bValue > aValue) return order === 'asc' ? -1 : 1;
      return 0;
    };

    return [...applications].sort(comparator);
  }, [applications, order, orderBy]);

    return (
    <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
      <Table
        stickyHeader
        aria-label="sticky table"
        sx={{
          '& td, & th': {
            borderRight: '1px solid #4b5563',
          },
          '& td:last-child, & th:last-child': {
            borderRight: 'none',
          },
        }}
      >
        <TableHead
          sx={{
            '& .MuiTableCell-head': {
              backgroundColor: '#1f2937',
              color: '#ffffff', 
              borderBottom: '1px solid #4b5563',
            },
            '& .MuiTableSortLabel-root': {
              color: '#ffffff !important',
            },
            '& .MuiTableSortLabel-icon': {
              color: '#ffffff !important',
            },
          }}
        >
          <TableRow>
            {headCells.map((headCell) => {
              const isSortable = headCell.id !== 'actions';
              return (
                <TableCell
                  key={headCell.id}
                  sortDirection={isSortable && orderBy === headCell.id ? order : false}
                  onClick={() => {
                    if (!isSortable) return;
                    handleRequestSort(headCell.id as OrderBy);
                  }}
                  style={{ cursor: isSortable ? 'pointer' : 'default' }}
                >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {headCell.label}
                  {headCell.id !== 'actions' && (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      hideSortIcon={orderBy !== headCell.id}
                    />
                  )}
                </Box>
              </TableCell>
            )})}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedApplications.map((app) => (
            <TableRow key={app.id}  sx={{ height: '70px', color: '#9CA3AF' }}>
              <TableCell sx={{ width: 70, color: '#9CA3AF' }}>#{app.id}</TableCell>
              <TableCell>{app.data.headline}</TableCell>
              <TableCell>{app.data.employer.name}</TableCell>
              <TableCell>{app.data.workplace_address.city}</TableCell>
              <TableCell>
                {new Date(app.data.application_deadline).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ height: '80%'}}
                  onClick={() => onSelect(app)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
