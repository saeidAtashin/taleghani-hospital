import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
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
import HiddenInputsModal from "./HiddenInputsModal";

const PillsTabs = ({ setShowAzmayeshPAge, viewMode = false, viewTestData = null }) => {
  const [tabsNew, settabsNew] = useState();
  const [titleDirectToCategList, settitleDirectToCategList] = useState();
  const [titleOfAll, settitleOfAll] = useState();
  const [subCategory, setsubCategory] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [countOccurrences, setcountOccurrences] = useState([]);
  const [countOccurrencesDirectTitle, setcountOccurrencesDirectTitle] =
    useState([]);
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isLoadingAll, setisLoadingAll] = useState(false);
  const [gettedCategory, setgettedCategory] = useState(false);

  const [selectedName, setSelectedName] = useState("");
  const [immunofixationUid, setimmunofixationUid] = useState("");
  const [getHideInput, setGetHideInput] = useState(false);
  const [hiddenInputs, setHiddenInputs] = useState([]);
  const [kValue, setkValue] = useState(1);
  const [landaValue, setlandaValue] = useState(1);
  const [valueinja, setvalueinja] = useState(0);
  const [parentArray, setParentArray] = useState([]);
  const Exexex = ["IgA", "IgM", "IgG", "IgD", "Other"];
  const { uid } = useParams();
  const [submittedInputs, setSubmittedInputs] = useState([]);
  const [hiddenSubmittedData, setHiddenSubmittedData] = useState([]);

  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [isCategoryDataLoaded, setIsCategoryDataLoaded] = useState(false);
  const [isHiddenInputsLoaded, setIsHiddenInputsLoaded] = useState(false);

  useEffect(() => {
    setvalueinja(Number(kValue) / Number(landaValue));
  }, [kValue, landaValue]);
  const {
    control,
    handleSubmit,
    reset,
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
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );

        if (response.status >= 200 && response.status < 400) {
          const list = response?.data?.data?.result ?? [];
          settabsNew(list);
          setgettedCategory(true);
          setIsInitialDataLoaded(true);
        }
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        if (!activeTab) {
          setisLoadingAll(false);
        }
      }
    };
    fetchDataCategory();
  }, []);

  useEffect(() => {
    if (!activeTab || !gettedCategory) return;

    const fetchDataCategoryUId = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/${activeTab}/`
        );

        setGetHideInput(true);

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
        setIsCategoryDataLoaded(true);
      } catch (error) {
        setGetHideInput(false);
        toast.error("خطا در دریافت جزئیات");
      }
    };
    fetchDataCategoryUId();
  }, [activeTab, gettedCategory]);

  useEffect(() => {
    setActiveTab(tabsNew?.[0]?.uid ?? "");
  }, [tabsNew]);

  useEffect(() => {
    if (!getHideInput || !activeTab || !gettedCategory) return;

    const fetchDataCategoryHidden = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/order-fields/${activeTab}/`
        );

        if (response.status >= 200 && response.status < 400) {
          setHiddenInputs(response?.data?.data);
        }
        setIsHiddenInputsLoaded(true);
      } catch (error) {
        toast.error("خطا در دریافت ورودی‌های مخفی");
      } finally {
        setisLoadingAll(false);
      }
    };
    fetchDataCategoryHidden();
  }, [activeTab, gettedCategory, getHideInput]);

  useEffect(() => {
    if (viewMode && viewTestData) {
      // Find the matching tab based on name
      const matchingTab = tabsNew?.find(tab => 
        tab.name.toLowerCase() === viewTestData.testName.toLowerCase()
      );
      
      if (matchingTab) {
        setActiveTab(matchingTab.uid);
      }
      
      const fetchTestDetails = async () => {
        try {
          const response = await axios.get(
            `https://cancerreg.ir/api/v1/tests/test/${viewTestData.testUid}/`
          );
          if (response.status >= 200 && response.status < 400) {
            const testData = response.data.data;
            
            const formValues = {};
            testData.results.forEach(result => {
              formValues[result.field_uid] = result.value;
            });
            
            Object.entries(formValues).forEach(([key, value]) => {
              setValue(key, value);
            });
          }
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات آزمایش");
        }
      };
      
      fetchTestDetails();
    }
  }, [viewMode, viewTestData, setValue, tabsNew]);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);

    reset();
    setParentArray([]);
    setSelectedName(undefined);
    setValue("date", undefined);

    setimmunofixationUid(undefined);
  };

  const onSubmit = async (data) => {
    setisSubmitting(true);
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
      ...parentArray.flatMap((item) => {
        const [uid, value] = Object.entries(item)[0];
        return uid && value && { uid, value };
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
        setisSubmitting(false);
        toast.success("ثبت شد");
      }
      setShowAzmayeshPAge("home");

      reset();
      setParentArray([]);
      setSelectedName(undefined);
      setValue("date", undefined);

      setimmunofixationUid(undefined);
    } catch (error) {
      setisSubmitting(false);

      toast.warning(
        error?.response?.data?.errors?.[0]?.message
          ? error?.response?.data?.errors?.[0]?.message
          : "نشد "
      );
    }
  };

  const handleSubCategoryClick = (sub, index) => {
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

    reset();
    setParentArray([]);
    setSelectedName(undefined);
    setValue("date", undefined);

    setimmunofixationUid(undefined);
  };

  useEffect(() => {
    if (activeTab && tabsNew) {
      const currentTab = tabsNew.find((tab) => tab.uid === activeTab);

      if (currentTab && currentTab.sub_category?.length > 0) {
        handleSubCategoryClick(currentTab.sub_category[0], 0);
      }
    }
  }, [activeTab, tabsNew]);

  const isLoading =
    isLoadingAll ||
    !isInitialDataLoaded ||
    !isCategoryDataLoaded ||
    (getHideInput && !isHiddenInputsLoaded);

  // Add a function to check if tab name matches test name
  const isMatchingTab = (tabName) => {
    if (!viewMode || !viewTestData?.testName) return false;
    return tabName.toLowerCase() === viewTestData.testName.toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span>در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills" className="mb-3">
        {tabsNew
          ?.sort((a, b) => (a?.ordering || 0) - (b?.ordering || 0))
          ?.map((tab, index) => (
            <Nav.Item key={index} className="m-2">
              <Nav.Link
                className={`border ${
                  isMatchingTab(tab.name) ? "bg-danger text-white" : ""
                }`}
                eventKey={tab?.uid ?? ""}
                onClick={() => {
                  settitleOfAll(undefined);
                  settitleDirectToCategList(undefined);
                }}
              >
                {tab?.name ?? "Unknown Tab"}
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 mb-5 container shadow-lg">
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

                return (
                  <DatePicker
                    {...field}
                    disabled={viewMode}
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
                    className={`w-full p-2 border rounded ${viewMode ? 'bg-light' : ''}`}
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
                              <div className="row " key={idx}>
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
                                                field.onChange(value)}
                                              disabled={viewMode}
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
                                                disabled={viewMode}
                                                onChange={handleValueChange}
                                                className={`w-100 ${viewMode ? 'bg-light' : ''}`}
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
                                      disabled={viewMode}
                                    />
                                  </>
                                ) : (
                                  <DropD
                                    titleDirectToCat={titleDirectToCat}
                                    selectedValue={field.value}
                                    setSelectedValue={(value) => {
                                      field.onChange(value);
                                    }}
                                    disabled={viewMode}
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
                                        className={`w-100 ${viewMode ? 'bg-light' : ''}`}
                                        {...field}
                                        keyfilter="num"
                                        onChange={handleValueChange}
                                        disabled={viewMode}
                                      />
                                    </IconField>
                                  ) : (
                                    <InputText
                                      {...field}
                                      disabled={viewMode}
                                      placeholder={`${
                                        titleDirectToCat?.type === "CHAR"
                                          ? "متن"
                                          : "عددی"
                                      }`}
                                      className={`w-100 ${viewMode ? 'bg-light' : ''}`}
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
                              <div className="row" key={idx}>
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
                                                field.onChange(value)}
                                              disabled={viewMode}
                                            />
                                          )}
                                        />
                                      ) : (
                                        <Controller
                                          name={titleData?.uid}
                                          control={control}
                                          render={({ field }) => {
                                            const handleValueChange = (e) => {
                                              titleData?.name === "κ"
                                                ? setkValue(e.target.value)
                                                : titleData?.name === "λ"
                                                ? setlandaValue(e.target.value)
                                                : "";
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
                                                disabled={viewMode}
                                                placeholder={`${
                                                  titleData?.type === "CHAR"
                                                    ? "متن"
                                                    : "عددی"
                                                }`}
                                                className={`w-100 ${viewMode ? 'bg-light' : ''}`}
                                                value={
                                                  titleData?.name === "κ/λ" &&
                                                  valueinja !== Infinity &&
                                                  typeof valueinja === "number"
                                                    ? valueinja
                                                    : field.value
                                                }
                                                keyfilter={
                                                  titleData?.type === "CHAR"
                                                    ? "char"
                                                    : "decimal"
                                                }
                                                onChange={handleValueChange}
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

          {hiddenInputs?.length > 0 && (
            <HiddenInputsModal
              hiddenInputs={hiddenInputs}
              submittedInputs={submittedInputs}
              setSubmittedInputs={setSubmittedInputs}
              setHiddenSubmittedData={setHiddenSubmittedData}
            />
          )}

          {!viewMode && (
            <button
              type="submit"
              className="btn btn-primary mt-5 w-100 text-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
          )}
        </div>
      </form>
    </Tab.Container>
  );
};

export default PillsTabs;
