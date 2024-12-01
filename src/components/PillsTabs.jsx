import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { SelectButton } from "primereact/selectbutton";
import apiRequest from "../api/apiService";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [titleDirectToCateg, settitleDirectToCateg] = useState();
  const [apiResponse, setApiResponse] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [date, setDate] = useState(null);
  const arr = [0, 0, 0, 0, 1, 1, 1, 2, 2];

  const transformResponse = (response) => {
    const transformed = [];
    response?.forEach((category) => {
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
          categoryUid: category?.uid ?? "",
          categoryName: category?.name ?? "Unknown Category",
          ordering: field?.ordering ?? 0,
        });
      });

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
            subCategoryUid: subCategory?.uid ?? "",
            subCategoryName: subCategory?.name ?? "Unknown Sub-Category",
            ordering: field?.ordering ?? 0,
          });
        });
      });
    });
    return transformed;
  };

  const groupByOrdering = (fields) => {
    return fields.reduce((groups, field) => {
      const order = field?.ordering ?? 0;
      if (!groups[order]) {
        groups[order] = [];
      }
      groups[order].push(field);
      return groups;
    }, {});
  };

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await apiRequest("GET", `/tests/category-details/`);
        const list = response?.data?.data?.result ?? [];
        settabsNew(list);
        setApiResponse(transformResponse(list));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategory();
  }, []);

  useEffect(() => {
    console.log("testttttt");
    const fetchDataCategoryUId = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/${activeTab}`
        );

        console.log("title direct to category", response?.data?.data?.title);
        settitleDirectToCateg(response?.data?.data?.title);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategoryUId();
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
    setSelectedSubCategory(null);
  };

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

  const groupedFields = groupByOrdering(
    selectedSubCategory
      ? filteredFields.filter(
          (field) => field?.subCategoryName === selectedSubCategory
        )
      : filteredFields
  );

  const groupedFieldsDirectCategory = groupByOrdering(
    selectedSubCategory
      ? filteredFields.filter(
          (field) => field?.subCategoryName === selectedSubCategory
        )
      : filteredFields
  );

  const ordering = filteredFields.map((field) => field.ordering);

  const grouped = arr.reduce((acc, val) => {
    if (!acc[val]) acc[val] = [];
    acc[val].push(val);
    return acc;
  }, {});

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
      {subCategoryOptions.length > 0 && (
        <div className="mb-3">
          <SelectButton
            value={selectedSubCategory}
            options={subCategoryOptions.map((name) => ({
              label: name,
              value: name,
            }))}
            onChange={(e) => setSelectedSubCategory(e.value)}
          />
        </div>
      )}
      <div className="p-4">
        <h1>Dynamic Form</h1>
        {Object.keys(groupedFields).length > 0 ? (
          Object.entries(groupedFields)
            .sort(([orderA], [orderB]) => orderA - orderB)
            .map(([order, fields], rowIndex) => (
              <div key={rowIndex} className="d-flex flex-column flex-wrap mb-3">
                <div className="d-flex flex-column w-25">
                  <label>تاریخ</label>
                  <Calendar value={date} onChange={(e) => setDate(e.value)} />
                </div>
                <div className="d-flex flex-row flex-wrap mt-4">
                  {fields
                    .sort((a, b) => a.ordering - b.ordering)
                    .map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="col-12 col-sm-6 col-md-4 col-lg-3 my-2 mx-2"
                      >
                        <label>{field?.name}</label>
                        {field?.options?.length > 0 ? (
                          <Dropdown
                            value={field?.value}
                            options={field?.options}
                            onChange={(e) => field?.onChange(e.value)}
                            optionLabel="name"
                            optionValue="uid"
                            placeholder={`${field?.name}`}
                            className="w-100"
                          />
                        ) : (
                          <input
                            type={field?.type === "CHAR" ? "text" : "number"}
                            className="form-control"
                            placeholder={field?.name}
                          />
                        )}
                      </div>
                    ))}
                </div>
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
