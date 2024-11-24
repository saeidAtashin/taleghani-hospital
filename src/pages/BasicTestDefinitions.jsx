import React from "react";
import TabComponent from "../components/TabComponent";
import PillsTabs from "../components/PillsTabs";

const BasicTestDefinitions = () => {
  return (
    <div className="d-flex flex-column w-100">
      <TabComponent />
      <PillsTabs />
    </div>
  );
};

export default BasicTestDefinitions;
