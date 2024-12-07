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

const PillsTabs = () => {
  const [tabsNew, settabsNew] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [titleOfAll, settitleOfAll] = useState();
  const [subCategory, setsubCategory] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [date, setDate] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null); // Track the selected sub-category
  const [orderstyletitle, setorderstyletitle] = useState([]); // Track the selected sub-category
  const [countOccurrences, setcountOccurrences] = useState([]); // Track the selected sub-category
  const [countOccurrencesDirectTitle, setcountOccurrencesDirectTitle] =
    useState([]);
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(null);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [additionalInputValue, setAdditionalInputValue] = useState("");
  const [selectedName, setSelectedName] = useState(""); // Track the name of selected dropdown item
  const [immunofixationUid, setimmunofixationUid] = useState(""); // Track the name of selected dropdown item
  const [parentArray, setParentArray] = useState([]); // Track array of key-value pairs

  const {
    control,
    handleSubmit,
    reset,
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

        if (response?.data?.data?.sub_category?.length > 0) {
          setsubCategory(response?.data?.data?.sub_category ?? []);
          settitleDirectToCategList(
            response?.data?.data?.sub_category?.[0]?.field ?? []
          );
        } else {
          settitleDirectToCategList(response?.data?.data?.field);
          setsubCategory(response?.data?.data?.sub_category);
          settitleOfAll(response?.data?.data?.title);
          const orderings = response?.data?.data?.title?.flatMap((title) =>
            title?.field?.map((field) => field?.ordering)
          );

          const countOccurrencesss = orderings?.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});

          setcountOccurrences(countOccurrencesss);

          const orderingssec = response?.data?.data?.field?.map(
            (item) => item?.ordering
          );

          const countOccurrences = orderingssec?.reduce((acc, ordering) => {
            acc[ordering] = (acc[ordering] || 0) + 1;
            return acc;
          }, {});

          setcountOccurrencesDirectTitle(countOccurrences);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategoryUId();
  }, [activeTab, tabsNew]);

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  const onSubmit = async (data) => {
    const additionalData = {
      date: data?.date,
      category_uid: activeTab,
      patient_uid: "a39573c2-a8b1-4b18-bbb5-3fd44614a761",
    };

    delete data.date;

    const fields = Object.keys(data)
      .filter((key) => {
        const value = data[key];
        return value !== null && value !== undefined && value !== "";
      })
      .map((key) => {
        const value = data[key];
        console.log("immunofixationUid", immunofixationUid);
        console.log("value.selectedUid", value.selectedUid);
        console.log("data[key]", data[key]);

        if (key === immunofixationUid) {
          return undefined;
        }

        return {
          uid: key,
          value: Array.isArray(value) ? [value] : value,
        };
      })
      .filter((field) => field !== undefined); // Remove undefined values

    const extendedFields = [
      ...fields,
      ...parentArray.map((item) => {
        const [uid, value] = Object.entries(item)[0]; // Extract uid and value from each object in parentArray
        return { uid, value };
      }),
    ];

    const formDataWithExtraData = {
      fields: extendedFields,
      ...additionalData,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/tests/test/",
        formDataWithExtraData
      );
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubCategoryClick = (sub, index) => {
    setActiveSubCategory(sub);
    setActiveSubCategoryIndex(index);

    settitleDirectToCategList(sub?.field ?? []);

    const orderingssec = sub?.field?.map((item) => item?.ordering);

    const countOccurrences = orderingssec?.reduce((acc, ordering) => {
      acc[ordering] = (acc[ordering] || 0) + 1;
      return acc;
    }, {});

    setcountOccurrencesDirectTitle(countOccurrences);

    const orderings = sub?.title?.flatMap((title) =>
      title?.field?.map((field) => field?.ordering)
    );

    const countOccurrencesss = orderings?.reduce((acc, num) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    }, {});

    setcountOccurrences(countOccurrencesss);
    settitleOfAll(sub?.title);
    setorderstyletitle(countOccurrencesss);
  };

  useEffect(() => {
    if (activeTab && tabsNew) {
      const currentTab = tabsNew.find((tab) => tab.uid === activeTab);

      if (currentTab && currentTab.sub_category?.length > 0) {
        handleSubCategoryClick(currentTab.sub_category[0], 0); // Pass the subcategory and its index (0 in this case)
      }
    }
  }, [activeTab, tabsNew]);

  // console.log("titleOfAll", titleOfAll?.[0]?.field);
  // console.log("countOccurrences", countOccurrences);
  // console.log("orderstyletitle", orderstyletitle);
  // console.log("countOccurrencesDirectTitle", countOccurrencesDirectTitle);
  console.log("parentArray", parentArray);
  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="mb-3">
        {tabsNew
          ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
          ?.map((tab, index) => (
            <Nav.Item key={index} className="m-2">
              <Nav.Link
                className="border"
                eventKey={tab?.uid ?? ""}
                onClick={() => {
                  settitleOfAll(undefined);
                  setActiveSubCategory(undefined);
                  settitleDirectToCategList(undefined);
                }}
              >
                {tab?.name ?? "Unknown Tab"}
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>
      <h4 className="my-4 mx-2">ثبت {activeTab} جدید</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 mb-5 container shadow-lg">
          <h1>Dynamic Form</h1>
          <div className="my-3 d-flex gap-2 ">
            {subCategory?.length > 0 &&
              subCategory.map((subs, index) => (
                <div key={index} className="my-3 ">
                  <span
                    className={`px-3 py-2 rounded-3 cursor-pointer ${
                      activeSubCategoryIndex === index
                        ? "bg-warning"
                        : " border"
                    }`}
                    onClick={() => handleSubCategoryClick(subs, index)}
                  >
                    {subs.name}
                  </span>{" "}
                  <div className=""></div>
                </div>
              ))}
          </div>
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
          <div className="">
            {titleDirectToCategList?.length > 0 && (
              <div className="row">
                {titleDirectToCategList
                  ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
                  ?.map((titleDirectToCat) => (
                    // col
                    <div
                      className={` ${
                        titleDirectToCat?.titled
                          ? ""
                          : `col-md-${
                              countOccurrencesDirectTitle[
                                titleDirectToCat?.ordering
                              ]
                                ? 12 /
                                  countOccurrencesDirectTitle[
                                    titleDirectToCat?.ordering
                                  ]
                                : titleDirectToCat?.ordering
                            }`
                      }`}
                    >
                      <div
                        className={` py-2 my-4 ${
                          titleDirectToCat?.titled
                            ? "fs-4 fw-bold d-flex align-items-start justify-content-start"
                            : ``
                        }`}
                        key={titleDirectToCat?.uid}
                      >
                        <label
                          htmlFor={titleDirectToCat?.uid}
                          className="my-auto w-25 text-nowrap"
                        >
                          {titleDirectToCat?.name === "Immunofixation"
                            ? titleDirectToCat?.name
                            : titleDirectToCat?.name}{" "}
                          / {titleDirectToCat?.ordering}
                        </label>
                        <div className="">
                          {titleDirectToCat?.options?.length > 0 ? (
                            <Controller
                              name={titleDirectToCat?.uid}
                              control={control}
                              render={({ field }) =>
                                titleDirectToCat?.name === "Immunofixation" ? (
                                  <>
                                    {/* Conditionally show DropD component */}
                                    <DropD
                                      titleDirectToCat={titleDirectToCat}
                                      selectedValue={field.value}
                                      setSelectedValue={(value, name) => {
                                        field.onChange(value); // Store uid in the form state
                                        setSelectedName(name); // Set name for display purposes
                                        setShowAdditionalInput(true); // Show additional input when a value is selected
                                        setAdditionalInputValue(""); // Clear input initially
                                        setimmunofixationUid(
                                          titleDirectToCat?.uid
                                        );
                                        console.log(
                                          "naaaaaaaaaaaaaa",
                                          titleDirectToCat?.uid
                                        );
                                        // Add or update the entry in parentArray when a new dropdown item is selected
                                        setParentArray((prevArray) => {
                                          // Remove existing entry with the same uid if present
                                          const updatedArray = prevArray.filter(
                                            (item) =>
                                              !item.hasOwnProperty(value)
                                          );

                                          // Add the new entry
                                          return [
                                            ...updatedArray,
                                            { [value]: "" },
                                          ];
                                        });
                                      }}
                                    />

                                    {/* Additional input shown only if a dropdown value has been selected */}
                                    {showAdditionalInput && (
                                      <div className="mt-3">
                                        <label
                                          htmlFor={`additional-input-${titleDirectToCat?.uid}`}
                                        >
                                          {selectedName}
                                        </label>
                                        <input
                                          type="text"
                                          id={`additional-input-${titleDirectToCat?.uid}`}
                                          className="form-control mt-2"
                                          value={additionalInputValue}
                                          onChange={(e) => {
                                            const newValue = e.target.value;
                                            setAdditionalInputValue(newValue);

                                            // Update the corresponding entry in parentArray with the new input value
                                            setParentArray((prevArray) =>
                                              prevArray.map((item) =>
                                                item.hasOwnProperty(field.value)
                                                  ? { [field.value]: newValue }
                                                  : item
                                              )
                                            );
                                          }}
                                          placeholder={
                                            selectedName ||
                                            "Enter additional information"
                                          }
                                        />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <DropD
                                    titleDirectToCat={titleDirectToCat}
                                    selectedValue={field.value}
                                    setSelectedValue={(value) => {
                                      field.onChange(value);
                                      setShowAdditionalInput(true);
                                    }}
                                  />
                                )
                              }
                            />
                          ) : (
                            <Controller
                              name={titleDirectToCat?.uid}
                              control={control}
                              render={({ field }) => {
                                const handleValueChange = (e) => {
                                  let value = e.target.value;

                                  if (titleDirectToCat?.type === "PERCENTAGE") {
                                    value = parseFloat(value);
                                    if (isNaN(value)) value = ""; // If the value isn't a number, reset to empty
                                  } else if (
                                    titleDirectToCat?.type === "FLOAT"
                                  ) {
                                    value = parseFloat(value);

                                    if (isNaN(value)) value = ""; // If the value isn't a number, reset to empty
                                  } else if (
                                    titleDirectToCat?.type === "CHAR"
                                  ) {
                                    value = value.toString();
                                  }

                                  field.onChange(value);
                                };

                                return titleDirectToCat?.type ===
                                  "PERCENTAGE" ? (
                                  <IconField iconPosition="left">
                                    <InputIcon className="pi pi-percentage">
                                      {" "}
                                    </InputIcon>
                                    <InputText
                                      placeholder="درصد"
                                      className="w-100"
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
                                    className="w-100"
                                    keyfilter={
                                      titleDirectToCat?.type === "CHAR"
                                        ? "char"
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
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="">
            {titleOfAll?.length > 0 &&
              titleOfAll.map((title, idx) => (
                <div key={idx} className="">
                  <h3 className="my-4">{title?.name}</h3>

                  {/* Group by 'ordering' */}
                  <div className="">
                    {/* Group fields by their ordering */}
                    {title?.field
                      ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0)) // Sort by ordering
                      ?.reduce((acc, titleData) => {
                        const { ordering } = titleData;
                        if (!acc[ordering]) {
                          acc[ordering] = [];
                        }
                        acc[ordering].push(titleData);
                        return acc;
                      }, {}) // Now we have a grouped object
                      ? Object.keys(
                          title?.field?.reduce((acc, titleData) => {
                            const { ordering } = titleData;
                            if (!acc[ordering]) {
                              acc[ordering] = [];
                            }
                            acc[ordering].push(titleData);
                            return acc;
                          }, {})
                        ).map((groupKey, idx) => (
                          <div className="row" key={idx}>
                            {title?.field
                              ?.filter(
                                (field) =>
                                  field?.ordering.toString() === groupKey
                              )
                              .map((titleData) => (
                                <div
                                  // className={`col-md-3 mb-4`}
                                  key={titleData?.uid}
                                  className={` col-md-${
                                    countOccurrences[titleData?.ordering]
                                      ? 12 /
                                        countOccurrences[titleData?.ordering]
                                      : titleData?.ordering
                                  } mb-4`}
                                >
                                  <label htmlFor={titleData?.uid}>
                                    {titleData?.name}
                                  </label>
                                  {/* <div>{titleData?.ordering}</div> */}
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
                                            value = parseFloat(value);
                                          } else if (
                                            titleData?.type === "PERCENTAGE"
                                          ) {
                                            value = parseFloat(value);
                                          } else if (
                                            titleData?.type === "CHAR"
                                          ) {
                                            value = value.toString();
                                          }

                                          // Update the field value using react-hook-form's onChange handler
                                          field.onChange(value);
                                        };

                                        return (
                                          <InputText
                                            {...field} // Spread react-hook-form's field props
                                            onChange={handleValueChange} // Custom change handler
                                            className="w-100"
                                            keyfilter={
                                              titleData?.type === "CHAR"
                                                ? "char"
                                                : titleData?.type === "FLOAT" ||
                                                  titleData?.type ===
                                                    "PERCENTAGE"
                                                ? "decimal" // Allow only numbers for FLOAT and PERCENTAGE
                                                : ""
                                            }
                                            placeholder={`${titleData?.name} را وارد نمایید`}
                                          />
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              ))}
          </div>

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
