import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)`
  margin: 8px;
`;

const ReusableButton: React.FC<{ text: string, onClick: () => void }> = ({ text, onClick }) => {
  return <StyledButton variant="contained" color="primary" onClick={onClick}>{text}</StyledButton>;
};

export default ReusableButton;