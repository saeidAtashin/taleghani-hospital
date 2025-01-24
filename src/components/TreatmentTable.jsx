import React, { useState, useEffect, useRef, useMemo } from "react";
import { CascadeSelect } from "primereact/cascadeselect";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "jalali-moment";

const TreatmentTable = () => {
  const [treatmentValue, setTreatmentValue] = useState(null);
  const [protocolOptions, setProtocolOptions] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isTreatmentForm, setIsTreatmentForm] = useState(false);
  const [isCycleVisible, setisCycleVisible] = useState(false);
  const [newTreat, setnewTreat] = useState(false);
  const [showStartTreatBtn, setShowStartTreatBtn] = useState(true);
  const [startDateObj, setStartDateObj] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [treatmentStartDateObj, setTreatmentStartDateObj] = useState(null);
  const [treatmentStartDate, setTreatmentStartDate] = useState("");
  const [endDateObj, setEndDateObj] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [showedPart, setShowedPart] = useState("");
  const [responseUid, setResponseUid] = useState(undefined);
  const [refreshTreatTable, setRefreshTreatTable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycles, setCycles] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(undefined);
  const [selectedTreatment, setSelectedTreatment] = useState(undefined);
  const toast = useRef(null);
  const { uid } = useParams();
  const [mainSelection, setMainSelection] = useState(null);
  const [subSelection, setSubSelection] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [items, setItems] = useState([
    {
      label: "ثبت خط درمان جدید",
      command: () => addNewTreatment(),
    },
    {
      label: "خط درمان 1",
      command: () => null,
    },
  ]);

  const handleTabChange = (index) => {
    setActiveIndex(test ? index?.index : index);
    console.log("index", index?.index);
    // Reset inner inputs
    setSelectedProtocol(undefined);
    setSelectedTreatment(undefined);
    setStartDateObj(null);
    setEndDateObj(null);
    setDescription("");
    setCycles([]);
  };

  const addNewTreatment = () => {
    setItems((prevItems) => {
      const newItem = {
        label: `خط درمان ${prevItems.length}`,
        command: () => handleTabChange(prevItems.length),
      };
      return [...prevItems, newItem];
    });

    // Automatically activate the new treatment
    handleTabChange(items.length);
  };

  const stateTranslations = {
    IN_PROGRESS: "در حال انجام",
    COMPLETED: "تکمیل شده",
    PENDING: "در انتظار",
  };

  const stateClasses = {
    IN_PROGRESS: "state-in_progress",
    COMPLETED: "state-completed",
    PENDING: "state-pending",
  };

  useEffect(() => {
    axios
      .get("https://cancerreg.ir/api/v1/common/treatment-evaluation/")
      .then((response) => {
        const results = response.data?.data?.results || [];
        const formatted = results.map((item) => ({
          label: item.name,
          value: item.uid,
        }));

        console.log("Fetched options:", formatted); // Debug API response format
        setTreatment(formatted);

        console.log("Current selectedTreatment:", selectedTreatment);

        // Find and set default value
        const defaultOption = formatted.find(
          (t) => t.label === selectedTreatment
        );

        if (defaultOption) {
          console.log("Setting default:", defaultOption); // Debug to check if we found the default option
          setSelectedTreatment(defaultOption); // ✅ Ensure it's set
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [newTreat, selectedTreatment]); // Ensure dependencies are correct

  useEffect(() => {
    axios
      .get("https://cancerreg.ir/api/v1/common/protocol/")
      .then((response) => {
        const results = response.data?.data?.results || [];
        const formatted = results.map((item) => ({
          label: item.name,
          value: item.uid,
        }));
        setProtocolOptions(formatted);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const cascadeOptions = [
    {
      label: "جراحی",
      value: "surgry",
      children: [
        { label: "CURATIVE", value: "SURGERY" },
        { label: "PALLIATIVE", value: "SURGERY" },
        { label: "METASTASECTOMY", value: "SURGERY" },
      ],
    },
    {
      label: "رادیوتراپی",
      value: "رادیوتراپی",
      children: [
        { label: "CURATIVE", value: "RADIOTHERAPY" },
        { label: "PALLIATIVE", value: "RADIOTHERAPY" },
        { label: "PROPHYLACTIC", value: "RADIOTHERAPY" },
      ],
    },
    {
      label: "لوکال",
      value: "LOCAL",
      children: [
        { label: "MW", value: "LOCAL" },
        { label: "RF", value: "LOCAL" },
        { label: "TACE", value: "LOCAL" },
        { label: "HIPEC", value: "LOCAL" },
        { label: "PRRT", value: "LOCAL" },
      ],
    },
    {
      label: "CHEMOTHERAPY",
      value: "CHEMOTHERAPY",
    },
    {
      label: "HORMONETHERAPY",
      value: "HORMONETHERAPY",
    },
  ];

  useEffect(() => {
    if (Array.isArray(treatmentValue)) {
      setMainSelection(treatmentValue[0]?.value || null);
      setSubSelection(
        treatmentValue[1]?.value || treatmentValue[0]?.value || null
      );
    } else if (treatmentValue && treatmentValue.value) {
      setMainSelection(treatmentValue.value);
      setSubSelection(treatmentValue.value);
    } else {
      setMainSelection(null);
      setSubSelection(null);
    }

    const isForm =
      mainSelection === "HORMONETHERAPY" || mainSelection === "CHEMOTHERAPY";
    setIsTreatmentForm(!isForm);
  }, [treatmentValue, mainSelection, subSelection]);

  const handleStartDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setStartDateObj(date);
      setStartDate(formattedDate);
    } else {
      setStartDateObj(null);
      setStartDate("");
    }
  };

  const handleTreatmentStartDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setTreatmentStartDateObj(date);
      setTreatmentStartDate(formattedDate);
    } else {
      setTreatmentStartDateObj(null);
      setTreatmentStartDate("");
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setEndDateObj(date);
      setEndDate(formattedDate);
    } else {
      setEndDateObj(null);
      setEndDate("");
    }
  };

  const handleCycleDateChange = (index, date) => {
    const updatedCycles = [...cycles];
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      updatedCycles[index].date = formattedDate;
      updatedCycles[index].dateObj = date;
    } else {
      updatedCycles[index].date = "";
      updatedCycles[index].dateObj = null;
    }
    setCycles(updatedCycles);
  };

  const handleCycleDescriptionChange = (index, val) => {
    const updatedCycles = [...cycles];
    updatedCycles[index].description = val;
    setCycles(updatedCycles);
  };

  const addCycle = () => {
    setisCycleVisible(true);
    const newCycleNumber = cycles.length + 1;
    setCycles([
      ...cycles,
      { cycleNumber: newCycleNumber, date: "", dateObj: null, description: "" },
    ]);
  };

  const handleCycleapi = (cycle) => {
    if (cycle.cycleNumber === 1) {
    } else {
    }
  };

  const resetFormFields = () => {
    setTreatmentValue(null);
    setSelectedProtocol(undefined);
    setSelectedTreatment(undefined);
    setStartDateObj(null);
    setTreatmentStartDateObj(null);
    setTreatmentStartDate("");
    setStartDate("");
    setEndDateObj(null);
    setEndDate("");
    setDescription("");
    setCycles([]);
    setisCycleVisible(false);
    setShowedPart("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      type: isTreatmentForm ? "TREATMENT" : "CHEMOTHERAPY",
      category: treatmentValue?.value,
      sub_category: isTreatmentForm ? treatmentValue?.label : undefined,
      patient_uid: uid,
      start_date: startDate ? startDate : treatmentStartDate,
      end_date: endDate ? endDate : undefined,
      description: description ? description : undefined,
      evaluation_uid: selectedTreatment,
      protocol_uid: selectedProtocol,
    };

    if (!isTreatmentForm) {
      payload.evaluation_uid = selectedTreatment
        ? selectedTreatment
        : "8a8c5bc2-0030-44ca-ad7a-c8b69228bdec";
      payload.protocol_uid = selectedProtocol;
      payload.cycles = cycles.map((c) => ({
        cycleNumber: c.cycleNumber,
        date: c.date,
        description: c.description,
      }));
    }

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/teatment/treatment/",
        payload
      );

      if (response?.status >= 200 && response?.status < 400) {
        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });

        setResponseUid(response?.data?.data?.uid);
        setShowStartTreatBtn(false);

        setRefreshTreatTable(!refreshTreatTable);
        if (isTreatmentForm) {
          setnewTreat(false);
          resetFormFields();
        }

        setLoading(true);
        setShowedPart("showCycle");
        setLoading(false);
      }
    } catch (err) {
      if (err?.status >= 400) {
        setShowStartTreatBtn(true);
        console.error(err);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "خطا",
          detail: err.response?.data?.message || "مشکلی پیش آمده است.",
        });
      }
    } finally {
    }
  };

  const handleSubmitLine = async () => {
    const payload = {
      treatment_uid: responseUid,
      start_date: startDate,
      end_date: endDate ? endDate : undefined,
      description: description ? description : undefined,
      evaluation_uid: selectedTreatment,
      protocol_uid: selectedProtocol,
    };

    if (!isTreatmentForm) {
      payload.evaluation_uid = selectedTreatment
        ? selectedTreatment
        : "8a8c5bc2-0030-44ca-ad7a-c8b69228bdec";
      payload.protocol_uid = selectedProtocol;
      payload.cycles_list = cycles.map((c) => ({
        date: c.date,
        description: c.description,
      }));
    }

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/teatment/treatment-line/",
        payload
      );

      if (response?.status >= 200 && response?.status < 400) {
        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });
        addNewTreatment();
      }
    } catch (err) {
      if (err?.status >= 400) {
        console.error(err);
        toast.current.show({
          severity: "error",
          summary: "خطا",
          detail: err.response?.data?.message || "مشکلی پیش آمده است.",
        });
      }
    }
  };

  const persianDateTemplate = (field) => (rowData) => {
    const dateValue = rowData?.[field];

    if (!dateValue) {
      return <span>--</span>;
    }

    const persianDate = moment(dateValue, "YYYY-MM-DD", true);

    if (!persianDate.isValid()) {
      return <span>Invalid Date</span>;
    }

    return <span>{persianDate.locale("fa").format("jYYYY/jMM/jDD")}</span>;
  };

  const columns = useMemo(
    () => [
      {
        field: "start_date",
        header: "تاریخ شروع",
        body: persianDateTemplate("start_date"),
      },
      {
        field: "end_date",
        header: "تاریخ پایان",
        body: persianDateTemplate("end_date"),
      },
      { field: "category", header: "دسته‌بندی" },
      { field: "sub_category", header: "زیر دسته‌بندی" },
      { field: "evaluation", header: "ارزیابی" },
      {
        field: "state",
        header: "وضعیت",
        body: (rowData) => (
          <span className={stateClasses[rowData.state] || ""}>
            {stateTranslations[rowData.state] || rowData.state}
          </span>
        ),
      },
      { field: "description", header: "توضیحات" },
    ],
    [stateTranslations, stateClasses]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/teatment/patient-treatments/${uid}/`
        );
        const { results } = response.data;

        setProducts(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [uid, refreshTreatTable]);

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start">
      <Button
        label="ایجاد درمان جدید"
        icon="pi pi-plus-circle ps-1"
        severity="primary"
        onClick={() => setnewTreat(true)}
        className="rounded-3"
      />
    </div>
  );

  const handleRowClick = async (rowData) => {
    const uid = rowData.uid;
    const apiUrl = `https://cancerreg.ir/api/v1/teatment/treatment/${uid}/`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("data injaaaaaaa", data?.data);
      // if (data.results && data.results.length > 0) {
      const treatmentData = data?.data;
      setTreatmentValue(
        rowData?.sub_category ? rowData?.sub_category : rowData?.category || ""
      );
      setStartDateObj(treatmentData.start_date || "");
      setEndDateObj(treatmentData.end_date || "");
      setSelectedTreatment(treatmentData.evaluation);
      setSelectedProtocol(
        protocolOptions.find((item) => item.value === treatmentData.protocol) ||
          null
      );
      setDescription(treatmentData.description || "");

      setnewTreat(true);
      // } else {
      //   console.warn("No treatment data found.");
      // }
    } catch (error) {
      console.error("Error fetching treatment data:", error);
    }
  };

  return (
    <>
      <Toast ref={toast} />

      {!newTreat && (
        <DataTable
          dir="rtl"
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="uid"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} اطلاعات"
          globalFilter={null}
          header={headerNew}
          onRowClick={(e) => handleRowClick(e.data)}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ borderBottom: "2px solid black" }}
          ></Column>
          {columns?.map((col, index) => (
            <Column
              sortable
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              style={{
                textAlign: "right",
                direction: "rtl",
                whiteSpace: "nowrap",
              }}
              headerStyle={{
                borderBottom: "2px solid black",
                whiteSpace: "nowrap",
              }}
            />
          ))}
          <Column
            header="عملیات"
            headerStyle={{ borderBottom: "2px solid black" }}
            body={(rowData) => (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() =>
                  window.open(
                    `/dashboard/patients-lists/${rowData.uid}`,
                    "_blank"
                  )
                }
              >
                مشاهده
              </button>
            )}
          />
        </DataTable>
      )}

      {newTreat && (
        <>
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-2 pb-3">ایجاد درمان جدید</h2>
              <span
                className="text-danger cursor-pointer"
                style={{ fontSize: "32px" }}
                onClick={() => {
                  resetFormFields();
                  setnewTreat(false);
                }}
              >
                x
              </span>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-2" htmlFor="treatment">
              انتخاب درمان:
            </label>
            <div className="p-col-12 p-md-10">
              <CascadeSelect
                value={treatmentValue}
                options={cascadeOptions}
                optionLabel={"label"}
                optionGroupLabel={"label"}
                optionGroupChildren={["children"]}
                placeholder="Select a treatment"
                onChange={(e) => {
                  resetFormFields();
                  setTreatmentValue(e.value);
                }}
                style={{ minWidth: "14rem" }}
              />
            </div>
          </div>

          {treatmentValue && (
            <div className="p-mt-3 mb-4">
              {isTreatmentForm ? (
                <>
                  <div className="d-flex flex-column my-3">
                    <label className="p-col-12 p-md-2" htmlFor="start_date">
                      تاریخ شروع خط درمان:
                    </label>
                    <DatePicker
                      value={startDateObj}
                      onChange={handleStartDateChange}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      placeholder="تاریخ را انتخاب کنید"
                      className="p-2 border rounded"
                      inputClass="w-full p-2 text-end w-100 border rounded"
                      position="bottom-right"
                    />
                  </div>

                  <div className="d-flex flex-column my-3">
                    <label className="p-col-12 p-md-2" htmlFor="evaluation_uid">
                      ارزیابی خط درمان:
                    </label>
                    <div className="p-col-12 p-md-10">
                      <Dropdown
                        id="evaluation_uid"
                        value={selectedTreatment}
                        options={treatment}
                        onChange={(e) => setSelectedTreatment(e.value)}
                        placeholder="ارزیابی را انتخاب کنید"
                        optionLabel="label"
                        className="w-100"
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-column my-3">
                    <label className="p-col-12 p-md-2" htmlFor="end_date">
                      تاریخ پایان درمان:
                    </label>
                    <DatePicker
                      value={endDateObj}
                      onChange={handleEndDateChange}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      placeholder="تاریخ را انتخاب کنید"
                      className="p-2 border rounded"
                      inputClass="w-full p-2 text-end w-100 border rounded"
                      position="bottom-right"
                    />
                  </div>

                  <div className="d-flex flex-column my-3">
                    <label className="p-col-12 p-md-2" htmlFor="description">
                      توضیحات:
                    </label>
                    <div className="p-col-12 p-md-10">
                      <InputTextarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-100"
                        placeholder="توضیحات مرتبط با خط درمان را وارد نمایید."
                      />
                    </div>
                  </div>

                  <Button
                    label="تایید و ثبت نتایج"
                    icon="pi pi-check"
                    onClick={handleSubmit}
                    loading={loading}
                    className="w-100"
                  />
                </>
              ) : (
                <>
                  <div className="d-flex flex-column my-3">
                    <label className="p-col-12 p-md-2" htmlFor="start_date">
                      تاریخ شروع درمان:
                    </label>
                    <div className="d-flex w-100 gap-5">
                      <DatePicker
                        value={treatmentStartDateObj}
                        onChange={handleTreatmentStartDateChange}
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD"
                        placeholder="تاریخ را انتخاب کنید"
                        className="p-2 border rounded w-100"
                        inputClass="w-100 p-2 text-end border rounded"
                        position="bottom-right"
                      />
                      {showStartTreatBtn && (
                        <div style={{ flex: 1 }}>
                          <Button
                            label="شروع درمان"
                            icon="pi pi-check"
                            onClick={handleSubmit}
                            loading={loading}
                            className="w-100 bg-white text-dark rounded-3"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {showedPart === "showCycle" && (
                    <div className="mt-4 pt-4">
                      <TabMenu
                        model={items?.map((item) => ({
                          label: item?.template || item?.label,
                          command: item.command,
                        }))}
                        activeIndex={activeIndex === 0 ? 1 : activeIndex}
                        // onTabChange={(e) => setActiveIndex(e.index)}
                        onTabChange={
                          activeIndex === 0
                            ? console.log("test")
                            : handleTabChange
                        }
                      />

                      <div className="d-flex flex-column my-3">
                        <label className="p-col-12 p-md-2" htmlFor="start_date">
                          تاریخ شروع خط درمان:
                        </label>
                        <DatePicker
                          value={startDateObj}
                          onChange={handleStartDateChange}
                          calendar={persian}
                          locale={persian_fa}
                          format="YYYY/MM/DD"
                          placeholder="تاریخ را انتخاب کنید"
                          className="p-2 border rounded"
                          inputClass="w-full p-2 text-end w-100 border rounded"
                          position="bottom-right"
                        />
                      </div>
                      <div className="">
                        <label
                          className="p-col-12 p-md-2 mt-3"
                          htmlFor="protocol"
                        >
                          پروتکل:
                        </label>
                        <div className="p-col-12 p-md-10 mb-4">
                          <Dropdown
                            id="protocol"
                            value={selectedProtocol}
                            options={protocolOptions}
                            onChange={(e) => setSelectedProtocol(e.value)}
                            placeholder="پروتکل را انتخاب نمایید"
                            optionLabel="label"
                            className="w-100"
                          />
                        </div>
                      </div>

                      <Button
                        label={`\u00A0 ثبت سیکل جدید`}
                        icon="pi pi-plus"
                        className="p-button-text border rounded mb-4"
                        onClick={addCycle}
                        type="button"
                      />

                      {isCycleVisible && (
                        <fieldset
                          style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <legend>سیکل ها</legend>
                          <Accordion
                            activeIndex={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                            multiple
                          >
                            {cycles.map((cycle, index) => (
                              <AccordionTab
                                key={index}
                                header={`\u00A0 سیکل ${cycle.cycleNumber} `}
                              >
                                <div className="d-flex flex-column my-3">
                                  <label
                                    className="p-col-12 p-md-2"
                                    htmlFor={`cycle_date_${index}`}
                                  >
                                    تاریخ:
                                  </label>
                                  <DatePicker
                                    value={cycle.dateObj}
                                    onChange={(date) =>
                                      handleCycleDateChange(index, date)
                                    }
                                    calendar={persian}
                                    locale={persian_fa}
                                    format="YYYY/MM/DD"
                                    placeholder="تاریخ را انتخاب کنید"
                                    className="p-2 border rounded"
                                    inputClass="w-full p-2 text-end w-100 border rounded"
                                    position="bottom-right"
                                  />
                                </div>
                                <div className="p-field p-grid">
                                  <label
                                    className="p-col-12 p-md-2"
                                    htmlFor={`cycle_desc_${index}`}
                                  >
                                    توضیحات:
                                  </label>
                                  <div className="p-col-12 p-md-10">
                                    <InputTextarea
                                      id={`cycle_desc_${index}`}
                                      value={cycle.description}
                                      onChange={(e) =>
                                        handleCycleDescriptionChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      rows={2}
                                      className="w-100"
                                    />
                                  </div>
                                </div>
                                <Button
                                  label="ذخیره"
                                  type="button"
                                  icon="pi pi-check"
                                  className="p-button border rounded mb-4"
                                  onClick={() => handleCycleapi(cycle)}
                                />
                              </AccordionTab>
                            ))}
                          </Accordion>
                        </fieldset>
                      )}
                      <div className="d-flex flex-column my-4">
                        <label
                          className="p-col-12 p-md-2"
                          htmlFor="evaluation_uid"
                        >
                          ارزیابی درمان:
                        </label>
                        <div className="p-col-12 p-md-10">
                          <Dropdown
                            id="evaluation_uid"
                            value={selectedTreatment}
                            options={treatment}
                            onChange={(e) => setSelectedTreatment(e.value)}
                            placeholder="ارزیابی را انتخاب کنید"
                            optionLabel="label"
                            className="w-100"
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-column my-3">
                        <label className="p-col-12 p-md-2" htmlFor="end_date">
                          تاریخ پایان خط درمان:
                        </label>
                        <DatePicker
                          value={endDateObj}
                          onChange={handleEndDateChange}
                          calendar={persian}
                          locale={persian_fa}
                          format="YYYY/MM/DD"
                          placeholder="تاریخ را انتخاب کنید"
                          className="p-2 border rounded"
                          inputClass="w-full p-2 text-end w-100 border rounded"
                          position="bottom-right"
                        />
                      </div>
                    </div>
                  )}
                  {!showStartTreatBtn && (
                    <div style={{ flex: 1 }}>
                      <Button
                        label="پایان خط درمان"
                        icon="pi pi-check"
                        onClick={handleSubmitLine}
                        loading={loading}
                        className="w-100 bg-white text-dark rounded-3"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TreatmentTable;
