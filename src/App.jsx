import { Amplify, API, graphqlOperation, Storage } from "aws-amplify";
import React, {useState } from "react";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import { Container } from "@mui/material";
import { listSongs } from "./graphql/queries";
import { UserPaper } from "./components/Paper";
import { Dashboard, AddSong, SongList } from "./containers";
import { components, formFields } from "./containers/Authenticator";
import { createTheme } from "@aws-amplify/ui-react";
import "./App.css";
Amplify.configure(awsconfig);
Storage.configure(awsconfig);

function App() {
  const [songs, setSongs] = useState([]);
  const [showAddSong, setShowAddNewSong] = useState(false);
  const myTheme = createTheme({});

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log("song list", songList);
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };
  return (
    <ThemeProvider theme={myTheme} colorMode="system">
      <Container maxWidth="xxl" className="appContainer">
        <Authenticator components={components} formFields={formFields}>
          {({ signOut, user }) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "24px",
                }}
              >
                <UserPaper
                  userName={user.attributes.name}
                  role={"Sitter at Ventura"}
                />
                <Dashboard
                  onSignOut={signOut}
                  onAddSong={() => setShowAddNewSong(true)}
                />
              </div>
              <SongList/>
            
              {showAddSong && (
                <AddSong
                  onUpload={() => {
                    setShowAddNewSong(false);
                    fetchSongs();
                  }}
                  onCancel={() => {
                    setShowAddNewSong(false);
                  }}
                />
              )}
            </>
          )}
        </Authenticator>
      </Container>
    </ThemeProvider>
  );
}

export default App;
