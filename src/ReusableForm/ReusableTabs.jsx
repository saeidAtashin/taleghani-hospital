import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableTabs = ({ tabs, activeTabForce, setActiveTabForce }) => {
  const [activeKey, setActiveKey] = useState(tabs[4]?.key || "اطلاعات هویتی");

  useEffect(() => {
    if (activeTabForce) {
      setActiveKey(activeTabForce);
    }
  }, [activeTabForce]);

  return (
    <Tabs
      className="flex-nowrap overflow-x-auto text-nowrap"
      activeKey={activeKey}
      onSelect={(key) => {
        setActiveKey(key);
        if (setActiveTabForce) {
          setActiveTabForce(key);
        }
      }}
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
