import React from "react";
import { Paper, Modal } from "@mui/material";
import { AddSongForm } from "../../../forms";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
`;

const AddSong = ({ onUpload, onCancel }) => {
  return (
    <Modal open={true}>
      <StyledPaper className="newSong">
        <AddSongForm onCancel={onCancel} onUpload={onUpload} />
      </StyledPaper>
    </Modal>
  );
};

export default AddSong;
