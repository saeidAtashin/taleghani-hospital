import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import apiRequest from "../api/apiService";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import DropD from "./DropD";
import { Controller, useForm } from "react-hook-form";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useParams } from "react-router-dom";

const PillsTabs = ({ setShowAzmayeshPAge }) => {
  const [tabsNew, settabsNew] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [titleOfAll, settitleOfAll] = useState();
  const [subCategory, setsubCategory] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [date, setDate] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [orderstyletitle, setorderstyletitle] = useState([]);
  const [countOccurrences, setcountOccurrences] = useState([]);
  const [countOccurrencesDirectTitle, setcountOccurrencesDirectTitle] =
    useState([]);
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(null);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingAll, setisLoadingAll] = useState(false);
  const [gettedCategory, setgettedCategory] = useState(false);
  const [additionalInputValue, setAdditionalInputValue] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [immunofixationUid, setimmunofixationUid] = useState("");
  const [parentArray, setParentArray] = useState([]);
  const Exexex = ["IgA", "IgM", "IgG", "IgD", "Other"];
  const { uid } = useParams();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: undefined,
    },
  });

  useEffect(() => {
    setisLoadingAll(true);
    const fetchDataCategory = async () => {
      try {
        // const response = await apiRequest("GET", `/tests/category-details/`);

        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );

        if (response.status >= 200 && response.status < 400) {
          const list = response?.data?.data?.result ?? [];
          settabsNew(list);
          setgettedCategory(true);
        }
      } catch (error) {
        setisLoadingAll(false);

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
          setisLoadingAll(false);
        }
      } catch (error) {
        setisLoadingAll(false);

        console.error("Error fetching data:", error);
      }
    };
    activeTab && gettedCategory && fetchDataCategoryUId();
  }, [activeTab, tabsNew, gettedCategory]);

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);

    reset();
    setParentArray([]);
    setSelectedName(undefined);
    setDate(undefined);
    setValue("date", undefined);

    setAdditionalInputValue(undefined);
    setimmunofixationUid(undefined);
    setShowAdditionalInput(false);
  };

  const onSubmit = async (data) => {
    setisLoading(true);
    const additionalData = {
      date: data?.date,
      category_uid: activeTab,
      patient_uid: uid,
    };

    delete data.date;

    const fields = Object.keys(data)
      .filter((key) => {
        const value = data[key];
        return value !== null && value !== undefined && value !== "";
      })
      .map((key) => {
        const value = data[key];

        if (key === immunofixationUid) {
          return undefined;
        }

        return {
          uid: key,
          value: Array.isArray(value) ? [value] : value,
        };
      })
      .filter((field) => field !== undefined);

    const extendedFields = [
      ...fields,
      ...parentArray.map((item) => {
        const [uid, value] = Object.entries(item)[0];
        return { uid, value };
      }),
    ];

    const formDataWithExtraData = {
      fields: extendedFields?.length !== 0 ? extendedFields : undefined,
      ...additionalData,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/tests/test/",
        formDataWithExtraData
      );
      if (response?.status >= 200 && response?.status < 400) {
        setisLoading(false);
        toast.success("ثبت شد");
      }
      setShowAzmayeshPAge("home");

      reset();
      setParentArray([]);
      setSelectedName(undefined);
      setDate(undefined);
      setValue("date", undefined); // Resets only the date field

      setAdditionalInputValue(undefined);
      setimmunofixationUid(undefined);
      setShowAdditionalInput(false);
    } catch (error) {
      setisLoading(false);

      toast.warning(
        error?.response?.data?.errors?.[0]?.message
          ? error?.response?.data?.errors?.[0]?.message
          : "نشد "
      );

      console.error(error?.response?.data?.errors?.[0]?.message);
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

    // Resets only the date field
    reset();
    setParentArray([]);
    setSelectedName(undefined);
    setDate(undefined);
    setValue("date", undefined); // Resets only the date field

    setAdditionalInputValue(undefined);
    setimmunofixationUid(undefined);
    setShowAdditionalInput(false);
  };

  useEffect(() => {
    if (activeTab && tabsNew) {
      const currentTab = tabsNew.find((tab) => tab.uid === activeTab);

      if (currentTab && currentTab.sub_category?.length > 0) {
        handleSubCategoryClick(currentTab.sub_category[0], 0);
      }
    }
  }, [activeTab, tabsNew]);

  if (isLoadingAll) return <>در حال دریافت اطلاعات...</>;

  console.log("titleOfAll", titleOfAll);
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
      {/* <h4 className="my-4 mx-2">ثبت {activeTab} جدید</h4> */}

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
              render={({ field }) => {
                const selectedDate = field.value
                  ? new DateObject({
                      date: new Date(field.value),
                      calendar: persian,
                    })
                  : null;

                console.log("new Date(field.value)", selectedDate);

                return (
                  <DatePicker
                    {...field}
                    value={selectedDate}
                    onChange={(date) => {
                      if (date) {
                        const gregorianDate = date
                          .convert("gregorian")
                          .toDate();
                        const formattedDate = gregorianDate
                          .toISOString()
                          .split("T")[0];
                        field.onChange(formattedDate);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    placeholder="تاریخ را انتخاب کنید"
                    className="w-full p-2 border rounded"
                    inputClass="w-full p-2 border rounded"
                    position="bottom-right"
                  />
                );
              }}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date.message}</div>
            )}
          </div>

          <div className="">
            {titleOfAll?.length > 0 &&
              titleOfAll?.map((title, idx) => {
                if (title?.name === "CBC") {
                  return (
                    <div key={idx} className="">
                      <h3 className="my-4">{title?.name}</h3>

                      <div className="">
                        {title?.field
                          ?.sort(
                            (a, b) => (a?.ordering || 0) - (b?.ordering || 0)
                          )
                          ?.reduce((acc, titleData) => {
                            const { ordering } = titleData;
                            if (!acc[ordering]) {
                              acc[ordering] = [];
                            }
                            acc[ordering].push(titleData);
                            return acc;
                          }, {})
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
                              <div className="row bg-red" key={idx}>
                                {title?.field
                                  ?.filter(
                                    (field) =>
                                      field?.ordering.toString() === groupKey
                                  )
                                  .map((titleData) => (
                                    <div
                                      key={titleData?.uid}
                                      className={` col-md-${
                                        countOccurrences[titleData?.ordering]
                                          ? 12 /
                                            countOccurrences[
                                              titleData?.ordering
                                            ]
                                          : titleData?.ordering
                                      } mb-4`}
                                    >
                                      <label htmlFor={titleData?.uid}>
                                        {titleData?.name}
                                      </label>
                                      {titleData?.options?.length > 0 ? (
                                        <Controller
                                          name={titleData?.uid}
                                          control={control}
                                          render={({ field }) => (
                                            <DropD
                                              titleData={titleData}
                                              selectedValue={field.value}
                                              setSelectedValue={(value) =>
                                                field.onChange(value)
                                              }
                                            />
                                          )}
                                        />
                                      ) : (
                                        <Controller
                                          name={titleData?.uid}
                                          control={control}
                                          render={({ field }) => {
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

                                              field.onChange(value);
                                            };

                                            return (
                                              <InputText
                                                {...field}
                                                onChange={handleValueChange}
                                                className="w-100"
                                                keyfilter={
                                                  titleData?.type === "CHAR"
                                                    ? "char"
                                                    : titleData?.type ===
                                                        "FLOAT" ||
                                                      titleData?.type ===
                                                        "PERCENTAGE"
                                                    ? "decimal"
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
                  );
                }
              })}
          </div>
          <div className="">
            {titleDirectToCategList?.length > 0 && (
              <div className="row  d-flex">
                {titleDirectToCategList
                  ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
                  ?.filter((titleDirectToCat) => {
                    const excludeNames = Exexex.filter(
                      (name) => name !== selectedName
                    );
                    return !excludeNames.includes(titleDirectToCat?.name);
                  })
                  ?.map((titleDirectToCat) => (
                    // col
                    <div
                      key={titleDirectToCat?.uid}
                      className={` ${
                        titleDirectToCat?.name === "Immunofixation"
                          ? "flex-grow-1"
                          : ""
                      } ${
                        titleDirectToCat?.titled
                          ? ""
                          : `col-md-${
                              titleDirectToCat?.name === "Immunofixation"
                                ? 2
                                : countOccurrencesDirectTitle[
                                    titleDirectToCat?.ordering
                                  ]
                                ? Math.ceil(
                                    12 /
                                      countOccurrencesDirectTitle[
                                        titleDirectToCat?.ordering
                                      ]
                                  )
                                : 12
                            }`
                      }`}
                    >
                      <div
                        className={`  py-2 my-4 ${
                          titleDirectToCat?.titled
                            ? "fs-4 fw-bold d-flex align-items-start justify-content-start"
                            : ``
                        }`}
                      >
                        <label
                          htmlFor={titleDirectToCat?.uid}
                          className="my-auto w-25 text-nowrap"
                        >
                          {titleDirectToCat?.name === "Immunofixation"
                            ? titleDirectToCat?.name
                            : titleDirectToCat?.name}{" "}
                        </label>
                        <div className="">
                          {titleDirectToCat?.options?.length > 0 ? (
                            <Controller
                              name={titleDirectToCat?.uid}
                              control={control}
                              render={({ field }) =>
                                titleDirectToCat?.name === "Immunofixation" ? (
                                  <>
                                    <DropD
                                      titleDirectToCat={titleDirectToCat}
                                      selectedValue={field.value}
                                      setSelectedValue={(value, name) => {
                                        field.onChange(value);
                                        setSelectedName(name);
                                        setShowAdditionalInput(true);
                                        setAdditionalInputValue("");
                                        setimmunofixationUid(
                                          titleDirectToCat?.uid
                                        );

                                        setParentArray((prevArray) => {
                                          const updatedArray = prevArray.filter(
                                            (item) =>
                                              !item.hasOwnProperty(value)
                                          );

                                          return [
                                            ...updatedArray,
                                            { [value]: "" },
                                          ];
                                        });
                                      }}
                                    />
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
                            <>
                              <Controller
                                name={titleDirectToCat?.uid}
                                control={control}
                                render={({ field }) => {
                                  const handleValueChange = (e) => {
                                    let value = e.target.value;

                                    if (
                                      titleDirectToCat?.type === "PERCENTAGE"
                                    ) {
                                      value = parseFloat(value);
                                      if (isNaN(value)) value = "";
                                    } else if (
                                      titleDirectToCat?.type === "FLOAT"
                                    ) {
                                      value = parseFloat(value);

                                      if (isNaN(value)) value = "";
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
                                        onChange={handleValueChange}
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
                                          : "decimal"
                                      }
                                      onChange={handleValueChange}
                                    />
                                  );
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* org cbc */}
          <div className="">
            {titleOfAll?.length > 0 &&
              titleOfAll.map((title, idx) => {
                if (title.name !== "CBC") {
                  return (
                    <div key={idx} className="">
                      <h3 className="my-4">{title?.name}</h3>

                      <div className="">
                        {title?.field
                          ?.sort(
                            (a, b) => (a?.ordering || 0) - (b?.ordering || 0)
                          )
                          ?.reduce((acc, titleData) => {
                            const { ordering } = titleData;
                            if (!acc[ordering]) {
                              acc[ordering] = [];
                            }
                            acc[ordering].push(titleData);
                            return acc;
                          }, {})
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
                              <div className="row bg-red" key={idx}>
                                {title?.field
                                  ?.filter(
                                    (field) =>
                                      field?.ordering.toString() === groupKey
                                  )
                                  .map((titleData) => (
                                    <div
                                      key={titleData?.uid}
                                      className={` col-md-${
                                        countOccurrences[titleData?.ordering]
                                          ? 12 /
                                            countOccurrences[
                                              titleData?.ordering
                                            ]
                                          : titleData?.ordering
                                      } mb-4`}
                                    >
                                      <label htmlFor={titleData?.uid}>
                                        {titleData?.name}
                                      </label>
                                      {titleData?.options?.length > 0 ? (
                                        <Controller
                                          name={titleData?.uid}
                                          control={control}
                                          render={({ field }) => (
                                            <DropD
                                              titleData={titleData}
                                              selectedValue={field.value}
                                              setSelectedValue={(value) =>
                                                field.onChange(value)
                                              }
                                            />
                                          )}
                                        />
                                      ) : (
                                        <Controller
                                          name={titleData?.uid}
                                          control={control}
                                          render={({ field }) => {
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

                                              field.onChange(value);
                                            };

                                            return (
                                              <InputText
                                                {...field}
                                                onChange={handleValueChange}
                                                className="w-100"
                                                keyfilter={
                                                  titleData?.type === "CHAR"
                                                    ? "char"
                                                    : titleData?.type ===
                                                        "FLOAT" ||
                                                      titleData?.type ===
                                                        "PERCENTAGE"
                                                    ? "decimal"
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
                  );
                }
              })}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-5 w-100 text-center"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                در حال بارگذاری...
              </>
            ) : (
              "تایید و ثبت نتایج"
            )}
          </button>
        </div>
      </form>
    </Tab.Container>
  );
};

export default PillsTabs;
