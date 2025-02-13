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
import { Accordion, AccordionTab } from "primereact/accordion";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import moment from "jalali-moment";

const PillsTabs = ({
  setShowAzmayeshPAge,
  viewMode = false,
  viewTestData = null,
  isLoadingData,
  diseaseType,
}) => {
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

  const [isTestDetailsLoading, setIsTestDetailsLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

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
    if (viewMode && viewTestData && tabsNew) {
      // Find all tests with "info" (in-progress) status
      const inProgressTests = Object.entries(viewTestData.groupedTests)
        .flatMap(([categoryName, tests]) =>
          tests.map((test) => ({
            ...test,
            categoryName,
            tabUid: tabsNew.find((tab) => tab.name === categoryName)?.uid,
          }))
        )
        .filter((test) => test.type === "info");

      // If there are in-progress tests, set the first one's tab as active
      if (inProgressTests.length > 0) {
        const firstInProgressTest = inProgressTests[0];
        setActiveTab(firstInProgressTest.tabUid);
      } else {
        // If no in-progress tests, use the first matching tab
        const matchingTabs = tabsNew.filter((tab) =>
          viewTestData.testNames.some(
            (testName) => testName.toLowerCase() === tab.name.toLowerCase()
          )
        );
        if (matchingTabs.length > 0) {
          setActiveTab(matchingTabs[0].uid);
        }
      }
    }
  }, [viewMode, viewTestData, tabsNew]);

  useEffect(() => {
    if (viewMode && viewTestData && activeTab) {
      setIsTestDetailsLoading(true);
      const fetchTestDetails = async () => {
        try {
          const response = await axios.get(
            `https://cancerreg.ir/api/v1/tests/test/${viewTestData.testUid}/`
          );
          if (response.status >= 200 && response.status < 400) {
            const testData = response.data.data;

            // Map results by field_uid for easier access
            const resultsByFieldId = testData.results.reduce((acc, result) => {
              acc[result.field_uid] = result.value;
              return acc;
            }, {});

            // Only set values if we're on a matching tab
            const activeTabData = tabsNew?.find((tab) => tab.uid === activeTab);
            const matchingTests =
              viewTestData.groupedTests[activeTabData?.name] || [];

            if (matchingTests.length > 0) {
              // Set values for نتایج قبلی inputs using existing_ prefix
              matchingTests.forEach((test) => {
                if (titleDirectToCategList) {
                  titleDirectToCategList.forEach((field) => {
                    if (resultsByFieldId[field.uid] !== undefined) {
                      setValue(
                        `existing_${test.uid}_${field.uid}`,
                        resultsByFieldId[field.uid]
                      );
                    }
                  });
                }

                if (titleOfAll) {
                  titleOfAll.forEach((title) => {
                    title.field?.forEach((field) => {
                      if (resultsByFieldId[field.uid] !== undefined) {
                        setValue(
                          `existing_${test.uid}_${field.uid}`,
                          resultsByFieldId[field.uid]
                        );
                      }
                    });
                  });
                }
              });
            }
          }
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات آزمایش");
        } finally {
          setIsTestDetailsLoading(false);
          setIsHiddenInputsLoaded(true);
        }
      };

      fetchTestDetails();
    }
  }, [
    viewMode,
    viewTestData,
    activeTab,
    tabsNew,
    titleDirectToCategList,
    titleOfAll,
  ]);

  const getTestsForCurrentTab = () => {
    if (!viewMode || !viewTestData?.groupedTests || !activeTab) return [];

    const activeTabData = tabsNew?.find((tab) => tab.uid === activeTab);
    if (!activeTabData) return [];

    return viewTestData.groupedTests[activeTabData.name] || [];
  };

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
    setParentArray([]);
    setSelectedName(undefined);
    setimmunofixationUid(undefined);

    // Always keep the default form empty
    const defaultValues = { date: undefined };
    titleDirectToCategList?.forEach((field) => {
      defaultValues[field.uid] = "";
    });
    titleOfAll?.forEach((title) => {
      title.field?.forEach((field) => {
        defaultValues[field.uid] = "";
      });
    });
    reset(defaultValues);

    if (viewMode && viewTestData) {
      setIsTestDetailsLoading(true);
      const fetchTestDetails = async () => {
        try {
          const response = await axios.get(
            `https://cancerreg.ir/api/v1/tests/test/${viewTestData.testUid}/`
          );
          if (response.status >= 200 && response.status < 400) {
            const testData = response.data.data;

            // Map results by field_uid for easier access
            const resultsByFieldId = testData.results.reduce((acc, result) => {
              acc[result.field_uid] = result.value;
              return acc;
            }, {});

            // Set values only for نتایج قبلی inputs
            const activeTabData = tabsNew?.find((tab) => tab.uid === eventKey);
            const matchingTests =
              viewTestData.groupedTests[activeTabData?.name] || [];

            if (matchingTests.length > 0) {
              matchingTests.forEach((test) => {
                if (titleDirectToCategList) {
                  titleDirectToCategList.forEach((field) => {
                    if (resultsByFieldId[field.uid] !== undefined) {
                      setValue(
                        `existing_${test.uid}_${field.uid}`,
                        resultsByFieldId[field.uid]
                      );
                    }
                  });
                }

                if (titleOfAll) {
                  titleOfAll.forEach((title) => {
                    title.field?.forEach((field) => {
                      if (resultsByFieldId[field.uid] !== undefined) {
                        setValue(
                          `existing_${test.uid}_${field.uid}`,
                          resultsByFieldId[field.uid]
                        );
                      }
                    });
                  });
                }
              });
            }
          }
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات آزمایش");
        } finally {
          setIsTestDetailsLoading(false);
          setIsHiddenInputsLoaded(true);
        }
      };

      fetchTestDetails();
    }
  };

  const validateInput = (value, type) => {
    if (!value) return true;
    
    switch (type) {
      case "FLOAT":
      case "PERCENTAGE":
        return true; // Allow typing any value, validation will happen on blur
      case "CHAR":
        return true;
      default:
        return true;
    }
  };

  const formatValue = (value, type) => {
    if (!value) return value;
    
    switch (type) {
      case "FLOAT":
        const floatNum = parseFloat(value);
        return isNaN(floatNum) ? "" : floatNum;
      case "PERCENTAGE":
        const percentNum = parseFloat(value);
        if (isNaN(percentNum)) return "";
        if (percentNum < 0) return 0;
        if (percentNum > 100) return 100;
        return percentNum;
      default:
        return value.toString();
    }
  };

  const onSubmit = async (data) => {
    setisSubmitting(true);
    const formattedData = {};
    Object.entries(data).forEach(([key, value]) => {
      const field = titleDirectToCategList.find((item) => item.uid === key);
      if (field) {
        formattedData[key] = formatValue(value, field.type);
      } else {
        formattedData[key] = value;
      }
    });

    const additionalData = {
      date: data?.date,
      category_uid: activeTab,
      patient_uid: uid,
    };

    delete formattedData.date;

    const fields = Object.keys(formattedData)
      .filter((key) => {
        const value = formattedData[key];
        return value !== null && value !== undefined && value !== "";
      })
      .map((key) => {
        const value = formattedData[key];

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
    (getHideInput && !isHiddenInputsLoaded) ||
    isTestDetailsLoading;

  const isMatchingTab = (tabName) => {
    if (!viewMode || !viewTestData?.testNames) return false;
    return viewTestData.testNames.some(
      (testName) => testName.toLowerCase() === tabName.toLowerCase()
    );
  };

  const getTestCountForTab = (tabName) => {
    if (!viewMode || !viewTestData?.groupedTests) return 0;
    return viewTestData.groupedTests[tabName]?.length || 0;
  };

  const handleDeleteTest = async (uid) => {
    try {
      const response = await axios.delete(
        `https://cancerreg.ir/api/v1/tests/test/${uid}/`
      );
      if (response.status >= 200 && response.status < 400) {
        toast.success("آزمایش با موفقیت حذف شد");
        if (viewTestData) {
          const activeTabData = tabsNew?.find((tab) => tab.uid === activeTab);
          if (activeTabData?.name) {
            const updatedTests = viewTestData.groupedTests[
              activeTabData.name
            ].filter((test) => test.uid !== uid);
            // setViewTestData((prev) => ({
            //   ...prev,
            //   groupedTests: {
            //     ...prev.groupedTests,
            //     [activeTabData.name]: updatedTests,
            //   },
            // }));
          }
        }
      }
    } catch (error) {
      toast.error("خطا در حذف آزمایش");
    }
  };

  const filterSubCategories = (subcategories) => {
    if (!diseaseType || !subcategories) return subcategories;

    console.log("subcategories", subcategories);
    console.log("diseaseType", diseaseType);

    return subcategories.filter((sub) => {
      // If diseaseType is SOLID, exclude NON_SOLID categories
      if (diseaseType === "SOLID") {
        return !sub.name.includes("NON_SOLID");
      }
      // If diseaseType is NON_SOLID, exclude SOLID categories
      if (diseaseType === "NON_SOLID") {
        return !sub.name.includes("SOLID") || sub.name.includes("NON_SOLID");
      }
      // If no diseaseType, show all categories
      return true;
    });
  };

  if (isLoading && isLoadingData !== false) {
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
          ?.map((tab, index) => {
            const isMatching = isMatchingTab(tab.name);
            const testCount = getTestCountForTab(tab.name);
            return (
              <Nav.Item key={index} className="m-2">
                <Nav.Link
                  className={`border ${isMatching ? "position-relative" : ""}`}
                  eventKey={tab?.uid ?? ""}
                  onClick={() => {
                    settitleOfAll(undefined);
                    settitleDirectToCategList(undefined);
                  }}
                >
                  {tab?.name ?? "Unknown Tab"}
                  {isMatching && testCount > 0 && (
                    // test.type === "info" ? "bg-warning" : "bg-success"
                    <span
                      className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark`}
                    >
                      {testCount}
                    </span>
                  )}
                </Nav.Link>
              </Nav.Item>
            );
          })}
      </Nav>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 mb-5 container shadow-lg">
          {/* Show previous test results in separate accordions */}
          {viewMode && getTestsForCurrentTab().length > 0 && (
            <div className="mb-4">
              <ConfirmDialog
                visible={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                message="آیا از حذف این آزمایش اطمینان دارید؟"
                header="تایید حذف"
                icon="pi pi-exclamation-triangle"
                accept={() => {
                  if (testToDelete) {
                    handleDeleteTest(testToDelete);
                    setTestToDelete(null);
                  }
                  setShowDeleteConfirm(false);
                }}
                reject={() => {
                  setTestToDelete(null);
                  setShowDeleteConfirm(false);
                }}
                acceptLabel="بله"
                rejectLabel="خیر"
              />

              {getTestsForCurrentTab().map((test) => (
                <Accordion key={test.uid} className="mb-3">
                  <AccordionTab
                    header={
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                          <span className="me-2">نتیجه آزمایش</span>
                          <span
                            className={`badge mx-3 ${
                              test.type === "info" ? "bg-warning" : "bg-success"
                            }`}
                          >
                            {test.type === "info"
                              ? "در حال انجام"
                              : "تکمیل شده"}
                          </span>
                        </div>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-danger p-button-text"
                          onClick={(e) => {
                            e.preventDefault();
                            setTestToDelete(test.uid);
                            setShowDeleteConfirm(true);
                          }}
                        />
                      </div>
                    }
                  >
                    {/* Previous test values */}
                    <div className="row">
                      {/* <span className="text-muted me-2">
                        {test?.date
                          ? moment(test?.date, "YYYY-MM-DD")
                              ?.locale("fa")
                              ?.format("jYYYY/jMM/jDD")
                          : moment(test?.created_at)
                              ?.locale("fa")
                              ?.format("jYYYY/jMM/jDD")}
                      </span> */}

                      {titleDirectToCategList
                        ?.sort(
                          (a, b) => (a?.ordering || 0) - (b?.ordering || 0)
                        )
                        ?.filter((field) => {
                          const excludeNames = Exexex.filter(
                            (name) => name !== selectedName
                          );
                          return !excludeNames.includes(field?.name);
                        })
                        ?.map((field) => (
                          <div
                            key={`${test.uid}_${field.uid}`}
                            className={`${
                              field?.name === "Immunofixation"
                                ? "flex-grow-1"
                                : ""
                            } ${
                              field?.titled
                                ? ""
                                : `col-md-${
                                    field?.name === "Immunofixation"
                                      ? 2
                                      : countOccurrencesDirectTitle[
                                          field?.ordering
                                        ]
                                      ? Math.ceil(
                                          12 /
                                            countOccurrencesDirectTitle[
                                              field?.ordering
                                            ]
                                        )
                                      : 12
                                  }`
                            }`}
                          >
                            <div className="form-group mb-3">
                              <label className="text-muted d-block mb-2">
                                {field?.name}
                              </label>
                              <Controller
                                name={`existing_${test.uid}_${field.uid}`}
                                control={control}
                                defaultValue=""
                                render={({ field: controllerField }) => (
                                  <InputText
                                    {...controllerField}
                                    value={controllerField.value || ""}
                                    className="w-100 bg-light"
                                    disabled={true}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionTab>
                </Accordion>
              ))}
            </div>
          )}

          <div>
            <h5 className="mb-4">
              {viewMode ? "ثبت نتیجه جدید" : "ثبت نتیجه آزمایش"}
            </h5>

            <div className="my-3 d-flex gap-2">
              {subCategory?.length > 0 &&
                filterSubCategories(subCategory).map((subs, index) => (
                  <div key={index} className="my-3">
                    <span
                      className={`px-3 py-2 rounded-3 cursor-pointer ${
                        activeSubCategoryIndex === index
                          ? "bg-warning"
                          : "border"
                      }`}
                      onClick={() => handleSubCategoryClick(subs, index)}
                    >
                      {subs.name}
                    </span>
                    <div className=""></div>
                  </div>
                ))}
            </div>
            <div className="d-flex flex-column">
              <div className="mb-3">
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
              </div>
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
                                                  field.onChange(value)
                                                }
                                              />
                                            )}
                                          />
                                        ) : (
                                          <Controller
                                            name={titleData?.uid}
                                            control={control}
                                            render={({ field: controllerField }) => (
                                              <div className="p-input-icon-right w-100">
                                                {titleData.type === "PERCENTAGE" && (
                                                  <i
                                                    className="pi pi-percentage"
                                                    style={{ left: "0.75rem", right: "auto" }}
                                                  />
                                                )}
                                                <InputText
                                                  {...controllerField}
                                                  className="w-100"
                                                  placeholder={
                                                    titleData.type === "FLOAT"
                                                      ? "مقدار عددی را وارد نمایید"
                                                      : titleData.type === "PERCENTAGE"
                                                      ? "درصد را وارد نمایید"
                                                      : "مقدار را وارد نمایید"
                                                  }
                                                  onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (validateInput(value, titleData.type)) {
                                                      controllerField.onChange(value);
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    const value = e.target.value;
                                                    if (value) {
                                                      const formattedValue = formatValue(value, titleData.type);
                                                      controllerField.onChange(formattedValue);
                                                      if (
                                                        formattedValue === "" &&
                                                        (titleData.type === "FLOAT" ||
                                                          titleData.type === "PERCENTAGE")
                                                      ) {
                                                        toast.error(
                                                          `لطفا یک ${titleData.type === "FLOAT" ? "عدد" : "درصد"} معتبر وارد کنید`
                                                        );
                                                      }
                                                    }
                                                  }}
                                                />
                                              </div>
                                            )}
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
                <div className="row d-flex">
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
                        className={`${
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
                        <div className={`py-2 my-4`}>
                          <label className="my-auto w-25 text-nowrap">
                            {titleDirectToCat?.name}
                          </label>
                          <div className="">
                            <Controller
                              name={titleDirectToCat.uid}
                              control={control}
                              render={({ field }) => (
                                <div className="p-input-icon-right w-100">
                                  {titleDirectToCat.type === "PERCENTAGE" && (
                                    <i
                                      className="pi pi-percentage"
                                      style={{ left: "0.75rem", right: "auto" }}
                                    />
                                  )}
                                  <InputText
                                    {...field}
                                    className="w-100"
                                    placeholder={
                                      titleDirectToCat.type === "FLOAT"
                                        ? "مقدار عددی را وارد نمایید"
                                        : titleDirectToCat.type === "PERCENTAGE"
                                        ? "درصد را وارد نمایید"
                                        : "مقدار را وارد نمایید"
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (validateInput(value, titleDirectToCat.type)) {
                                        field.onChange(value);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      const value = e.target.value;
                                      if (value) {
                                        const formattedValue = formatValue(value, titleDirectToCat.type);
                                        field.onChange(formattedValue);
                                        if (
                                          formattedValue === "" &&
                                          (titleDirectToCat.type === "FLOAT" ||
                                            titleDirectToCat.type === "PERCENTAGE")
                                        ) {
                                          toast.error(
                                            `لطفا یک ${
                                              titleDirectToCat.type === "FLOAT" ? "عدد" : "درصد"
                                            } معتبر وارد کنید`
                                          );
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {hiddenInputs?.length > 0 && (
              <HiddenInputsModal
                hiddenInputs={hiddenInputs}
                submittedInputs={submittedInputs}
                setSubmittedInputs={setSubmittedInputs}
                setHiddenSubmittedData={setHiddenSubmittedData}
              />
            )}

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
          </div>
        </div>
      </form>
    </Tab.Container>
  );
};

export default PillsTabs;
