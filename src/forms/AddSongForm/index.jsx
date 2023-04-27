import React, { useState } from "react";
import { Field, Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { createSong } from "../../graphql/mutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, TextField } from "@mui/material";
import { v4 as uuid } from "uuid";
import { FileUploader } from "../../components";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const AddSongForm = ({ onUpload, onCancel }) => {
  const [songData, setSongData] = useState({});
  const [mp3Data, setMp3Data] = useState();
  const [fileToUpload, setFileToUpload] = useState("");

  const uploadSong = async () => {
    console.log("songData", songData);
    const { title, description, owner } = songData;
    const metadata = { title, description, owner };
    const { key } = await Storage.put(`${uuid()}.mp3`, mp3Data, {
      contentType: "audio/mp3",
      metadata,
    });
    const createSongInput = {
      id: uuid(),
      title,
      description,
      owner,
      filePath: key,
      likes: 0,
    };
    try {
      await API.graphql(
        graphqlOperation(createSong, { input: createSongInput })
      );
      onUpload();
    } catch (error) {
      console.log(error);
      formik.setErrors({ publishIcon: error.message });
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Required").min(10, "more needed"),
    owner: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });
  const initialValues = {
    title: "",
    owner: "",
    description: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await formik.validateForm();
      if (formik.isValid) {
        setSongData(values);
        uploadSong();
      }
    },
  });

  return (
    <>
      <Formik {...formik}>
        <Form
          id="add-song-form"
          style={{ display: "flex", gap: "8px" }}
          onSubmit={async (e) => {
            e.preventDefault();
          }}
        >
          <Field
            component={TextField}
            name="title"
            label="Title"
            id="title"
            value={songData.title}
            onChange={(e) => {
              setSongData({ ...songData, title: e.target.value });
              formik.setFieldValue("title", e.currentTarget.value);
            }}
            error={formik.errors.title && formik.touched.title}
            helperText={
              !formik.isValid &&
              formik.errors.title && (
                <div style={{ color: "red" }}>Please give me 10 characters</div>
              )
            }
            touched={formik.touched.title}
          />
          <Field
            component={TextField}
            name="owner"
            label="Artist"
            id="owner"
            value={songData.owner}
            onChange={(e) => {
              setSongData({ ...songData, owner: e.target.value });
              formik.setFieldValue("owner", e.currentTarget.value);
            }}
            error={formik.errors.owner && formik.touched.owner}
            helperText={
              !formik.isValid &&
              formik.errors.owner && (
                <div style={{ color: "red" }}>Please complete me</div>
              )
            }
            touched={!!formik.touched.owner}
          />
          <Field
            component={TextField}
            label="Description"
            name="description"
            id="description"
            value={songData.description}
            onChange={(e) => {
              setSongData({ ...songData, description: e.target.value });
              formik.setFieldValue("description", e.currentTarget.value);
            }}
            error={formik.errors.description && formik.touched.description}
            helperText={
              !formik.isValid &&
              formik.errors.description && (
                <div style={{ color: "red" }}>Please complete me</div>
              )
            }
            touched={!!formik.touched.description}
          />
        </Form>
      </Formik>
      <Wrapper>
        <FileUploader
          handleChange={(e) => {
            setMp3Data(e.target.files[0]);
            setFileToUpload(e.target.files[0]);
          }}
          fileToUpload={fileToUpload.name}
        />
        <IconButton
          onClick={() => {
            formik.handleSubmit();
          }}
          type="submit"
          form="add-song-form"
          disabled={formik.isValid ? false : true}
        >
          <PublishIcon
            fontSize="large"
            color={formik.isValid ? "primary" : "error"}
            aria-label="confirm-upload-icon"
          />
        </IconButton>
        <IconButton onClick={onCancel}>
          <CancelIcon
            fontSize={"large"}
            color="action"
            aria-label="cancel-upload-icon"
          />
        </IconButton>
      </Wrapper>
    </>
  );
};

export default AddSongForm;
