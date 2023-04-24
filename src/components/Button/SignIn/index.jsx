import { Button } from "@mui/material";
import styled from "styled-components";
import { View } from "@aws-amplify/ui-react";

const StyledSignInButton = styled(Button)``;

const SignInButton = ({ onClick }) => {
  return (
    <View>
      <StyledSignInButton variant="contained" onClick={onClick}>
        FOOBAR
      </StyledSignInButton>
    </View>
  );
};

export default SignInButton;
