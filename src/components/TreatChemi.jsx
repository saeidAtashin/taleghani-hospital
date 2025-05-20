import React, { useState, useEffect } from "react";
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
  handleSubmitLineUpdate,
  handleCloseAll,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [loadingtar, setLoadingtar] = useState(false);
  const [treatUidForCycle, setTreatUidForCycle] = useState(undefined);
  const [savedCycles, setSavedCycles] = useState([]);

  const [cycleDates, setCycleDates] = useState({});
  const [cycleDescriptions, setCycleDescriptions] = useState({});

  const [selectedTreatmentNew, setSelectedTreatmentNew] = useState(null);

  // State for treatment line dates
  const [treatmentLineDates, setTreatmentLineDates] = useState({});
  const [treatmentLineStartDates, setTreatmentLineStartDates] = useState({});
  const [treatmentLineEndDates, setTreatmentLineEndDates] = useState({});

  const [activeCycleIndices, setActiveCycleIndices] = useState({});
  const [canAddCycle, setCanAddCycle] = useState(false);

  // Add new state for cycle submit loading
  const [cycleSubmitLoading, setCycleSubmitLoading] = useState({});

  const [showProtocolDropdown, setShowProtocolDropdown] = useState(false);
  const [selectedProtocolLabel, setSelectedProtocolLabel] = useState("");

  const [isAnyCycleSubmitting, setIsAnyCycleSubmitting] = useState(false);

  useEffect(() => {
    // Check if any treatment line is in progress
    const hasInProgressLine = allDatas?.some(
      (treatment) => treatment.state === "IN_PROGRESS"
    );
    setCanAddCycle(hasInProgressLine);
  }, [allDatas]);

  useEffect(() => {
    // Set initial protocol label when data is loaded
    if (treatment?.protocol) {
      setSelectedProtocolLabel(treatment.protocol);
    }
  }, [treatment]);

  useEffect(() => {
    // Check if any cycle is currently submitting
    const anySubmitting = Object.values(cycleSubmitLoading).some(
      (loading) => loading === true
    );
    setIsAnyCycleSubmitting(anySubmitting);
  }, [cycleSubmitLoading]);

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

  const handleCycleDateChange = (treatmentId, cycleIndex, date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      setCycleDates((prev) => ({
        ...prev,
        [treatmentId]: {
          ...prev[treatmentId],
          [cycleIndex]: {
            display: date,
            value: formattedDate,
          },
        },
      }));
    } else {
      setCycleDates((prev) => {
        const newDates = { ...prev };
        if (newDates[treatmentId]) {
          delete newDates[treatmentId][cycleIndex];
        }
        return newDates;
      });
    }
  };

  const handleCycleDescriptionChange = (treatmentId, cycleIndex, value) => {
    setCycleDescriptions((prev) => ({
      ...prev,
      [treatmentId]: {
        ...prev[treatmentId],
        [cycleIndex]: value,
      },
    }));
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

    // Set the new cycle's accordion to be open
    const treatmentId = updatedTreatments[treatmentIndex].uid;
    setActiveCycleIndices((prev) => ({
      ...prev,
      [treatmentId]: [...(prev[treatmentId] || []), newCycleNumber - 1],
    }));

    setAllDatas(updatedTreatments);
  };

  const handleCycleapi = async (treatmentId, cycle, cycleIndex) => {
    const cycleData = {
      treatment_line_uid: treatmentId,
      date: cycleDates[treatmentId]?.[cycleIndex]?.value || "",
      description: cycleDescriptions[treatmentId]?.[cycleIndex] || "",
    };

    try {
      // Set loading for this specific cycle
      setCycleSubmitLoading((prev) => ({
        ...prev,
        [`${treatmentId}-${cycleIndex}`]: true,
      }));

      const response = await axios.post(
        "https://cancerreg.ir/api/v1/teatment/cycle/",
        cycleData
      );

      setChildState(!childState);
      toast.success("سیکل ذخیره شد");
      setRefreshTreatTable(!refreshTreatTable);

      // Update the cycle data in allDatas
      setAllDatas((prevData) => {
        return prevData.map((treatment) => {
          if (treatment.uid === treatmentId) {
            return {
              ...treatment,
              cycles: treatment.cycles.map((c, idx) =>
                idx === cycleIndex ? { ...c, ...response.data.data } : c
              ),
            };
          }
          return treatment;
        });
      });
    } catch (error) {
      toast.warning("باید سیکل جدید ثبت نمایید");
    } finally {
      // Clear loading state for this cycle
      setCycleSubmitLoading((prev) => ({
        ...prev,
        [`${treatmentId}-${cycleIndex}`]: false,
      }));
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

  // Handle treatment line start date
  const handleTreatmentLineStartDate = (date, treatmentId) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      setTreatmentLineStartDates((prev) => ({
        ...prev,
        [treatmentId]: {
          display: date,
          value: formattedDate,
        },
      }));

      // Update the treatment start date as well
      setTreatmentStartDate(formattedDate);
    } else {
      setTreatmentLineStartDates((prev) => {
        const newDates = { ...prev };
        delete newDates[treatmentId];
        return newDates;
      });
    }
  };

  // Handle treatment line end date
  const handleTreatmentLineEndDate = (date, treatmentId) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      setTreatmentLineEndDates((prev) => ({
        ...prev,
        [treatmentId]: {
          display: date,
          value: formattedDate,
        },
      }));
    } else {
      setTreatmentLineEndDates((prev) => {
        const newDates = { ...prev };
        delete newDates[treatmentId];
        return newDates;
      });
    }
  };

  const hasUnsubmittedCycles = (treatment) => {
    return treatment?.cycles?.some((cycle) => !cycle.uid);
  };

  const hasIncompleteTreatmentLines = () => {
    return allDatas?.some((treatment) => treatment.state !== "DONE");
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
                      value={
                        treatment?.state === "DONE"
                          ? "تکمیل شده"
                          : "در حال انجام"
                      }
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
                        treatmentLineStartDates[treatment.uid]?.display ||
                        (treatment.start_date
                          ? new DateObject({
                              date: treatment.start_date,
                              calendar: "gregorian",
                            })
                              .convert(persian)
                              .format("YYYY/MM/DD")
                          : "")
                      }
                      onChange={(date) =>
                        handleTreatmentLineStartDate(date, treatment.uid)
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      placeholder="تاریخ را انتخاب کنید"
                      className="p-2 border rounded"
                      inputClass="w-full p-2 text-end w-100 border rounded"
                      position="bottom-right"
                      disabled={treatment?.state === "DONE"}
                    />
                  </div>

                  <div className="">
                    <label className="p-col-12 p-md-2 mt-3" htmlFor="protocol">
                      پروتکل:
                    </label>
                    <div className="p-col-12 p-md-10 mb-4">
                      {!showProtocolDropdown ? (
                        <div
                          className="p-2 border rounded cursor-pointer"
                          onClick={() => setShowProtocolDropdown(true)}
                        >
                          {selectedProtocolLabel || "انتخاب پروتکل"}
                        </div>
                      ) : (
                        <Dropdown
                          value={
                            treatment?.protocol
                              ? treatment?.protocol_uid
                              : selectedProtocol
                          }
                          options={protocolOptions}
                          onChange={(e) => {
                            setSelectedProtocol(e.value);
                            const selectedOption = protocolOptions.find(
                              (opt) => opt.value === e.value
                            );
                            setSelectedProtocolLabel(
                              selectedOption?.label || ""
                            );
                            setShowProtocolDropdown(false);
                          }}
                          placeholder="پروتکل را انتخاب نمایید"
                          optionLabel="label"
                          className="w-100"
                          disabled={treatment?.state !== "DONE" ? false : true}
                          autoFocus
                        />
                      )}
                    </div>
                    {treatment?.state !== "DONE" &&
                      !hiddenButtons.includes(treatment.uid) &&
                      !treatment?.protocol &&
                      !treatment?.protocol_uid && (
                        <Button
                          label="شروع خط درمان"
                          icon="pi pi-check"
                          onClick={
                            treatment?.state !== "IN_PROGRESS"
                              ? () =>
                                  handleSubmitLine(
                                    treatmentUidInGet
                                      ? treatmentUidInGet
                                      : treatment.uid
                                  )
                              : () => handleSubmitLineUpdate(treatment.uid)
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
                    onClick={() => {
                      setTreatUidForCycle(treatment?.uid);
                      addCycle(index);
                    }}
                    type="button"
                    disabled={
                      !canAddCycle ||
                      treatment?.state === "DONE" ||
                      hasUnsubmittedCycles(treatment)
                    }
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
                      <Accordion
                        multiple
                        activeIndex={activeCycleIndices[treatment.uid] || []}
                        onTabChange={(e) => {
                          setActiveCycleIndices((prev) => ({
                            ...prev,
                            [treatment.uid]: e.index,
                          }));
                        }}
                      >
                        {treatment.cycles.map((cycle, cycleIndex) => (
                          <AccordionTab
                            key={cycle.uid || cycleIndex}
                            header={`\u00A0 سیکل ${cycleIndex + 1}`}
                            className="bg-dark"
                          >
                            <div className="d-flex flex-column my-3">
                              <label className="p-col-12 p-md-2">تاریخ:</label>
                              <DatePicker
                                value={
                                  cycleDates[treatment.uid]?.[cycleIndex]
                                    ?.display ||
                                  (cycle.date
                                    ? new DateObject({
                                        date: cycle.date,
                                        calendar: "gregorian",
                                      })
                                        .convert(persian)
                                        .format("YYYY/MM/DD")
                                    : "")
                                }
                                onChange={(date) =>
                                  handleCycleDateChange(
                                    treatment.uid,
                                    cycleIndex,
                                    date
                                  )
                                }
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY/MM/DD"
                                placeholder="تاریخ را انتخاب کنید"
                                className="p-2 border rounded"
                                inputClass="w-full p-2 text-end w-100 border rounded"
                                position="bottom-right"
                                disabled={!!cycle.uid}
                              />
                            </div>

                            <div className="p-field p-grid">
                              <label className="p-col-12 p-md-2">
                                توضیحات:
                              </label>
                              <div className="p-col-12 p-md-10">
                                <InputTextarea
                                  value={
                                    cycleDescriptions[treatment.uid]?.[
                                      cycleIndex
                                    ] ||
                                    cycle.description ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleCycleDescriptionChange(
                                      treatment.uid,
                                      cycleIndex,
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-100"
                                  disabled={!!cycle.uid}
                                />
                              </div>
                            </div>

                            {!cycle.uid && (
                              <Button
                                label="ثبت سیکل"
                                icon="pi pi-check"
                                onClick={() =>
                                  handleCycleapi(
                                    treatment.uid,
                                    cycle,
                                    cycleIndex
                                  )
                                }
                                loading={
                                  cycleSubmitLoading[
                                    `${treatment.uid}-${cycleIndex}`
                                  ]
                                }
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

          {
            <Button
              label={`\u00A0 افزودن خط درمان`}
              icon="pi pi-plus"
              className="p-button-text border rounded mb-4"
              onClick={addTreatmentLine}
              type="button"
              disabled={hasIncompleteTreatmentLines()}
            />
          }
        </>
      )}
      {!showStartTreatBtn && finaleState !== "DONE" && (
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
