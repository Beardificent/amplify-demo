import React, { useEffect, useState } from "react";
import { AccountSettings } from "@aws-amplify/ui-react";
import { Auth, API } from "aws-amplify";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Storage } from "aws-amplify";
import awsconfig from "../../aws-exports";

Storage.configure(awsconfig);

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ccc;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const ProfileName = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
`;

const ProfileEmail = styled.p`
  font-size: 18px;
`;

const BackButton = styled.button`
  margin-top: 16px;
`;
const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);

  //Fixme: gets an error but it does work after refresh :: if you click the Update Password after the first error, it will say 'wrong password' because it has succeeded
  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      console.log("Password changed successfully.");
    } catch (error) {
      console.log("Error changing password:", error);
    }
  };
  const handleDelete = async () => {
    console.log("Doing some clean up...");
    console.log("Done!");
    await Auth.deleteUser();
    navigate(-1); // go back to the previous page
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await Auth.updateUserAttributes(user, {
        name,
        email,
      });
      setUser(updatedUser);
      console.log("User profile updated successfully.");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleDeleteFile = async (key) => {
    try {
      await Storage.remove(key);
      setFiles(files.filter((file) => file.key !== key));
      console.log("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  console.log("hello");
  console.log(files);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData);
        setName(userData.attributes.name || "");
        setEmail(userData.attributes.email || "");
        const s3Files = await Storage.list("");
        console.log(s3Files.results);
        const audioFiles = Array.isArray(s3Files.results)
          ? s3Files.results.filter((file) => file.key.endsWith(".mp3"))
          : [];
        console.log(audioFiles);
        setFiles(audioFiles);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <ProfileContainer>
      <div>
        <h2>Profile</h2>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        <br />
        <button onClick={handleSave}>Save</button>
        <h3>Files uploaded to S3:</h3>
        <p>Number of files: {files.length}</p>
        <ul>
          {files.map((file) => (
            <li key={file.key}>
              {file.key}{" "}
              <button onClick={() => handleDeleteFile(file.key)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <ProfileAvatar />
      {user && (
        <>
          <ProfileName>{user.attributes.name}</ProfileName>
          <ProfileEmail>{user.attributes.email}</ProfileEmail>
        </>
      )}
      <div style={{ backgroundColor: "white" }}>
        <AccountSettings.ChangePassword
          onSuccess={(oldPassword, newPassword) =>
            handlePasswordChange(oldPassword, newPassword)
          }
        />
        <AccountSettings.DeleteUser onSuccess={handleDelete} />
        <BackButton onClick={handleGoBack}>Go back</BackButton>
      </div>
    </ProfileContainer>
  );
};

export default ProfileScreen;
