import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface JobCardProps {
  job: {
    title: string;
    company: string;
    description: string;
  };
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{job.title}</Typography>
        <Typography variant="subtitle1">{job.company}</Typography>
        <Typography variant="body2">{job.description}</Typography>
        <Button variant="contained" color="primary" onClick={onApply}>
          Apply
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;
