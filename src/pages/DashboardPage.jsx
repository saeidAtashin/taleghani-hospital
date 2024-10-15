import React, { useState } from "react";
import "./DashboardPage.css";
import "../script";
import ReusableForm from "../ReusableForm/ReusableForm";
const DashboardPage = () => {
  const formFields = [
    {
      type: "text",
      label: "کد ملی",
      name: "nationalNumber",
      placeholder: "کد ملی بیمار را وارد نمایید",
      required: true,
    },
    {
      type: "email",
      label: "نام پزشک معرف",
      name: "pezeshkemoaref",
      placeholder: "نام پزشک را وارد نمایید",
      required: true,
    },
    {
      type: "text",
      label: "نام",
      name: "name",
      placeholder: "نام بیمار را وارد نمایید",
      required: true,
    },
    {
      type: "password",
      label: "نام خانوادگی",
      name: "lastname",
      placeholder: "نام خانوادگی را وارد نمایید",
      required: true,
    },
    {
      type: "select",
      label: "جنسیت",
      name: "role",
      options: [
        { value: "male", label: "مرد" },
        { value: "female", label: "زن" },
      ],
      placeholder: "جنسیت را انتخاب نمایید",
      required: true,
    },
    {
      type: "checkbox",
      label: "چک باکس",
      name: "termsAccepted",
    },
  ];

  const handleFormSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="">
      <ReusableForm fields={formFields} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default DashboardPage;
