import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";
import DynamicForm from "./DynamicForm";

const PillsTabs = ({ tabs }) => {
  const [tabsNew, settabsNew] = useState();
  const [apiResponse, setApiResponse] = useState([]);

  const transformResponse = (response) => {
    const transformed = [];

    response?.forEach((category) => {
      // Process root fields
      category?.field?.forEach((field) => {
        transformed.push({
          name: field?.name ?? "Unknown Field",
          uid: field?.uid ?? "",
          options:
            field?.options?.map((option) => ({
              name: option?.name ?? "Unknown Option",
              uid: option?.uid ?? "",
            })) ?? [],
          type: field?.type ?? "Unknown Type",
          category: category?.name ?? "Unknown Category", // Adding category for context
        });
      });

      // Process sub-category fields
      category?.sub_category?.forEach((subCategory) => {
        subCategory?.field?.forEach((field) => {
          transformed.push({
            name: field?.name ?? "Unknown Field",
            uid: field?.uid ?? "",
            options:
              field?.options?.map((option) => ({
                name: option?.name ?? "Unknown Option",
                uid: option?.uid ?? "",
              })) ?? [],
            type: field?.type ?? "Unknown Type",
            subCategory: subCategory?.name ?? "Unknown Sub-Category", // Adding sub-category for context
          });
        });

        // Process title fields if present
        subCategory?.title?.forEach((title) => {
          transformed.push({
            name: title?.name ?? "Unknown Title",
            uid: title?.uid ?? "",
            options:
              title?.options?.map((option) => ({
                name: option?.name ?? "Unknown Option",
                uid: option?.uid ?? "",
              })) ?? [],
            type: title?.type ?? "Unknown Type",
            subCategory: subCategory?.name ?? "Unknown Sub-Category", // Adding sub-category for context
          });
        });
      });
    });

    return transformed;
  };

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await apiRequest("GET", `/tests/category-details`);
        const list = response?.data?.data?.results ?? [];

        console.log(
          "response?.data?.data tttttttttttttttttttttttttttttttttttttttttttt",
          response?.data?.data?.results
        );
        console.log("Fetched Data:", list);
        settabsNew(list); // Tabs for navigation
        setApiResponse(transformResponse(list)); // Transformed data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategory();
  }, []);

  const [activeTab, setActiveTab] = useState("");

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="">
        {tabsNew?.map((tab, index) => (
          <Nav.Item key={index} className="m-2">
            <Nav.Link className="border" eventKey={tab?.uid ?? ""}>
              {tab?.name ?? "Unknown Tab"}
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
          <Tab.Pane eventKey={tab?.uid ?? ""} key={index}>
            {tab?.content ?? "No Content Available"}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabs;

// I want all field sub_category.field, title.field, if its root field, show a category side of input, if its sub_category.field show a sub_category side of field and ...

// make all response like apiResponse object
