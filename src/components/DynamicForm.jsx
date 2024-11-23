import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const DynamicForm = ({ data }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // To track validation errors

  // Handle input change for both text and select inputs
  const handleInputChange = (fieldUid, value, fieldType) => {
    let valid = true;
    let transformedValue = value;

    // Validate and transform value based on type
    if (fieldType === "FLOAT") {
      transformedValue = parseFloat(value);
      if (isNaN(transformedValue)) {
        valid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: "Please enter a valid number.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: null,
        }));
      }
    } else if (fieldType === "PERCENTAGE") {
      transformedValue = parseFloat(value);
      if (
        isNaN(transformedValue) ||
        transformedValue < 0 ||
        transformedValue > 100
      ) {
        valid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: "Please enter a number between 0 and 100.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: null,
        }));
      }
    } else if (fieldType === "CHAR") {
      transformedValue = value;
      if (typeof transformedValue !== "string") {
        valid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: "Please enter a valid string.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldUid]: null,
        }));
      }
    }

    // Update state if valid
    if (valid) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldUid]: transformedValue,
      }));
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) {
      console.log("Form has errors:", errors);
      return;
    }
    console.log("Form Data:", formData);
  };

  return (
    <div className="p-fluid">
      {data.map((field) => (
        <div key={field.uid} className="p-field">
          <label htmlFor={field.uid}>{field.name || "Unnamed Field"}</label>
          {field.options && field.options.length > 0 ? (
            <Dropdown
              id={field.uid}
              value={formData[field.uid] || ""}
              options={field.options.map((option) => ({
                label: option.name || "",
                value: option.name,
              }))}
              onChange={(e) =>
                handleInputChange(field.uid, e.value, field.type)
              }
              placeholder="Select an option"
            />
          ) : (
            <InputText
              id={field.uid}
              value={formData[field.uid] || ""}
              onChange={(e) =>
                handleInputChange(field.uid, e.target.value, field.type)
              }
              placeholder="Enter value"
            />
          )}
          {errors[field.uid] && (
            <small className="p-error">{errors[field.uid]}</small>
          )}
        </div>
      ))}
      <Button label="Submit" onClick={handleSubmit} />
    </div>
  );
};

export default DynamicForm;
