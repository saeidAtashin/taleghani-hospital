import React, { useState, useEffect, useRef } from "react";
import { CascadeSelect } from "primereact/cascadeselect";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

// For date pickers
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const TreatmentTable = () => {
  const [treatmentValue, setTreatmentValue] = useState(null);
  const [protocolOptions, setProtocolOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);

  const [isTreatmentForm, setIsTreatmentForm] = useState(false);

  const [startDateObj, setStartDateObj] = useState(null);
  const [startDate, setStartDate] = useState("");

  const [endDateObj, setEndDateObj] = useState(null);
  const [endDate, setEndDate] = useState("");

  const [cycles, setCycles] = useState([
    { cycleNumber: 1, date: "", dateObj: null, description: "" },
  ]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const toast = useRef(null);

  useEffect(() => {
    axios
      .get("https://cancerreg.ir/api/v1/common/treatment-evaluation/")
      .then((response) => {
        const results = response.data?.data?.results || [];
        const formatted = results.map((item) => ({
          label: item.name,
          value: item.id,
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

  // Recalculate isTreatmentForm whenever treatmentValue changes
  useEffect(() => {
    let mainSelection = null;
    let subSelection = null;

    if (Array.isArray(treatmentValue)) {
      // This is when a nested selection is made and we get a path array
      mainSelection = treatmentValue[0]?.value;
      subSelection = treatmentValue[1]?.value;
    } else if (treatmentValue && treatmentValue.value) {
      // This is when there's only a single-level selection
      mainSelection = treatmentValue.value;
    }

    // Determine if it is the treatment form
    // Condition: If "هورمون درمانی" or ("لوکال" and "TACE")
    const isForm =
      mainSelection === "هورمون درمانی" ||
      (mainSelection === "لوکال" && subSelection === "TACE");
    setIsTreatmentForm(isForm);

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
  }, [treatmentValue]);

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
    const newCycleNumber = cycles.length + 1;
    setCycles([
      ...cycles,
      { cycleNumber: newCycleNumber, date: "", dateObj: null, description: "" },
    ]);
  };

  const handleSubmit = () => {
    setLoading(true);
    const mainSelection = treatmentValue?.[0];
    const subSelection = treatmentValue?.[1];

    const payload = {
      type: isTreatmentForm ? "TREATMENT" : "CHEMOTHERAPY",
      start_date: startDate,
      end_date: endDate,
      description: description,
      evaluation_result: evaluationResult,
      main_selection: mainSelection,
      sub_selection: subSelection,
    };

    if (!isTreatmentForm) {
      payload.protocol = selectedProtocol;
      payload.cycles = cycles.map((c) => ({
        cycleNumber: c.cycleNumber,
        date: c.date,
        description: c.description,
      }));
    }

    axios
      .post("YOUR_API_ENDPOINT", payload)
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while saving data",
        });
        setLoading(false);
      });
  };

  return (
    <>
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
            // TREATMENT FORM
            <>
              <div className="p-field p-grid">
                <label className="p-col-12 p-md-2" htmlFor="start_date">
                  Start Date:
                </label>
                <div className="p-col-12 p-md-10">
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
              </div>

              <div className="p-field p-grid">
                <label className="p-col-12 p-md-2" htmlFor="evaluation_result">
                  نتیجه:
                </label>
                <div className="p-col-12 p-md-10">
                  <Dropdown
                    id="evaluation_result"
                    value={evaluationResult}
                    options={evaluationValues}
                    onChange={(e) => setEvaluationResult(e.value)}
                    placeholder="Select Result"
                  />
                </div>
              </div>

              <div className="p-field p-grid">
                <label className="p-col-12 p-md-2" htmlFor="end_date">
                  End Date:
                </label>
                <div className="p-col-12 p-md-10">
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

              <div className="p-field p-grid">
                <label className="p-col-12 p-md-2" htmlFor="description">
                  توضیحات:
                </label>
                <div className="p-col-12 p-md-10">
                  <InputTextarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={loading}
              />
            </>
          ) : (
            // CHEMOTHERAPY FORM
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
                <label className="p-col-12 p-md-2 mt-3" htmlFor="protocol">
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

              <fieldset
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <legend>سیکل ها</legend>
                {cycles.map((cycle, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <h5>سیکل {cycle.cycleNumber}</h5>
                    <div className="d-flex flex-column">
                      <label
                        className="p-col-12 p-md-2"
                        htmlFor={`cycle_date_${index}`}
                      >
                        تاریخ:
                      </label>
                      <DatePicker
                        value={cycle.dateObj}
                        onChange={(date) => handleCycleDateChange(index, date)}
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
                            handleCycleDescriptionChange(index, e.target.value)
                          }
                          rows={2}
                          className="w-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  label="ثبت سیکل جدید"
                  icon="pi pi-plus"
                  className="p-button-text border rounded"
                  onClick={addCycle}
                />
              </fieldset>

              <div className="p-field p-grid">
                <label className="p-col-12 p-md-2" htmlFor="evaluation_result">
                  ارزیابی خط درمان:
                </label>
                <div className="p-col-12 p-md-10">
                  <Dropdown
                    id="evaluation_result"
                    value={evaluationResult}
                    options={evaluationValues}
                    onChange={(e) => setEvaluationResult(e.value)}
                    placeholder="ارزیابی را انتخاب کننید"
                    className="w-100"
                  />
                </div>
              </div>

              <div className="d-flex flex-column my-3 ">
                <label className="p-col-12 p-md-2" htmlFor="end_date">
                  تاریخ پایان خط درمان:
                </label>
                <DatePicker
                  value={endDateObj}
                  onChange={handleEndDateChange}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  placeholder="تاریخ پایان خط درمان"
                  className="p-2 border rounded "
                  inputClass="w-full p-2 text-end w-100 border rounded"
                  position="bottom-right"
                />
              </div>

              <div className="w-100 my-3">
                <label className="w-100" htmlFor="description">
                  توضیحات:
                </label>
                <div className="w-100">
                  <InputTextarea
                    className="w-100"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="d-flex  flex-column gap-2 ">
                <Button
                  label="ذخیره"
                  icon="pi pi-check"
                  onClick={handleSubmit}
                  loading={loading}
                  className="w-100 bg-white text-dark"
                />
                <Button
                  label="پایان درمان"
                  icon="pi pi-check"
                  onClick={handleSubmit}
                  className="w-100"
                  loading={loading}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TreatmentTable;
