import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import DropD from "./DropD";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "zaman";

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [tabsNewTitle, settabsNewTitle] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [apiResponse, setApiResponse] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [date, setDate] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      date: date, // Set the default value for date
    },
  });

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

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    const additionalData = {
      // batch_uid
      category_uid: activeTab,
      patient_uid: "Some additional info",
    };

    const fields = titleDirectToCategList?.map((titleDirectToCat) => {
      const fieldValue = data[titleDirectToCat?.uid]; // Get the value from react-hook-form by the field uid
      const fieldNameUid = titleDirectToCat?.uid; // Field UID

      return {
        uid: fieldNameUid, // The field UID
        value: fieldValue
          ? Array.isArray(fieldValue)
            ? fieldValue
            : [fieldValue]
          : [], // Ensure value is an array
      };
    });

    // Create the final data object with 'fields' array
    const formDataWithExtraData = {
      fields: fields,
      ...additionalData, // Merge additional data
    };

    // Submit or log the data
    console.log("Form Data with Fields and Extra Info:", formDataWithExtraData);
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 mb-5">
          <h1>Dynamic Form</h1>

          {/* Date Field */}
          <div className="d-flex flex-column">
            <label className="label" htmlFor="date">
              تاریخ
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value || date}
                  onChange={(e) => {
                    field.onChange(e.value.toLocaleDateString("en-CA"));
                  }}
                  round="x4"
                  position="center"
                  className="p-2"
                />
              )}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date.message}</div>
            )}
          </div>

          {/* Dynamic Dropdowns or Inputs */}
          <div>
            {titleDirectToCategList?.map((titleDirectToCat) => (
              <div
                className="flex flex-column gap-2 mt-4"
                key={titleDirectToCat?.uid}
              >
                <label htmlFor={titleDirectToCat?.uid}>
                  {titleDirectToCat?.name}
                </label>
                <div className="mt-2">
                  {titleDirectToCat?.options?.length > 0 ? (
                    <Controller
                      name={titleDirectToCat?.uid}
                      control={control}
                      render={({ field }) => (
                        <DropD
                          titleDirectToCat={titleDirectToCat}
                          selectedValue={field.value} // Pass field value
                          setSelectedValue={(value) => field.onChange(value)} // Use react-hook-form's setter
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      name={titleDirectToCat?.uid}
                      control={control}
                      render={({ field }) => (
                        <InputText
                          {...field} // Spread react-hook-form's field props
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
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="p-button p-component">
            Submit
          </button>
        </div>
      </form>
    </Tab.Container>
  );
};

export default PillsTabs;
