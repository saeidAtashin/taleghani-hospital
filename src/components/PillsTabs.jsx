import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";

const PillsTabs = () => {
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
          categoryUid: category?.uid ?? "", // Add category UID for matching activeTab
          categoryName: category?.name ?? "Unknown Category",
          ordering: field?.ordering ?? 0,
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
            categoryUid: category?.uid ?? "",
            subCategoryUid: subCategory?.name ?? "Unknown Sub-Category",
            subCategoryName: subCategory?.name ?? "Unknown Sub-Category",
            ordering: field?.ordering ?? 0,
          });
        });
      });
    });

    console.log("Transformed Response:", transformed); // Debugging
    return transformed;
  };

  const groupByOrdering = (fields) => {
    const grouped = fields.reduce((groups, field) => {
      const order = field?.ordering ?? 0;
      if (!groups[order]) {
        groups[order] = [];
      }
      groups[order].push(field);
      return groups;
    }, {});

    console.log("Grouped Fields:", grouped); // Debugging
    return grouped;
  };

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await apiRequest("GET", `/tests/category-details`);
        const list = response?.data?.data?.results ?? [];

        console.log("Fetched Data:", list); // Debugging

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

  const filteredFields = apiResponse.filter(
    (field) => field?.categoryUid === activeTab
  );

  console.log("Filtered Fields:", filteredFields); // Debugging

  const groupedFields = groupByOrdering(filteredFields);

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="mb-3">
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
        {Object.keys(groupedFields).length > 0 ? (
          Object.entries(groupedFields).map(([order, fields], rowIndex) => (
            <div key={rowIndex} className="d-flex flex-wrap mb-3">
              {fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="m-2">
                  <label>
                    {field?.subCategoryName
                      ? `subCategoryName ${field?.subCategoryName} - field ${field?.name} ?.name`
                      : `categoryName ${field?.categoryName} - field ${field?.name} ?.name`}
                  </label>
                  <input
                    type={field?.type === "CHAR" ? "text" : "number"}
                    className="form-control"
                    placeholder={field?.name}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>در حال دریافت اطلاعات...</p>
        )}
      </div>
    </Tab.Container>
  );
};

export default PillsTabs;
