import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import SonographyForm from "./SonographyForm";
import Mammography from "./Mammography";
import Mri from "./Mri";
import Ctscan from "./Ctscan";
import ScanHastei from "./ScanHastei";
import Petscan from "./Petscan";
import SampleGraphy from "./SampleGraphy";

const PillsTabsTasvir = ({ dataOfTable, allrow }) => {
  const tabsInnerImage = [
    {
      eventKey: "sonography",
      title: "سونوگرافی",
      content: <SonographyForm />,
    },
    {
      eventKey: "mammography",
      title: "ماموگرافی",
      content: <Mammography />,
    },
    {
      eventKey: "mri",
      title: "MRI",
      content: <Mri />,
    },
    {
      eventKey: "ctscan",
      title: "CT-Scan",
      content: <Ctscan />,
    },
    {
      eventKey: "corescan",
      title: "اسکن هسته ای",
      content: <ScanHastei />,
    },
    {
      eventKey: "petscan",
      title: "PET-Scan",
      content: <Petscan />,
    },
    {
      eventKey: "othergraphy",
      title: "گرافی ساده",
      content: <SampleGraphy />,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabsInnerImage[0]?.eventKey || "");

  useEffect(() => {
    if (dataOfTable?.record_type) {
      const matchedTab = tabsInnerImage.find(
        (tab) => tab.eventKey === dataOfTable.record_type
      );
      if (matchedTab) {
        setActiveTab(matchedTab.eventKey);
      }
    }
  }, [dataOfTable]);

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  const getTabBadgeColor = (tab) => {
    const matchingRow = allrow.find((row) => row.record_type === tab.eventKey);
    if (matchingRow && matchingRow.state === "IN_PROGRESS") {
      return "#ff9008"; // Orange
    }
    if (matchingRow && matchingRow.state === "DONE") {
      return "#3ff369"; // Green
    }
    return null;
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills">
        {tabsInnerImage.map((tab) => {
          const badgeColor = getTabBadgeColor(tab);
          const isActive = activeTab === tab.eventKey;
          return (
            <Nav.Item key={tab.eventKey} className="m-2 position-relative">
              <Nav.Link
                className={`border ${isActive ? "active-tab" : ""}`}
                eventKey={tab.eventKey}
              >
                {tab.title}
                {badgeColor && (
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: badgeColor,
                    }}
                  ></span>
                )}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <h4 className="my-4 mx-2">
        ثبت {tabsInnerImage.find((t) => t.eventKey === activeTab)?.title} جدید
      </h4>
      <Tab.Content className="mt-3">
        {tabsInnerImage.map((tab) => (
          <Tab.Pane eventKey={tab.eventKey} key={tab.eventKey}>
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabsTasvir;
