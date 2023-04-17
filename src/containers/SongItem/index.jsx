import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import { Paper, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { SongTitleAndOwner, SongDescription } from "../../components";

const SongItem = ({
  songIndex,
  title,
  owner,
  likes,
  description,
  toggleSong,
  addLike,
  reactPlayer,
  songPlaying,
}) => {
  return (
    <Paper variant="outlined" key={`song${songIndex}`}>
      <Grid2 container spacing={6} className="songCard">
        <Grid2 xs={3}>
          <Item>
            <IconButton aria-label="play" onClick={() => toggleSong(songIndex)}>
              {songPlaying === songIndex ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Item>
        </Grid2>
        <Grid2 xs={3}>
          <Item>
            <div className="songContainer">
              <SongTitleAndOwner title={title} owner={owner} />
            </div>
          </Item>
        </Grid2>
        <Grid2 xs={3}>
          <Item>
            <div>
              <IconButton aria-label="like" onClick={() => addLike(songIndex)}>
                <FavoriteIcon />
              </IconButton>
              {likes}
            </div>
          </Item>
        </Grid2>
        <Grid2 xs={3}>
          <Item>
            <SongDescription description={description} />
          </Item>
        </Grid2>
      </Grid2>
      {reactPlayer}
    </Paper>
  );
};

export default SongItem;
