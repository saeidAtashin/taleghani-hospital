import React, { useState } from "react";
import "./DashboardPage.css";
import "../script";
import ReusableForm from "../ReusableForm/ReusableForm";
const DashboardPage = () => {
  const formFields = [
    {
      type: "text",
      label: "Username",
      name: "username",
      placeholder: "Enter username",
      defaultValue: "",
      required: true,
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Enter email",
      defaultValue: "",
      required: true,
    },
    {
      type: "password",
      label: "Password",
      name: "password",
      placeholder: "Enter password",
      defaultValue: "",
      required: true,
    },
    {
      type: "select",
      label: "Role",
      name: "role",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "guest", label: "Guest" },
      ],
      placeholder: "Select role",
      defaultValue: "user",
      required: true,
    },

    {
      type: "select",
      label: "Second Select",
      name: "rolesec",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "select",
      defaultValue: "0",
      required: true,
    },
    {
      type: "checkbox",
      label: "Accept terms and conditions",
      name: "termsAccepted",
      defaultValue: false,
    },
  ];

  const handleFormSubmit = (data) => {
    console.log("Submitted Data:", data);
  };
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="">
      <ReusableForm fields={formFields} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default DashboardPage;
