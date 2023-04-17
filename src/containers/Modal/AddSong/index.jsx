import React, { useState } from "react";
import { createSong } from "../../../graphql/mutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";
import { Paper, IconButton, TextField, Modal } from "@mui/material";
import { v4 as uuid } from "uuid";

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
    await API.graphql(graphqlOperation(createSong, { input: createSongInput }));
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

export default AddSong;
