import "./App.css";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import { Paper, IconButton, TextField } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import PublishIcon from "@mui/icons-material/Publish";
import { listSongs } from "./graphql/queries";
import { updateSong } from './graphql/mutations';

Amplify.configure(awsconfig);
function App() {
  const [songs, setSongs] = useState([]);

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

  const addLike = async idx => {
    try {
        const song = songs[idx];
        song.likes = song.likes + 1;
        delete song.createdAt;
        delete song.updatedAt;

        const songData = await API.graphql(graphqlOperation(updateSong, { input: song }));
        const songList = [...songs];
        songList[idx] = songData.data.updateSong;
        setSongs(songList);
    } catch (error) {
        console.log('error on adding Like to song', error);
    }
};

  useEffect(() => {
    fetchSongs();
  }, []);
  return (
    <div className="appContainer">
      <Authenticator>
        {({ signOut, user }) => (
          <Paper className="App">
            <p>Hey {user.username}, you are authorized to see this.</p>
            <button onClick={signOut}>Sign out</button>
          </Paper>
        )}
      </Authenticator>
      <div className="songList">
        {songs.map((song, idx) => {
          return (
            <Paper variant="outlined" key={`song${idx}`}>
              <div className="songCard">
                <IconButton aria-label="play">
                  <PlayArrowIcon />
                </IconButton>
                <div>
                  <div className="songTitle">{song.title}</div>
                  <div className="songOwner">{song.owner}</div>
                </div>
                <div>
                  <IconButton aria-label="like" onClick={() => addLike(idx)}>
                    <FavoriteIcon />
                  </IconButton>
                  {song.likes}
                </div>
                <div className="songDescription">{song.description}</div>
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

export default App;
