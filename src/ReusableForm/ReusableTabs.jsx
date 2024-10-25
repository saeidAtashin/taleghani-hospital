import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableTabs = ({ tabs, defaultActiveKey }) => {
  return (
    <Tabs
      defaultActiveKey={defaultActiveKey || tabs[0]?.key}
      id="reusable-tabs"
    >
      {tabs.map((tab, index) => (
        <Tab eventKey={tab.key} title={tab.label} key={index}>
          {tab.content}
        </Tab>
      ))}
    </Tabs>
  );
};

export default ReusableTabs;
