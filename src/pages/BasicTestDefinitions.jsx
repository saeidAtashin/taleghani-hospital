import React from "react";
import TabComponent from "../components/TabComponent";
import PillsTabs from "../components/PillsTabs";

const BasicTestDefinitions = () => {
  return (
    <div className="d-flex flex-column w-100">
      <TabComponent />
      <div className="m-5">
        <PillsTabs />
      </div>
    </div>
  );
};

export default BasicTestDefinitions;
