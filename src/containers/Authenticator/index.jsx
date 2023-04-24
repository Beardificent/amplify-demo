import { useTheme, useAuthenticator } from "@aws-amplify/ui-react";
import { View, Text, Heading } from "@aws-amplify/ui-react";
import { Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

//  FIXME       ::
//              CLEAN UP
export const components = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          SIGN INTO YOUR FOO ACCOUNT
        </Heading>
      );
    },
    Footer() {
      const { toResetPassword } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button loadingText="" onClick={toResetPassword} ariaLabel="">
          Reset Password
          </Button>
        </View>
      );
    },
  },
  SignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Create a new account
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button
            variant="contained"
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Back to Sign In
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  SetupTOTP: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmSignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
};
export const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
    },
  },
  signUp: {
    name: {
      label: "First Name",
      placeholder: "Enter your first name",
      isRequired: true,
      order: 1,
    },
    family_name: {
      label: "Last Name",
      placeholder: "Enter your last name",
      isRequired: true,
      order: 2,
    },
    password: {
      label: "Password",
      placeholder: "Enter your Password",
      isRequired: false,
      order: 3,
    },
    confirm_password: {
      label: "Confirm Password",
      order: 4,
    },
  },
  forceNewPassword: {
    password: {
      placeholder: "Enter your Password",
      order: 0,
    },
  },
  resetPassword: {
    username: {
      placeholder: "Enter your email",
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: "Enter your Confirmation Code",
      label: "Confirmation Code",
      isRequired: false,
    },
    confirm_password: {
      placeholder: "Enter your Password Please",
    },
  },
  setupTOTP: {
    QR: {
      totpIssuer: "test issuer",
      totpUsername: "amplify_qr_test_user",
    },
    confirmation_code: {
      label: "Confirmation Code",
      placeholder: "Enter your Confirmation Code",
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: "Confirmation Code",
      placeholder: "Enter your Confirmation Code",
      isRequired: false,
    },
  },
};
