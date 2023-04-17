import "./App.css";
import { Amplify, API, graphqlOperation, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import { Container } from "@mui/material";
import { listSongs } from "./graphql/queries";
import { updateSong } from "./graphql/mutations";
import ReactPlayer from "react-player";
import { UserPaper } from "./components/Paper";
import { Dashboard, AddSong, SongItem } from "./containers";

Amplify.configure(awsconfig);
Storage.configure(awsconfig);

function App() {
  const [songs, setSongs] = useState([]);
  const [songPlaying, setSongPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showAddSong, setShowAddNewSong] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

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

  useEffect(() => {
    fetchSongs();
  }, []);
  return (
    <Container maxWidth="xxl" className="appContainer">
      <Authenticator>
        {({ signOut, user }) => (
          <>
            {console.log(user)}
            <UserPaper>
              <p>Hey {user.attributes?.email}, you are authorized to see this.</p>
              <Dashboard
                onSignOut={signOut}
                onAddSong={() => setShowAddNewSong(true)}
              />
              <div></div>
            </UserPaper>
            <div className="songList">
              {songs.map((song, idx) => {
                return (
                  <SongItem
                    songIndex={idx}
                    title={song.title}
                    owner={song.owner}
                    likes={song.likes}
                    description={song.description}
                    toggleSong={() => toggleSong(idx)}
                    addLike={() => addLike(idx)}
                    reactPlayer={
                      songPlaying === idx ? (
                        <div className="ourAudioPlayer">
                          <ReactPlayer
                            url={audioURL}
                            controls
                            playing={isPlaying}
                            height="50px"
                            width="100%"
                            onPause={() => setIsPlaying(false)}
                          />
                        </div>
                      ) : null
                    }
                  />
                );
              })}
            </div>
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
  );
}

export default App;
