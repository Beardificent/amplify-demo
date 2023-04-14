import "./App.css";
import { Amplify, API, graphqlOperation, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import {
  Paper,
  IconButton,
  TextField,
  Fab,
  Container,
  Button,
  Modal,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";
import { listSongs } from "./graphql/queries";
import { updateSong, createSong } from "./graphql/mutations";
import ReactPlayer from "react-player";
import { v4 as uuid } from "uuid";
import { UserPaper } from "./components/Paper";
import Grid2 from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

  const AddSong = ({ onUpload, onCancel }) => {
    const [songData, setSongData] = useState({});
    const [mp3Data, setMp3Data] = useState();

    const uploadSong = async () => {
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
      <Modal open={true}>
        <Paper
          className="newSong"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "16px",
          }}
        >
          <TextField
            label="Title"
            value={songData.title}
            onChange={(e) =>
              setSongData({ ...songData, title: e.target.value })
            }
          />
          <TextField
            label="Artist"
            value={songData.owner}
            onChange={(e) =>
              setSongData({ ...songData, owner: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={songData.description}
            onChange={(e) =>
              setSongData({ ...songData, description: e.target.value })
            }
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <input
              style={{
                padding: "4px",
                borderRadius: "8px",
              }}
              type="file"
              accept="audio/mp3"
              onChange={(e) => setMp3Data(e.target.files[0])}
            />
            <IconButton onClick={uploadSong}>
              <PublishIcon fontSize="large" color="primary" />
            </IconButton>
            <IconButton onClick={onCancel}>
              <CancelIcon fontSize={"large"} color="action" />
            </IconButton>
          </div>
        </Paper>
      </Modal>
    );
  };

  const BasicMenu = ({ onSignOut, onAddSong }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
          <MenuItem onClick={onAddSong}>Add Song</MenuItem>
          <MenuItem onClick={handleClose}>Close Menu</MenuItem>
        </Menu>
      </div>
    );
  };

  useEffect(() => {
    fetchSongs();
  }, []);
  return (
    <Container maxWidth="xxl" className="appContainer">
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <UserPaper>
              <p>Hey {user.username}, you are authorized to see this.</p>
              <BasicMenu
                onSignOut={signOut}
                onAddSong={() => setShowAddNewSong(true)}
              />
              <div></div>
            </UserPaper>
            <div className="songList">
              {songs.map((song, idx) => {
                return (
                  <Paper variant="outlined" key={`song${idx}`}>
                    <Grid2 container spacing={2} className="songCard">
                      <Grid2 xs={3}>
                        <Item>
                          <IconButton
                            aria-label="play"
                            onClick={() => toggleSong(idx)}
                          >
                            {songPlaying === idx ? (
                              <PauseIcon />
                            ) : (
                              <PlayArrowIcon />
                            )}
                          </IconButton>
                        </Item>
                      </Grid2>
                      <Grid2 xs={3}>
                        <Item>
                          <div className="songContainer">
                            <div className="songTitle">{song.title}</div>
                            <div className="songOwner">{song.owner}</div>
                          </div>
                        </Item>
                      </Grid2>
                      <Grid2 xs={3}>
                        <Item>
                          <div>
                            <IconButton
                              aria-label="like"
                              onClick={() => addLike(idx)}
                            >
                              <FavoriteIcon />
                            </IconButton>
                            {song.likes}
                          </div>
                        </Item>
                      </Grid2>
                      <Grid2 xs={3}>
                        <Item>
                          <div className="songDescription">
                            {song.description}
                          </div>
                        </Item>
                      </Grid2>
                    </Grid2>
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
                  </Paper>
                );
              })}
            </div>
            {/* ADD SONG MODAL */}
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
