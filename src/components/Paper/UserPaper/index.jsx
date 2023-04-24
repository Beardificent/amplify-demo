import React from "react";
import ProfileCard from "../../../ui-components/ProfileCard";


const UserPaper = ({ children, userName, role, id }) => {
  return <ProfileCard userName={userName} Role={role} id={id}/>;
};
export default UserPaper;
