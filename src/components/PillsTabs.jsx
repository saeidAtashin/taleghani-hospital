import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import DropD from "./DropD";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "zaman";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { SelectButton } from "primereact/selectbutton";

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [titleOfAll, settitleOfAll] = useState();
  const [subCategory, setsubCategory] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [date, setDate] = useState(null);
  const [selectedOrdering, setSelectedOrdering] = useState([]); // Store the 'ordering' of selected options
  const [value, setValue] = useState([]); // Store selected values (multiple)

  const {
    control,
    handleSubmit,
    formState: { errors },
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
        console.log(
          "subCategory subCategory",
          response?.data?.data?.sub_category
        );
        setsubCategory(response?.data?.data?.sub_category);
        settitleOfAll(response?.data?.data?.title);
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

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const additionalData = {
      // batch_uid
      date: data?.date,
      category_uid: activeTab,
      patient_uid: "a39573c2-a8b1-4b18-bbb5-3fd44614a761",
    };

    delete data.date;

    const fields = Object.keys(data)
      .filter((key) => {
        const value = data[key];
        // Only include fields where the value is not null, undefined, or other falsy values
        return value !== null && value !== undefined && value !== "";
      })
      .map((key) => {
        const value = data[key];
        return {
          uid: key, // Only include fields with a valid value
          value: Array.isArray(value) ? [value] : value, // Ensure value is always an array
        };
      });

    const formDataWithExtraData = {
      fields: fields,
      ...additionalData,
    };

    console.log("Final Form Data:", formDataWithExtraData);

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/tests/test/",
        formDataWithExtraData
      );
      // alert("Data submitted successfully");
    } catch (error) {
      // alert("Error submitting data");
      console.error(error);
    }
  };

  const handleSelectSub = (e, options) => {
    setValue(e.value); // Update selected values

    // Update the ordering based on selected values
    const orderings = e.value.map((val) => {
      const selectedOption = options.find((option) => option.uid === val);
      return selectedOption ? selectedOption.ordering : null;
    });

    setSelectedOrdering(orderings); // Update ordering based on selected values
  };

  // console.log("titleDirectToCategList", titleDirectToCategList);
  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="mb-3">
        {tabsNew
          ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
          ?.map((tab, index) => (
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
          <div className="">
            {titleOfAll?.length > 0 &&
              titleOfAll.map((title, idx) => (
                <div key={idx} className="">
                  <h3 className="my-4">{title?.name} </h3>
                  {/* create here a form that map on title.field and if type is   */}
                  <div className="d-flex flex-wrap">
                    {title?.field
                      ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
                      ?.map((titleData) => (
                        <div
                          className="d-flex flex-wrap mb-4 ms-4 flex-column"
                          key={titleData?.uid}
                        >
                          <label htmlFor={titleData?.uid}>
                            {titleData?.name}
                          </label>
                          <div>{titleData?.ordering}</div>
                          {/* <div className="mt-2 my-4 d-flex bg-dark"> */}
                          {titleData?.options?.length > 0 ? (
                            <Controller
                              name={titleData?.uid}
                              control={control}
                              render={({ field }) => (
                                <DropD
                                  titleData={titleData}
                                  selectedValue={field.value} // Pass field value
                                  setSelectedValue={(value) =>
                                    field.onChange(value)
                                  } // Use react-hook-form's setter
                                />
                              )}
                            />
                          ) : (
                            <Controller
                              name={titleData?.uid}
                              control={control}
                              render={({ field }) => {
                                // Handle the formatting before the value is passed to react-hook-form
                                const handleValueChange = (e) => {
                                  let value = e.target.value;

                                  if (titleData?.type === "FLOAT") {
                                    // Convert to a float with one decimal place
                                    // value = parseFloat(value).toFixed(1);
                                    // Ensure that if it's an integer, it becomes a float (e.g., 10 -> 10.0)
                                    value = parseFloat(value);
                                  } else if (titleData?.type === "PERCENTAGE") {
                                    // Ensure that the value is treated as a number (remove the percentage sign)
                                    value = parseFloat(value);
                                  } else if (titleData?.type === "CHAR") {
                                    // Ensure it's treated as a string
                                    value = value.toString();
                                  }

                                  // Update the field value using react-hook-form's `onChange` handler
                                  field.onChange(value);
                                };

                                return (
                                  <InputText
                                    {...field} // Spread react-hook-form's field props
                                    onChange={handleValueChange} // Custom change handler
                                    keyfilter={
                                      titleData?.type === "CHAR"
                                        ? ""
                                        : titleData?.type === "FLOAT" ||
                                          titleData?.type === "PERCENTAGE"
                                        ? "decimal" // Allow only numbers for FLOAT and PERCENTAGE
                                        : ""
                                    }
                                    placeholder={`${titleData?.name} را وارد نمایید`}
                                  />
                                );
                              }}
                            />
                          )}
                          {/* </div> */}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
          {/* Dynamic Dropdowns or Inputs */}
          {titleDirectToCategList?.length > 0 && (
            <div className={`d-flex gap-4 flex-wrap `}>
              {titleDirectToCategList
                ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
                ?.map((titleDirectToCat) => (
                  <div
                    className={`d-flex gap-2 mt-4 ${
                      titleDirectToCat?.titled
                        ? "fs-4 fw-bold flex-row w-100 align-items-start justify-content-start"
                        : "flex-column"
                    }`}
                    key={titleDirectToCat?.uid}
                  >
                    <label
                      htmlFor={titleDirectToCat?.uid}
                      className="my-auto w-25 text-nowrap"
                    >
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
                              setSelectedValue={(value) =>
                                field.onChange(value)
                              } // Use react-hook-form's setter
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          name={titleDirectToCat?.uid}
                          control={control}
                          render={({ field }) => {
                            const handleValueChange = (e) => {
                              let value = e.target.value;

                              if (titleDirectToCat?.type === "PERCENTAGE") {
                                // Treat PERCENTAGE as a number
                                value = parseFloat(value);
                                if (isNaN(value)) value = ""; // If the value isn't a number, reset to empty
                              } else if (titleDirectToCat?.type === "FLOAT") {
                                // Treat FLOAT as a float with one decimal place
                                // value = parseFloat(value).toFixed(1);
                                value = parseFloat(value);

                                if (isNaN(value)) value = ""; // If the value isn't a number, reset to empty
                              } else if (titleDirectToCat?.type === "CHAR") {
                                // Treat CHAR as a string
                                value = value.toString();
                              }

                              // Update the field value using react-hook-form's `onChange` handler
                              field.onChange(value);
                            };

                            return titleDirectToCat?.type === "PERCENTAGE" ? (
                              <IconField iconPosition="left">
                                <InputIcon className="pi pi-percentage">
                                  {" "}
                                </InputIcon>
                                <InputText
                                  placeholder="درصد"
                                  {...field}
                                  keyfilter="num"
                                  onChange={handleValueChange} // Custom value handling for PERCENTAGE
                                />
                              </IconField>
                            ) : (
                              <InputText
                                {...field}
                                placeholder={`${
                                  titleDirectToCat?.type === "CHAR"
                                    ? "متن"
                                    : "عددی"
                                }`}
                                keyfilter={
                                  titleDirectToCat?.type === "CHAR"
                                    ? ""
                                    : "decimal" // Allow only numeric values for FLOAT and PERCENTAGE
                                }
                                onChange={handleValueChange} // Custom value handling for FLOAT and CHAR
                              />
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div>
            {subCategory?.length > 0 &&
              subCategory.map((subs, index) => (
                <div key={index}>
                  <h5>{subs.name}</h5>{" "}
                  {/* Display the name of the sub-category */}
                  <div className="card flex justify-content-center">
                    <SelectButton
                      value={value} // Selected value(s)
                      onChange={(e) => handleSelectSub(e, subs.field)} // Handle value change
                      optionLabel="name" // Display the field name as the option label
                      options={subs.field} // Pass the field options for each sub-category
                      multiple // Enable multiple selection
                    />
                  </div>
                  {/* Display selected options and their orderings */}
                  <div className="selected-ordering">
                    {selectedOrdering?.length > 0 &&
                      selectedOrdering.map((ordering, index) => (
                        <div key={index}>
                          Selected Option: {value[index]} - Ordering: {ordering}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary mt-5 w-100 text-center"
          >
            تایید و ثبت نتایج
          </button>
        </div>
      </form>
    </Tab.Container>
  );
};

export default PillsTabs;
