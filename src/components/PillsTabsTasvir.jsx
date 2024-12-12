import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";

const PillsTabsTasvir = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.eventKey || "");

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="">
        {tabs.map((tab, index) => (
          <Nav.Item key={index} className="m-2">
            <Nav.Link className="border" eventKey={tab.eventKey}>
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <h4 className="my-4 mx-2">ثبت {activeTab} جدید</h4>

      <Tab.Content className="mt-3">
        {tabs.map((tab, index) => (
          <Tab.Pane eventKey={tab.eventKey} key={index}>
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabsTasvir;
