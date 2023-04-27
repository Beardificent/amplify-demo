import React, { useEffect, useState } from "react";
import { AccountSettings, Grid, Card, Button } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Storage } from "aws-amplify";
import awsconfig from "../../aws-exports";
import { Avatar } from "@mui/material";
import { Formik, Form } from "formik";
import { UpdateNameEmailForm } from "../../forms";

Storage.configure(awsconfig);

const ProfileContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ProfileName = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
`;

const ProfileEmail = styled.p`
  font-size: 18px;
`;

const BorderWrapper = styled(Card)`
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const BackButton = styled(Button)`
  margin-top: 16px;
`;

const ChangePassword = styled(AccountSettings.ChangePassword)`
  border-radius: 8px;
  width: 100%;
`;

const StyledHeader = styled(Card)``;

const ProfileTypo = styled.div`
  font-size: 24px;
  font-weight: 700;
`;
const Statistics = styled(Card)`
  border: 1px solid #ccc;
  border-radius: 4px;
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
    Formik.setFieldValues("email", event.currentTarget.value);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

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

  const getUserAvatar = (name) => {
    const getInitials = (name) => {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("");
    };

    const initials = getInitials(name);
    const color = name.charAt(0).toLowerCase().charCodeAt(0) - 97; // get a number between 0-25 based on first letter

    return (
      <Avatar style={{fontSize: "56px", height: "120px", width: "120px", backgroundColor: `hsl(${color * 15}, 70%, 50%)` }}>
        {initials}
      </Avatar>
    );
  };

  return (
    <Grid
      columnGap="0.5rem"
      rowGap="0.5rem"
      templateColumns="1fr 1fr 4fr"
      templateRows="1fr 1fr"
    >
      <StyledHeader columnStart="1" columnEnd="-1">
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProfileTypo>Profile</ProfileTypo>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <BackButton onClick={handleGoBack}>Go back</BackButton>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: 'center', gap: "12px" }}>
          <div> {user && getUserAvatar(user.attributes.name)}</div>
          {user && (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <ProfileName>{user.attributes.name}</ProfileName>
              <ProfileEmail>{user.attributes.email}</ProfileEmail>
            </div>
          )}
        </div>
      </StyledHeader>
      <Statistics columnStart="1" columnEnd="2">
        <Formik onSubmit={handleSave}>
          <Form
            id="update-name-email-form"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <UpdateNameEmailForm
              nameValue={name}
              emailValue={email}
              handleChangeName={handleNameChange}
              handleChangeEmail={handleEmailChange}
            />

            <Button type="submit" variant="contained">
              Save
            </Button>
          </Form>
        </Formik>
        <h3>Files uploaded to S3:</h3>
        <p>Number of files: {files.length}</p>
        <ul>
          {files.map((file) => (
            <li key={file.key}>
              <>{file.key}</>
              <>{formatDate(file.lastModified)}</>
              <button onClick={() => handleDeleteFile(file.key)}>Delete</button>
            </li>
          ))}
        </ul>
      </Statistics>
      <ProfileContainer columnStart="2" columnEnd="3">
        <div style={{ backgroundColor: "white", width: "500px" }}>
          <ChangePassword
            onSuccess={(oldPassword, newPassword) =>
              handlePasswordChange(oldPassword, newPassword)
            }
          />
        </div>
      </ProfileContainer>
      <BorderWrapper columnStart="1" columnEnd="2" rowStart={"3"} rowEnd={"3"}>
        <AccountSettings.DeleteUser onSuccess={handleDelete} />
      </BorderWrapper>
    </Grid>
  );
};

export default ProfileScreen;
