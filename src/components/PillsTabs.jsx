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
  const [activeTab, setActiveTab] = useState("");
  const [date, setDate] = useState(null);

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
        console.log("titleOfAll", response?.data?.data?.title);
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

    //
    const additionalData = {
      // batch_uid
      category_uid: activeTab,
      patient_uid: "Some additional info",
    };

    const fields = titleDirectToCategList
      ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
      ?.map((titleDirectToCat) => {
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

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/tests/test/",
        formDataWithExtraData
      );
      alert("Data submitted successfully");
    } catch (error) {
      alert("Error submitting data");
      console.error(error);
    }
  };

  console.log("titleDirectToCategList", titleDirectToCategList);
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
                          render={({ field }) =>
                            titleDirectToCat?.type === "PERCENTAGE" ? (
                              //   <InputText
                              //   {...field} // Spread react-hook-form's field props
                              //   keyfilter={
                              //     titleDirectToCat?.type === "CHAR"
                              //       ? ""
                              //       : titleDirectToCat?.type === "FLOAT" ||
                              //         titleDirectToCat?.type === "PERCENTAGE"
                              //       ? "int"
                              //       : ""
                              //   }
                              // />

                              <IconField iconPosition="left">
                                <InputIcon className="pi pi-percentage">
                                  {" "}
                                </InputIcon>
                                <InputText
                                  placeholder="درصد"
                                  {...field}
                                  keyfilter={"int"}
                                />
                              </IconField>
                            ) : (
                              <InputText
                                {...field} // Spread react-hook-form's field props
                                placeholder={`${
                                  titleDirectToCat?.type === "CHAR"
                                    ? "متن"
                                    : "عددی"
                                }`}
                                keyfilter={
                                  titleDirectToCat?.type === "CHAR"
                                    ? ""
                                    : titleDirectToCat?.type === "FLOAT" ||
                                      titleDirectToCat?.type === "PERCENTAGE"
                                    ? "int"
                                    : ""
                                }
                              />
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="">
            {titleOfAll?.length > 0 &&
              titleOfAll.map((title) => (
                <div className="">
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
                              render={({ field }) => (
                                <InputText
                                  {...field} // Spread react-hook-form's field props
                                  keyfilter={
                                    titleData?.type === "CHAR"
                                      ? ""
                                      : titleData?.type === "FLOAT" ||
                                        titleData?.type === "PERCENTAGE"
                                      ? "int"
                                      : ""
                                  }
                                  placeholder={`${titleData?.name} را وارد نمایید`}
                                />
                              )}
                            />
                          )}
                          {/* </div> */}
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
