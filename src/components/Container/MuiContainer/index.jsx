import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";

const StyledContainer = styled(Container)`
  min-height: 100vh;
  overflow: hidden;
  background-color: #eeeee4;
  padding: 16px;
`;

const MuiContainer = ({ children }) => {
  return <StyledContainer maxWidth="xxl">{children}</StyledContainer>;
};
export default MuiContainer;
