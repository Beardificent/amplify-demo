import React from "react";
import { Field } from "formik";
import { TextField } from "@aws-amplify/ui-react";

const UpdateNameEmailForm = ({
  nameValue,
  emailValue,
  handleChangeEmail,
  handleChangeName,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
      <Field
        name="name"
        component={TextField}
        label="Name"
        variant="outlined"
        fullWidth
        onChange={handleChangeName}
        value={nameValue}
      />
      <Field
        name="email"
        component={TextField}
        label="Email"
        variant="outlined"
        fullWidth
        onChange={handleChangeEmail}
        value={emailValue}
      />
    </div>
  );
};

export default UpdateNameEmailForm;
