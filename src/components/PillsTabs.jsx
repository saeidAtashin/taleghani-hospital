import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { SelectButton } from "primereact/selectbutton";
import apiRequest from "../api/apiService";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [tabsNewTitle, settabsNewTitle] = useState();
  const [titleDirectToCateg, settitleDirectToCateg] = useState();
  const [apiResponse, setApiResponse] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [date, setDate] = useState(null);
  const arr = [0, 0, 0, 0, 1, 1, 1, 2, 2];

  console.log("activeTab", activeTab);

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await apiRequest("GET", `/tests/category-details/`);
        const list = response?.data?.data?.result ?? [];
        setApiResponse(response?.data?.data?.result);
        settabsNew(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategory();
  }, []);

  useEffect(() => {
    const fetchDataCategoryUId = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/${activeTab}`
        );

        console.log("category-details/activeTab", response?.data?.data);
        // settitleDirectToCateg(transformResponse(response?.data?.data?.title));
        settabsNewTitle(response?.data?.data?.title);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategoryUId();
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  const filteredFields = apiResponse.filter(
    (field) => field?.categoryUid === activeTab
  );

  const subCategoryOptions = [
    ...new Set(
      filteredFields
        .map((field) => field?.subCategoryName)
        .filter((name) => name)
    ),
  ];

  useEffect(() => {
    if (!selectedSubCategory && subCategoryOptions.length > 0) {
      setSelectedSubCategory(subCategoryOptions[0]);
    }
  }, [subCategoryOptions, selectedSubCategory]);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

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
      </div>
    </Tab.Container>
  );
};

export default PillsTabs;
