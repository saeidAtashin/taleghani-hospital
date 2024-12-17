import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";

const PillsTabsTasvir = ({ tabs, dataOfTable, allrow }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");

  useEffect(() => {
    console.log("tab.title", tabs);
    console.log("record_type", dataOfTable?.uid);

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

  // Helper function to check the state and return corresponding color
  const getTabBadgeColor = (tab) => {
    // Find the first matching row for the current tab's eventKey
    const matchingRow = allrow.find((row) => row.record_type === tab.eventKey);

    // If a matching row is found and its state is "IN_PROGRESS", return the orange color
    if (matchingRow && matchingRow.state === "IN_PROGRESS") {
      return "#ff9008"; // Orange color
    }
    if (matchingRow && matchingRow.state === "DONE") {
      return "#28a745"; // Orange color
    }
    // "DONE"
    return null; // Green color
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="">
        {tabs.map((tab, index) => {
          const badgeColor = getTabBadgeColor(tab); // Get badge color based on state
          const isActive = activeTab === tab.title; // Check if tab is active
          return (
            <Nav.Item key={index} className="m-2 position-relative">
              <Nav.Link
                className={`border ${isActive ? "active-tab" : ""}`} // Apply active class to active tab
                eventKey={tab.title}
              >
                {tab.title}
                {/* Top-right color indicator */}
                {badgeColor && (
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: badgeColor, // Use the color based on state
                    }}
                  ></span>
                )}
              </Nav.Link>
            </Nav.Item>
          );
        })}
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
