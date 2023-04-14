import "./App.css";
import { Amplify, API, graphqlOperation, Storage } from "aws-amplify";
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
import { updateSong, createSong } from "./graphql/mutations";
import ReactPlayer from "react-player";
import { v4 as uuid } from "uuid";

Amplify.configure(awsconfig);
Storage.configure(awsconfig);

function App() {
  const [songs, setSongs] = useState([]);
  const [songPlaying, setSongPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showAddSong, setShowAddNewSong] = useState(false);

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

  const addLike = async (idx) => {
    try {
      const song = songs[idx];
      song.likes = song.likes + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(
        graphqlOperation(updateSong, { input: song })
      );
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
    } catch (error) {
      console.log("error on adding Like to song", error);
    }
  };

  const toggleSong = async (idx) => {
    if (songPlaying === idx) {
      setSongPlaying("");
      return;
    }

    const songFilePath = songs[idx].filePath;
    try {
      const fileAccessURL = await Storage.get(songFilePath, { expires: 60 });
      console.log("access url", fileAccessURL);
      setSongPlaying(idx);
      setAudioURL(fileAccessURL);
      return;
    } catch (error) {
      console.error("error accessing the file from s3", error);
      setAudioURL("");
      setSongPlaying("");
    }
  };

  const AddSong = ({ onUpload }) => {
    const [songData, setSongData] = useState({});
    const [mp3Data, setMp3Data] = useState();

    const uploadSong = async () => {
      //Upload the song
      console.log("songData", songData);
      const { title, description, owner } = songData;
      const { key } = await Storage.put(`${uuid()}.mp3`, mp3Data, {
        contentType: "audio/mp3",
      });
      const createSongInput = {
        id: uuid(),
        title,
        description,
        owner,
        filePath: key,
        likes: 0,
      };
      await API.graphql(
        graphqlOperation(createSong, { input: createSongInput })
      );
      onUpload();
    };

    return (
      <div className="newSong">
        <TextField
          label="Title"
          value={songData.title}
          onChange={(e) => setSongData({ ...songData, title: e.target.value })}
        />
        <TextField
          label="Artist"
          value={songData.owner}
          onChange={(e) => setSongData({ ...songData, owner: e.target.value })}
        />
        <TextField
          label="Description"
          value={songData.description}
          onChange={(e) =>
            setSongData({ ...songData, description: e.target.value })
          }
        />
        <input
          type="file"
          accept="audio/mp3"
          onChange={(e) => setMp3Data(e.target.files[0])}
        />
        <IconButton onClick={uploadSong}>
          <PublishIcon />
        </IconButton>
      </div>
    );
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
                <IconButton aria-label="play" onClick={() => toggleSong(idx)}>
                  {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon />}
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
              {songPlaying === idx ? (
                <div className="ourAudioPlayer">
                  <ReactPlayer
                    url={audioURL}
                    controls
                    playing
                    height="50px"
                    width="100%"
                    onPause={() => toggleSong(idx)}
                  />
                </div>
              ) : null}
              {showAddSong ? (
                <AddSong
                  onUpload={() => {
                    setShowAddNewSong(false);
                    fetchSongs();
                  }}
                />
              ) : (
                <IconButton onClick={() => setShowAddNewSong(true)}>
                  <AddIcon />
                </IconButton>
              )}
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

export default App;
