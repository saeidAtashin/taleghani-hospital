import React, { useState, useEffect, useRef, useMemo } from "react";
import { CascadeSelect } from "primereact/cascadeselect";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion"; // وارد کردن Accordion
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
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(undefined);

  const [isTreatmentForm, setIsTreatmentForm] = useState(false);
  const [isCycleVisible, setisCycleVisible] = useState(false);

  const [startDateObj, setStartDateObj] = useState(null);
  const [startDate, setStartDate] = useState("");

  const [endDateObj, setEndDateObj] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [showedPart, setShowedPart] = useState("");
  const [counter, setCounter] = useState(2);

  const [items, setItems] = useState([
    {
      label: "ثبت خط درمان جدید",
      command: () => addNewTreatment(),
    },
    {
      label: "خط درمان 1",
      command: () => openModal(),
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const addNewTreatment = () => {
    const newItem = {
      label: `خط درمان ${counter}`,
      command: () => openModal(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setCounter((prevCounter) => prevCounter + 1);
    setActiveIndex(items.length);
  };

  const openModal = () => {};

  const [cycles, setCycles] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const toast = useRef(null);

  const { uid } = useParams();

  // New state variables for main and sub selections
  const [mainSelection, setMainSelection] = useState(null);
  const [subSelection, setSubSelection] = useState(null);

  const stateTranslations = {
    IN_PROGRESS: "در حال انجام",
    COMPLETED: "تکمیل شده",
    PENDING: "در انتظار",
    // Add other mappings as needed
  };

  const stateClasses = {
    IN_PROGRESS: "state-in_progress",
    COMPLETED: "state-completed",
    PENDING: "state-pending",
    // Add other mappings as needed
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
        setProtocolOptions(formatted);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const cascadeOptions = [
    {
      label: "جراحی",
      value: "جراحی",
      children: [
        { label: "Curative", value: "Curative" },
        { label: "Palliative", value: "Palliative" },
        { label: "Metastasectomy", value: "Metastasectomy" },
      ],
    },
    {
      label: "رادیوتراپی",
      value: "رادیوتراپی",
      children: [
        { label: "Curative", value: "Curative" },
        { label: "Palliative", value: "Palliative" },
        { label: "Prophylactic", value: "Prophylactic" },
      ],
    },
    {
      label: "لوکال",
      value: "لوکال",
      children: [
        { label: "MW", value: "MW" },
        { label: "RF", value: "RF" },
        { label: "TACE", value: "TACE" },
        { label: "HIPEC", value: "HIPEC" },
        { label: "PRRT", value: "PRRT" },
      ],
    },
    {
      label: "شیمی درمانی-ایمونوتراپی",
      value: "شیمی درمانی-ایمونوتراپی",
    },
    {
      label: "هورمون درمانی",
      value: "هورمون درمانی",
    },
  ];

  const evaluationValues = [
    { label: "PR", value: "PR" },
    { label: "CR", value: "CR" },
    { label: "SD", value: "SD" },
    { label: "PD", value: "PD" },
    { label: "Relapse", value: "Relapse" },
    { label: "Complication of Treatment", value: "Complication of Treatment" },
    { label: "R0", value: "R0" },
    { label: "R1", value: "R1" },
    { label: "R2", value: "R2" },
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
      mainSelection === "هورمون درمانی" ||
      mainSelection === "شیمی درمانی-ایمونوتراپی";
    setIsTreatmentForm(!isForm);

    console.log(
      "treatmentValue:",
      treatmentValue,
      "mainSelection:",
      mainSelection,
      "subSelection:",
      subSelection,
      "isTreatmentForm:",
      isForm
    );
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

  const handleCycleapi = () => {};

  const handleSubmit = () => {
    setLoading(true);

    // Validate required fields
    if (!mainSelection || !subSelection || !startDate || !selectedProtocol) {
      toast.current.show({
        severity: "error",
        summary: "خطا",
        detail: "لطفاً همه فیلدهای الزامی را پر کنید.",
      });
      setLoading(false);
      return;
    }

    const payload = {
      type: isTreatmentForm ? "TREATMENT" : "CHEMOTHERAPY",
      category: mainSelection,
      sub_category: subSelection,
      patient_uid: uid,
      start_date: startDate,
      end_date: endDate,
      description: description,
      evaluation_uid: selectedProtocol,
      // Remove main_selection and sub_selection if not needed
      // main_selection: mainSelection,
      // sub_selection: subSelection,
    };

    if (!isTreatmentForm) {
      payload.protocol = selectedProtocol;
      payload.cycles = cycles.map((c) => ({
        cycleNumber: c.cycleNumber,
        date: c.date,
        description: c.description,
      }));
    }

    console.log("payload", payload);

    axios
      .post("https://cancerreg.ir/api/v1/teatment/treatment/", payload)
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully",
        });
        setLoading(false);
        // Optionally, reset the form or handle post-submission logic here
      })
      .catch((err) => {
        console.error(err);
        toast.current.show({
          severity: "error",
          summary: "خطا",
          detail: err.response?.data?.message || "مشکلی پیش آمده است.",
        });
        setLoading(false);
      });
  };

  const handleSubmitLine = () => {
    setLoading(true);

    setShowedPart("showCycle");
    setLoading(false); // Reset loading if no async operations
  };

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const numberTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>;
  };

  const persianDateTemplate = (field) => (rowData) =>
    (
      <span>
        {moment(rowData?.[field], "YYYY-MM-DD")
          .locale("fa")
          .format("jYYYY/jMM/jDD")}
      </span>
    );

  const columns = useMemo(
    () => [
      // { field: "created_at", header: "تاریخ ایجاد", width: "150px" },
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
      // { field: "patient", header: "بیمار",  },
      // { field: "category", header: "دسته‌بندی",  },
      { field: "sub_category", header: "زیر دسته‌بندی" },
      // { field: "type", header: "نوع درمان",  },
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
    [stateTranslations]
  );

  function nameTemplate(rowData) {
    const names = Array.isArray(rowData?.name) ? rowData.name : [];

    console.log("rowData", rowData);

    return (
      <div>
        {names.map((nameItem, index) => (
          <span
            key={index}
            onClick={() => {
              console.log("UID of the clicked item:", rowData?.id); // Log the uid when clicked
            }}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: nameItem.type === "info" ? "#FF7518" : "green",
              marginRight: "8px",
            }}
          >
            {nameItem.value}
          </span>
        ))}
      </div>
    );
  }

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
  }, []);

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-start">
      <Button
        label="ایحاد درمان جدید"
        icon="pi pi-plus-circle ps-1"
        severity="primary"
        // onClick={() => setShowAzmayeshPAge("orderRegister")}
        className="rounded-3 "
      />
    </div>
  );
  return (
    <>
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

      <Toast ref={toast} />
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
            onChange={(e) => setTreatmentValue(e.value)}
            style={{ minWidth: "14rem" }}
          />
        </div>
      </div>

      {treatmentValue && (
        <div className="p-mt-3 mb-4 ">
          {isTreatmentForm ? (
            // فرم درمان
            <>
              <div className="d-flex flex-column my-3 ">
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
                  ارزیابی درمان:
                </label>
                <div className="p-col-12 p-md-10">
                  <Dropdown
                    id="evaluation_uid"
                    value={selectedProtocol}
                    options={protocolOptions}
                    onChange={(e) => setSelectedProtocol(e.value)}
                    placeholder="ارزیابی را انتخاب کنید"
                    optionLabel="label"
                    className="w-100"
                  />
                </div>
              </div>

              <div className="d-flex flex-column my-3 ">
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

              <div className="d-flex flex-column my-3 ">
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
            // فرم شیمی‌درمانی
            <>
              <div className="d-flex flex-column my-3">
                <label className="p-col-12 p-md-2" htmlFor="start_date">
                  تاریخ شروع درمان:
                </label>
                <div className="d-flex w-100">
                  <div style={{ flex: 3, marginRight: "10px" }}>
                    <DatePicker
                      value={startDateObj}
                      onChange={handleStartDateChange}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      placeholder="تاریخ را انتخاب کنید"
                      className="p-2 border rounded w-100"
                      inputClass="w-100 p-2 text-end border rounded"
                      position="bottom-right"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Button
                      label="ذخیره"
                      icon="pi pi-check"
                      onClick={handleSubmitLine}
                      loading={loading}
                      className="w-100 bg-white text-dark rounded-3"
                    />
                  </div>
                </div>
              </div>

              {showedPart === "showCycle" && (
                <div className=" mt-4 pt-4">
                  <TabMenu
                    scrollable
                    model={items?.map((item) => ({
                      label: item?.template || item?.label,
                      command: item.command,
                    }))}
                    activeIndex={activeIndex === 0 ? 1 : activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  />

                  <>
                    <div className="d-flex flex-column my-3 ">
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
                      <div className="p-col-12 p-md-10 mb-4 ">
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
                  </>

                  <Button
                    label="ثبت سیکل جدید"
                    icon="pi pi-plus"
                    className="p-button-text border rounded mb-4"
                    onClick={addCycle}
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
                      <Accordion activeIndex={[0]} multiple>
                        {cycles.map((cycle, index) => (
                          <AccordionTab
                            key={index}
                            header={`سیکل ${cycle.cycleNumber}`}
                          >
                            <div className="d-flex flex-column my-3 ">
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
                              icon="pi"
                              className="p-button border rounded mb-4"
                              onClick={handleCycleapi}
                            />
                          </AccordionTab>
                        ))}
                      </Accordion>
                    </fieldset>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TreatmentTable;
