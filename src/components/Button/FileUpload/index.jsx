import React from "react";
import styled from "styled-components";
import { Button } from "@aws-amplify/ui-react";
// Style the Button component
const StyledButton = styled(Button)``;
const FileUploader = ({ handleChange, fileToUpload }) => {
  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click(event);
  };
  return (
    <>
      {" "}
      <StyledButton variation="primary" onClick={handleClick}>
        Choose file to upload
      </StyledButton>
      <div>{fileToUpload}</div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
};
export default FileUploader;
