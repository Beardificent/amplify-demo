import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation, Storage } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import awsconfig from "../../aws-exports";
import { listSongs } from "../../graphql/queries";
import { UserPaper } from "../../components/Paper";
import { Dashboard, AddSong, SongList } from "../../containers";
import { components, formFields } from "../../containers/Authenticator";
import styled from "styled-components";

Amplify.configure(awsconfig);
Storage.configure(awsconfig);

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 24px;
`;

const Scroll = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 400px;
  height: 100%;
`;

const HomeScreen = () => {
  const [_, setSongs] = useState([]);
  const [showAddSong, setShowAddNewSong] = useState(false);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log(songData.data);
      console.log("song list", songList);
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);
  return (
    <Authenticator components={components} formFields={formFields}>
      {({ signOut, user }) => (
        <>
          <Wrapper>
            <UserPaper
              userName={user.attributes.name}
              role={"Sitter at Ventura"}
            />
            <Dashboard
              onSignOut={signOut}
              onAddSong={() => setShowAddNewSong(true)}
            />
          </Wrapper>
          <Scroll>
            <SongList />
          </Scroll>
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
  );
};

export default HomeScreen;
