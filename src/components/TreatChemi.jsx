import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog";
import axios from "axios";

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
  allDatas,
  handleSubmitLine,
  uidForCycle,
  setAllDatas,
  setShowStartTreatBtn,
  setDescription,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingtar, setLoadingtar] = useState(false);
  const [savedCycles, setSavedCycles] = useState([]); // Track saved cycles
  const handleTreatmentStartDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setTreatmentStartDateObj(date);

      setTreatmentStartDate(formattedDate);
      setStartDate(formattedDate);
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

  const addCycle = (treatmentIndex) => {
    setisCycleVisible(true);

    const updatedTreatments = [...allDatas];

    if (!Array.isArray(updatedTreatments[treatmentIndex]?.cycles)) {
      updatedTreatments[treatmentIndex].cycles = [];
    }

    const newCycleNumber = updatedTreatments[treatmentIndex].cycles.length + 1;

    const currentProtocol = updatedTreatments[treatmentIndex]?.protocol; // Get the protocol for the specific treatment

    updatedTreatments[treatmentIndex].cycles = [
      ...updatedTreatments[treatmentIndex].cycles, // Spread existing cycles
      {
        cycleNumber: newCycleNumber,
        date: "",
        dateObj: null,
        description: "",
        protocol: currentProtocol,
      },
    ];

    setAllDatas(updatedTreatments);
  };

  console.log("allDatas in chemi", allDatas);

  const handleCycleapi = async (cycle) => {
    const cycleData = {
      treatment_line_uid: uidForCycle,
      date: cycle.date,
      description: "cycle.description",
    };

    try {
      setLoadingtar(true);

      const response = await axios.post(
        "https://cancerreg.ir/api/v1/teatment/cycle/",
        cycleData
      );

      setSavedCycles((prevSavedCycles) => [
        ...prevSavedCycles,
        cycle.cycleNumber,
      ]);
    } catch (error) {
      console.error(
        "Error in API call for cycle",
        cycle.cycleNumber,
        ":",
        error
      );
    } finally {
      setLoadingtar(false);
    }
  };

  // const handleSubmitAllCycles = () => {
  //   cycles.forEach((cycle) => {
  //     handleCycleapi(cycle);
  //   });
  // };

  const removeCycle = (index) => {
    const updatedCycles = cycles.filter((_, i) => i !== index);
    setCycles(updatedCycles);
  };

  const handleSubmitModal = () => {
    setShowModal(false);
    handleSubmit();
  };

  const addTreatmentLine = () => {
    setAllDatas((prev = []) => [
      ...prev,
      {
        id: prev?.length + 1, // Unique ID based on length
        startDate: "",
        protocol: null,
        description: "",
      },
    ]);
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
        <>
          <Accordion
            multiple
            activeIndex={[
              ...Array(allDatas?.length > 0 ? allDatas?.length : 1).keys(),
            ]}
          >
            {allDatas?.map((treatment, index) => (
              <AccordionTab
                className="my-3 rounded-3"
                key={treatment.uid}
                header={`خط درمان ${index + 1}`}
              >
                <div about="dropadd" className="">
                  <div className="d-flex flex-column">
                    <label className="p-col-12 p-md-2" htmlFor="start_date">
                      تاریخ شروع خط درمان:
                    </label>
                    <DatePicker
                      value={
                        treatment.start_date
                          ? new DateObject({
                              date: treatment.start_date,
                              calendar: "gregorian",
                            })
                              .convert(persian)
                              .format("YYYY/MM/DD")
                          : ""
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

                  <div className="">
                    <label className="p-col-12 p-md-2 mt-3" htmlFor="protocol">
                      پروتکل:
                    </label>
                    <div className="p-col-12 p-md-10 mb-4">
                      <Dropdown
                        value={selectedProtocol}
                        options={protocolOptions}
                        onChange={(e) => {
                          setSelectedProtocol(e.value);
                          const updatedTreatments = [...allDatas];
                          updatedTreatments[index].protocol = e.value;
                          setAllDatas(updatedTreatments);
                        }}
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
                    onClick={() => addCycle(index)} // Pass the treatment line index
                    type="button"
                  />

                  {treatment?.cycles?.length > 0 && (
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <legend>سیکل ها</legend>
                      <Accordion multiple>
                        {treatment.cycles.map((cycle, cycleIndex) => (
                          <AccordionTab
                            key={cycle.uid}
                            header={`\u00A0 سیکل ${cycleIndex + 1} `}
                            className="bg-dark "
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5>سیکل {cycleIndex + 1}</h5>
                              <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={() => removeCycle(cycleIndex)}
                                tooltip="حذف سیکل"
                              />
                            </div>

                            <div className="d-flex flex-column my-3">
                              <label
                                className="p-col-12 p-md-2"
                                htmlFor={`cycle_date_${cycleIndex}`}
                              >
                                تاریخ:
                              </label>
                              <DatePicker
                                value={cycle.date}
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
                                htmlFor={`cycle_desc_${cycleIndex}`}
                              >
                                توضیحات:
                              </label>
                              <div className="p-col-12 p-md-10">
                                <InputTextarea
                                  id={`cycle_desc_${cycleIndex}`}
                                  value={cycle.description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  rows={2}
                                  className="w-100"
                                />
                              </div>
                            </div>
                            <div>
                              <Button
                                label={`\u00A0 ثبت سیکل`}
                                icon="pi pi-plus"
                                className="p-button-text border rounded mb-4"
                                onClick={handleCycleapi}
                                type="button"
                              />
                            </div>
                          </AccordionTab>
                        ))}
                      </Accordion>
                    </fieldset>
                  )}
                </div>

                {!showStartTreatBtn && (
                  <Button
                    label="ذخیره"
                    icon="pi pi-check"
                    onClick={handleSubmitLine}
                    loading={loading}
                    className="w-100 bg-white text-dark rounded-3"
                  />
                )}
              </AccordionTab>
            ))}
          </Accordion>
          <Button
            label={`\u00A0 افزودن خط درمان`}
            icon="pi pi-plus"
            className="p-button-text border rounded mb-4"
            onClick={addTreatmentLine}
            type="button"
          />
        </>
      )}
      {!showStartTreatBtn && (
        <div className="d-flex gap-4">
          <Button
            label="پایان درمان"
            icon="pi pi-check"
            // onClick={handleSubmitLine}
            loading={loading}
            className="w-100 bg-white text-dark rounded-3"
          />
          <Button
            label="پایان خط درمان"
            icon="pi pi-check"
            onClick={() => setShowModal(true)}
            loading={loading}
            className="w-100 text-white rounded-3"
          />
        </div>
      )}

      <Dialog
        visible={showModal}
        className="w-50"
        onHide={() => setShowModal(false)}
        header="پایان خط درمان"
        footer={
          <div className="d-flex justify-content-end w-100">
            <Button
              label="بستن"
              icon="pi pi-times"
              onClick={() => setShowModal(false)}
              className="p-button-text"
            />
            <Button
              label="تایید"
              icon="pi pi-check"
              onClick={handleSubmitModal}
              loading={loading}
              className="p-button-primary"
            />
          </div>
        }
      >
        {/* Modal content */}
        <div className="d-flex flex-column my-4 w-100">
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
        </div>{" "}
      </Dialog>
    </>
  );
};

export default TreatChemi;
