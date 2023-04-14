/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSong = /* GraphQL */ `
  subscription OnCreateSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onCreateSong(filter: $filter, owner: $owner) {
      id
      title
      description
      filePath
      likes
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSong = /* GraphQL */ `
  subscription OnUpdateSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onUpdateSong(filter: $filter, owner: $owner) {
      id
      title
      description
      filePath
      likes
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSong = /* GraphQL */ `
  subscription OnDeleteSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onDeleteSong(filter: $filter, owner: $owner) {
      id
      title
      description
      filePath
      likes
      owner
      createdAt
      updatedAt
    }
  }
`;
