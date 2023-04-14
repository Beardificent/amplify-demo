import "./App.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";import { Paper } from "@mui/material";


Amplify.configure(awsconfig);
function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Paper className="App">
          <p>Hey {user.username}, welcome to my channel, with auth!</p>
          <button onClick={signOut}>Sign out</button>
        </Paper>
      )}
    </Authenticator>
  );
}

export default App;
