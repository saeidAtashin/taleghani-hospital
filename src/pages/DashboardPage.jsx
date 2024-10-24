import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../animation-json/developing.json";
import HeaderName from "../components/HeaderName";

const DashboardPage = () => {
  return (
    <div className="screen-width d-flex flex-column justify-content-center mx-auto align-items-center">
      <div className=" position-fixed top-0 position-relative">
        <HeaderName
          HeaderName={"در حال توسعه"}
          className={"mt-5 z-3 text-center position-absolute "}
        />
        <Lottie className="" loop play animationData={animationData} />
      </div>
    </div>
  );
};

export default DashboardPage;
