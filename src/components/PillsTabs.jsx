import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { SelectButton } from "primereact/selectbutton";
import apiRequest from "../api/apiService";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import DropD from "./DropD";

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [tabsNewTitle, settabsNewTitle] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});

  const [apiResponse, setApiResponse] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [date, setDate] = useState(null);
  const arr = [0, 0, 0, 0, 1, 1, 1, 2, 2];

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

        console.log("category-details", response?.data?.data);
        console.log("titleDirectToCategList", response?.data?.data?.field);
        settitleDirectToCategList(response?.data?.data?.field);
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

  const handleSelectValue = (id, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [id]: value, // Dynamically update the selected value for the specific dropdown
    }));
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

      <div className="p-4 mb-5">
        <h1>Dynamic Form</h1>
        <div>
          {titleDirectToCategList?.map((titleDirectToCat, index) => (
            <>
              <div className="flex flex-column gap-2 mt-4">
                <label htmlFor="username">{titleDirectToCat?.name}</label>
                <div className="mt-2">
                  {titleDirectToCat?.options?.length > 0 ? (
                    <DropD
                      titleDirectToCat={titleDirectToCat}
                      selectedValue={selectedValues[titleDirectToCat?.uid]} // Use titleDirectToCat?.id as the key for the selected value
                      setSelectedValue={(value) =>
                        handleSelectValue(titleDirectToCat?.uid, value)
                      } // Pass the setter function
                      key={titleDirectToCat?.uid}
                    />
                  ) : (
                    <InputText
                      id="username"
                      keyfilter={
                        titleDirectToCat?.type === "CHAR"
                          ? ""
                          : titleDirectToCat?.type === "FLOAT" ||
                            titleDirectToCat?.type === "PERCENTAGE"
                          ? "int"
                          : ""
                      }
                    />
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </Tab.Container>
  );
};

export default PillsTabs;
