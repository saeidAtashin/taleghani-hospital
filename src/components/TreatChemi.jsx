import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { TabMenu } from "primereact/tabmenu";

const TreatChemi = ({
  treatmentStartDateObj,
  setTreatmentStartDateObj,
  setTreatmentStartDate,
  showStartTreatBtn,
  handleSubmit,
  loading,
  showedPart,
  setCycles,
  setisCycleVisible,
  isCycleVisible,
  items,
  activeIndex,
  handleTabChange,
  startDateObj,
  handleStartDateChange,
  selectedProtocol,
  protocolOptions,
  setSelectedProtocol,
  selectedTreatment,
  treatment,
  endDateObj,
  handleEndDateChange,
  setSelectedTreatment,
  cycles,

  handleSubmitLine,
}) => {
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

  const removeCycle = (index) => {
    const updatedCycles = cycles.filter((_, i) => i !== index);
    setCycles(updatedCycles);
  };

  return (
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
              activeIndex === 0 ? console.log("test") : handleTabChange
            }
          />

          <div className="d-flex flex-column my-3">
            <label className="p-col-12 p-md-2" htmlFor="start_date">
              تاریخ شروع خط درمان:
            </label>
            <DatePicker
              value={
                treatmentStartDateObj ? treatmentStartDateObj : startDateObj
              }
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
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>سیکل {cycle.cycleNumber}</h5>
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger"
                        onClick={() => removeCycle(index)}
                        tooltip="حذف سیکل"
                      />
                    </div>
                    <div className="d-flex flex-column my-3">
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
            <label className="p-col-12 p-md-2" htmlFor="evaluation_uid">
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
  );
};

export default TreatChemi;
