import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";
import DynamicForm from "./DynamicForm";

const PillsTabs = ({ tabs }) => {
  const [tabsNew, settabsNew] = useState();

  const apiResponse = [
    {
      name: "RH",
      uid: "51ca4e02-3977-4206-9e0a-6cda0db40abe",
      options: [
        { name: "Option 1", uid: "1bc624ed-8142-42f2-97ed-73cf7291ae92" },
        { name: "Option 2", uid: "b3e99894-5da8-49dd-9319-7c8497c11b22" },
      ],
      type: "CHAR",
    },
    {
      name: "Blood Group",
      uid: "1ee32199-a873-4a8a-8f6b-12cd45e36f14",
      options: [
        { name: "A+", uid: "525dd610-d749-4500-a0e1-210dd2f29c7b" },
        { name: "O-", uid: "6577a3b5-2e48-4f79-a937-7ea24558b3ae" },
      ],
      type: "CHAR",
    },
    {
      name: "test3",
      uid: "96eeb55f-d6c1-4fd4-8062-78c4759f9c6e",
      options: [],
      type: "CHAR",
    },
  ];

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await apiRequest("GET", `/tests/category-details`);
        const list = response.data.data.results;
        console.log("response.data.data.results", response.data.data.results);
        settabsNew(response?.data?.data?.results);
        // setProducts(patients);
        console.log("object");
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchDataCategory();
  }, []);

  const [activeTab, setActiveTab] = useState("");

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid);
    return () => {};
  }, [tabsNew]);

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="">
        {tabsNew?.map((tab, index) => (
          <Nav.Item key={index} className="m-2">
            <Nav.Link className="border" eventKey={tab.uid}>
              {tab.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <h4 className="my-4 mx-2">ثبت {activeTab} جدید</h4>
      <div className="p-4">
        <h1>Dynamic Form</h1>
        <DynamicForm data={apiResponse} />
      </div>
      <Tab.Content className="mt-3">
        {tabs.map((tab, index) => (
          <Tab.Pane eventKey={tab.uid} key={index}>
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabs;
