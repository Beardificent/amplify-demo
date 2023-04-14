import { Paper, styled } from "@mui/material";
import React from "react";

const StyledPaper = styled(Paper)`
  padding: 12px;
  display: flex;
  max-width: 450px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
`;

const UserPaper = ({ children }) => {
  return <StyledPaper>{children}</StyledPaper>;
};
export default UserPaper;
