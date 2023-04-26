import React, { useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { OnClickOutside } from "../../../constants";

const Dashboard = ({ onSignOut, onAddSong }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { ref } = OnClickOutside(() => {
    setAnchorEl(null);
  });
  return (
    <div>
      <Button
        variation="primary"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <div ref={ref}>
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
    </div>
  );
};

export default Dashboard;
