import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const DynamicForm = ({ data }) => {
  const [formData, setFormData] = useState({});

  // Handle input change for both text and select inputs
  const handleInputChange = (fieldUid, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldUid]: value,
    }));
  };

  const handleSubmit = () => {
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
              onChange={(e) => handleInputChange(field.uid, e.value)}
              placeholder="Select an option"
            />
          ) : (
            <InputText
              id={field.uid}
              value={formData[field.uid] || ""}
              onChange={(e) => handleInputChange(field.uid, e.target.value)}
              placeholder="Enter value"
            />
          )}
        </div>
      ))}
      <Button label="Submit" onClick={handleSubmit} />
    </div>
  );
};

export default DynamicForm;
