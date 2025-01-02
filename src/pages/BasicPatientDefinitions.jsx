import React from "react";
import HorizontalNavbar from "../components/HorizontalNavbar";

const BasicPatientDefinitions = () => {
  const links = [
    { label: "Home", path: "/dashboard/basic-patient-definitions/home" },
    { label: "About", path: "about" },
    { label: "Services", path: "services" },
    { label: "Contact", path: "contact" },
  ];

  return (
    <>
      <HorizontalNavbar />
    </>
  );
};

export default BasicPatientDefinitions;
