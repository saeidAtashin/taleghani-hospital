import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Badge } from "primereact/badge";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const TreatChemi = ({
  finaleState,
  treatmentStartDateObj,
  setTreatmentStartDateObj,
  setTreatmentStartDate,
  showStartTreatBtn,
  handleSubmit,
  handleSubmitModal,
  handleSubmitModal2,
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
  description,
  hiddenButtons,
  handleEndSubmit,
  lineUid,
  treatmentUidInGet,
  childState,
  setChildState,
  setRefreshTreatTable,
  refreshTreatTable,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [loadingtar, setLoadingtar] = useState(false);
  const [treatUidForCycle, setTreatUidForCycle] = useState(undefined);
  const [savedCycles, setSavedCycles] = useState([]);

  const [cycleDates, setCycleDates] = useState([]);
  const [cycleDescriptions, setCycleDescriptions] = useState([]);

  const [selectedTreatmentNew, setSelectedTreatmentNew] = useState(null);

  const handleTreatmentStartDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setTreatmentStartDateObj(date);

      setTreatmentStartDate(formattedDate);
      // setStartDate(formattedDate);
    } else {
      setTreatmentStartDateObj(null);
      setTreatmentStartDate("");
    }
  };

  const handleCycleDateChange = (index, date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      const updatedCycleDates = [...cycleDates];
      updatedCycleDates[index] = formattedDate;
      setCycleDates(updatedCycleDates);
    } else {
      const updatedCycleDates = [...cycleDates];
      updatedCycleDates[index] = "";
      setCycleDates(updatedCycleDates);
    }
  };

  const handleCycleDescriptionChange = (index, val) => {
    const updatedCycleDescriptions = [...cycleDescriptions];
    updatedCycleDescriptions[index] = val;
    setCycleDescriptions(updatedCycleDescriptions);
  };

  const addCycle = (treatmentIndex) => {
    setisCycleVisible(true);

    const updatedTreatments = [...allDatas];

    if (!Array.isArray(updatedTreatments[treatmentIndex]?.cycles)) {
      updatedTreatments[treatmentIndex].cycles = [];
    }

    const newCycleNumber = updatedTreatments[treatmentIndex].cycles.length + 1;

    const currentProtocol = updatedTreatments[treatmentIndex]?.protocol;

    updatedTreatments[treatmentIndex].cycles = [
      ...updatedTreatments[treatmentIndex].cycles,
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

  const handleCycleapi = async (cycle, index) => {
    const cycleData = {
      treatment_line_uid: cycle?.uid
        ? cycle?.uid
        : lineUid
        ? lineUid
        : treatUidForCycle
        ? treatUidForCycle
        : uidForCycle,
      date: cycleDates[index] || "",
      description: cycleDescriptions[index] || "",
    };

    try {
      setLoadingtar(true);
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/teatment/cycle/",
        cycleData
      );
      setChildState(!childState);
      toast.success("سیکل ذخیره شد");
      setRefreshTreatTable(!refreshTreatTable);

      setSavedCycles((prevSavedCycles) => [
        ...prevSavedCycles,
        cycle.cycleNumber,
      ]);
    } catch (error) {
      toast.warning("باید سیکل جدید ثبت نمایید");

      // console.error(
      //   "Error in API call for cycle",
      //   cycle.cycleNumber,
      //   ":",
      //   error
      // );
    } finally {
      setLoadingtar(false);
    }
  };

  const removeCycle = (index) => {
    const updatedCycles = cycles.filter((_, i) => i !== index);
    setCycles(updatedCycles);
  };

  const handleSubmitModal3 = async (uid) => {
    await handleSubmitModal2(uid);
    setShowModal(false);
  };

  const addTreatmentLine = () => {
    setAllDatas((prev = []) => [
      ...prev,
      {
        id: prev?.length + 1,
        startDate: "",
        protocol: null,
        description: "",
      },
    ]);
  };

  const handleTreatmentButtonClick = (treatment) => {
    setShowModal(true);
    setSelectedTreatmentNew(treatment);
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
            className="shadow-lg mt-4 mb-3 d-flex flex-column gap-2 "
            multiple
            activeIndex={allDatas
              ?.map((treatment, index) =>
                treatment?.state !== "DONE" ? index : -1
              )
              .filter((index) => index !== -1)}
          >
            {allDatas?.map((treatment, index) => (
              <AccordionTab
                className={` rounded-3 ${
                  treatment?.state === "DONE" ? "header-links-custome" : ""
                }`}
                key={treatment.uid}
                header={
                  <span className="d-flex align-items-center justify-content-between gap-4 w-100">
                    <span className="font-bold white-space-nowrap">
                      خط درمان {index + 1}
                    </span>
                    <Badge
                      value={treatment?.state}
                      className={`mx-4 ${
                        treatment?.state === "DONE" ? "bg-success" : "bg-danger"
                      }`}
                    />
                  </span>
                }
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
                      disabled={treatment?.state !== "DONE" ? false : true}
                    />
                  </div>

                  <div className="">
                    <label className="p-col-12 p-md-2 mt-3" htmlFor="protocol">
                      پروتکل:
                    </label>
                    <div className="p-col-12 p-md-10 mb-4">
                      <Dropdown
                        value={
                          treatment?.protocol
                            ? treatment?.protocol_uid
                            : selectedProtocol
                        }
                        options={protocolOptions}
                        onChange={(e) => {
                          setSelectedProtocol(e.value);
                        }}
                        placeholder="پروتکل را انتخاب نمایید"
                        optionLabel="label"
                        className="w-100"
                        disabled={treatment?.state !== "DONE" ? false : true}
                      />
                    </div>
                    {!treatment?.state && (
                      <Button
                        label="شروع خط درمان"
                        icon="pi pi-check"
                        onClick={() =>
                          handleSubmitLine(
                            treatmentUidInGet
                              ? treatmentUidInGet
                              : treatment.uid
                          )
                        }
                        loading={loading}
                        className="w-100 bg-white text-dark rounded-3 mb-4"
                      />
                    )}
                  </div>

                  <Button
                    label={`\u00A0 ثبت سیکل جدید`}
                    icon="pi pi-plus"
                    className="p-button-text border rounded mb-4"
                    onClick={
                      treatment?.state !== "DONE"
                        ? () => {
                            setTreatUidForCycle(treatment?.uid);
                            addCycle(index);
                          }
                        : console.log("object")
                    }
                    type="button"
                    disabled={treatment?.state !== "DONE" ? false : true}
                  />

                  {treatment?.cycles?.length > 0 && (
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                      className=""
                    >
                      <legend>سیکل ها</legend>
                      <Accordion multiple>
                        {treatment.cycles.map((cycle, cycleIndex) => (
                          <AccordionTab
                            key={cycle.uid}
                            header={`\u00A0 سیکل ${cycleIndex + 1}`}
                            className="bg-dark"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h5>سیکل {cycleIndex + 1}</h5>

                              {!cycle.uid && (
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-rounded p-button-danger"
                                  onClick={() => removeCycle(cycleIndex)}
                                  tooltip="حذف سیکل"
                                />
                              )}
                            </div>

                            <div className="d-flex flex-column my-3">
                              <label
                                className="p-col-12 p-md-2"
                                htmlFor={`cycle_date_${cycleIndex}`}
                              >
                                تاریخ:
                              </label>
                              <DatePicker
                                onChange={(date) =>
                                  handleCycleDateChange(cycleIndex, date)
                                }
                                value={cycleDates[cycleIndex] || ""}
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
                                  value={cycleDescriptions[cycleIndex] || ""}
                                  onChange={(e) =>
                                    handleCycleDescriptionChange(
                                      cycleIndex,
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-100"
                                />
                              </div>
                            </div>

                            {!cycle.uid && (
                              <Button
                                label="ثبت سیکل"
                                icon="pi pi-check"
                                onClick={() =>
                                  handleCycleapi(cycle, cycleIndex)
                                }
                                loading={loading}
                                className="w-100 bg-white text-dark rounded-3"
                              />
                            )}
                          </AccordionTab>
                        ))}
                      </Accordion>
                    </fieldset>
                  )}
                </div>

                {treatment?.state !== "DONE" && (
                  <Button
                    label="پایان خط درمان"
                    icon="pi pi-check"
                    onClick={() => handleTreatmentButtonClick(treatment)}
                    loading={loading}
                    className="w-100 text-white rounded-3 mb-4"
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
        // finaleState !== "DONE" &&
        <div className="d-flex gap-4">
          <Button
            label="پایان درمان"
            icon="pi pi-check"
            onClick={handleEndSubmit}
            loading={loading}
            className="w-100 bg-white text-dark rounded-3 mb-4"
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
              onClick={() => {}}
              className="p-button-text"
            />
            <Button
              label="تایید"
              icon="pi pi-check"
              onClick={() => handleSubmitModal3(selectedTreatmentNew?.uid)}
              loading={loading}
              className="p-button-primary"
            />
          </div>
        }
      >
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
      <Dialog
        visible={showModal2}
        className="w-50"
        onHide={() => setShowModal2(false)}
        header="پایان درمان"
        footer={
          <div className="d-flex justify-content-end w-100">
            <Button
              label="بستن"
              icon="pi pi-times"
              onClick={() => {}}
              className="p-button-text"
            />
            <Button
              label="تایید"
              icon="pi pi-check"
              onClick={() => handleSubmitModal3(selectedTreatmentNew?.uid)}
              loading={loading}
              className="p-button-primary"
            />
          </div>
        }
      >
        <div className="d-flex flex-column my-4 w-100">
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
        </div>{" "}
      </Dialog>
    </>
  );
};

export default TreatChemi;
