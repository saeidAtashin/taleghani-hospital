import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";

const PillsTabsTasvir = ({ tabs, dataOfTable }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");

  useEffect(() => {
    console.log("tab.title", tabs);
    console.log("record_type", dataOfTable.record_type);

    if (dataOfTable?.record_type) {
      const matchedTab = tabs.find(
        (tab) => tab?.eventKey === dataOfTable?.record_type
      );
      if (matchedTab) {
        setActiveTab(matchedTab.title);
      }
    }
  }, [dataOfTable, tabs]);

  const handleSelect = (title) => {
    setActiveTab(title);
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="">
        {tabs.map((tab, index) => (
          <Nav.Item key={index} className="m-2">
            <Nav.Link className="border" eventKey={tab.title}>
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <h4 className="my-4 mx-2">ثبت {activeTab} جدید</h4>
      <Tab.Content className="mt-3">
        {tabs.map((tab, index) => (
          <Tab.Pane eventKey={tab.title} key={index}>
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabsTasvir;
