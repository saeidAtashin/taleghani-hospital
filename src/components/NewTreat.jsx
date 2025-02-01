import React, { useState, useEffect, useRef, useMemo } from "react";
import { CascadeSelect } from "primereact/cascadeselect";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TreatChemi from "./TreatChemi";
import { Dialog } from "primereact/dialog";

const NewTreat = ({
  responseUid,
  setResponseUid,
  treatmentValue,
  setTreatmentValue,
  selectedProtocol,
  setSelectedProtocol,
  selectedTreatment,
  setSelectedTreatment,
  startDateObj,
  setStartDateObj,
  treatmentStartDateObj,
  setTreatmentStartDateObj,
  treatmentStartDate,
  setTreatmentStartDate,
  startDate,
  setStartDate,
  description,
  setDescription,
  cycles,
  setCycles,
  uid,
  setnewTreat,
  newTreat,
  setRefreshTreatTable,
  refreshTreatTable,
  protocolOptions,
  setProtocolOptions,
  endDateObj,
  setEndDateObj,
  endDate,
  setEndDate,
  handleTabChange,
  allDatas,
  isTreatmentForm,
  setIsTreatmentForm,
  showLine,
  showStartTreatBtn,
  setShowStartTreatBtn,
  showedPart,
  setShowedPart,
  setAllDatas,
  setshowLine,
  treatmentUidInGet,
  childState,
  setChildState,
  finaleState,
}) => {
  const [isCycleVisible, setisCycleVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mainSelection, setMainSelection] = useState(null);
  const [subSelection, setSubSelection] = useState(null);
  const [uidForCycle, setuidForCycle] = useState(null);
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [treatment, setTreatment] = useState([]);
  const [hiddenButtons, setHiddenButtons] = useState([]);
  const [lineUid, setlineUid] = useState(undefined);

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
    setAllDatas(undefined);
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
        : undefined;
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
        setLoading(false);
        setChildState(!childState);
        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });

        setResponseUid(response?.data?.data?.uid);
        setuidForCycle(response?.data?.data?.first_treatment_line_uid);
        setShowStartTreatBtn(false);

        setRefreshTreatTable(!refreshTreatTable);
        if (isTreatmentForm) {
          setnewTreat(false);
          resetFormFields();
        }

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

  const handleEndSubmit = async () => {
    setLoading(true);
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    const payload = {
      treatment_uid: allDatas?.uid,

      end_date: endDate ? endDate : undefined,
      description: description ? description : undefined,
      evaluation_uid: selectedTreatment,
    };
    if (!isTreatmentForm) {
      payload.treatment_uid = allDatas?.uid;
      payload.evaluation_uid = selectedTreatment
        ? selectedTreatment
        : undefined;
    }

    try {
      const response = await axios.put(
        `https://cancerreg.ir/api/v1/teatment/end-treatment/${
          treatmentUidInGet
            ? treatmentUidInGet
            : lineUid
            ? lineUid
            : // : uid
            // ? uid
            allDatas?.uid
            ? allDatas?.uid
            : responseUid
        }/`,
        payload
      );
      if (response?.status >= 200 && response?.status < 400) {
        setLoading(false);
        resetFormFields();
        setnewTreat(false);

        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });
        setResponseUid(response?.data?.data?.uid);
        setuidForCycle(response?.data?.data?.first_treatment_line_uid);
        setShowStartTreatBtn(false);
        setRefreshTreatTable(!refreshTreatTable);
        setChildState(!childState);

        if (isTreatmentForm) {
          setnewTreat(false);
          resetFormFields();
        }
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

  const handleSubmitModal2 = async (uid) => {
    const payload = {
      treatment_uid: uid ? uid : allDatas?.uid ? allDatas?.uid : responseUid,

      end_date: endDate ? endDate : undefined,
      description: description ? description : undefined,
      evaluation_uid: selectedTreatment,
    };
    if (!isTreatmentForm) {
      payload.treatment_uid = uid
        ? uid
        : allDatas?.uid
        ? allDatas?.uid
        : responseUid;
      payload.evaluation_uid = selectedTreatment
        ? selectedTreatment
        : undefined;
    }

    try {
      const response = await axios.put(
        `https://cancerreg.ir/api/v1/teatment/end-treatment-line/${
          uid
            ? uid
            : lineUid
            ? lineUid
            : // : uid
            // ? uid
            allDatas?.uid
            ? allDatas?.uid
            : responseUid
        }/`,
        payload
      );
      if (response?.status >= 200 && response?.status < 400) {
        setChildState(!childState);
        setnewTreat(false);
        resetFormFields();

        setLoading(false);
        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });
        setResponseUid(response?.data?.data?.uid);
        setuidForCycle(response?.data?.data?.first_treatment_line_uid);
        setShowStartTreatBtn(false);
        setRefreshTreatTable(!refreshTreatTable);
        if (isTreatmentForm) {
          setnewTreat(false);
          resetFormFields();
        }
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
      treatmentValue === "HORMONETHERAPY" ||
      mainSelection === "HORMONETHERAPY" ||
      mainSelection === "CHEMOTHERAPY" ||
      treatmentValue === "CHEMOTHERAPY";
    setIsTreatmentForm(!isForm);
    if (showLine) {
      setIsTreatmentForm(false);
    }
  }, [treatmentValue, mainSelection, subSelection]);

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
    axios
      .get("https://cancerreg.ir/api/v1/common/treatment-evaluation/")
      .then((response) => {
        const results = response.data?.data?.results || [];
        const formatted = results.map((item) => ({
          label: item.name,
          value: item.uid,
        }));

        setTreatment(formatted);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [newTreat, selectedTreatment]);

  const handleSubmitLine = async (treatmentUid) => {
    const payload = {
      treatment_uid: treatmentUidInGet
        ? treatmentUidInGet
        : treatmentUid
        ? treatmentUid
        : allDatas?.uid
        ? allDatas?.uid
        : responseUid,
      start_date: treatmentStartDate ? treatmentStartDate : startDate,
      end_date: endDate ? endDate : undefined,
      description: description ? description : undefined,
      protocol_uid: selectedProtocol,
    };

    if (!isTreatmentForm) {
      payload.treatment_uid = treatmentUidInGet
        ? treatmentUidInGet
        : treatmentUid
        ? treatmentUid
        : allDatas?.uid
        ? allDatas?.uid
        : responseUid;
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
        setHiddenButtons((prev) => [...prev, treatmentUid]);
        setChildState(!childState);

        setlineUid(response?.data?.data?.uid);
        toast.current.show({
          severity: "success",
          summary: "موفق",
          detail: "ذخیره شد",
        });
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

  return (
    <>
      <Toast ref={toast} />

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
              setShowStartTreatBtn(true);

              resetFormFields();
              setTreatmentValue(e.value);

              const isForm =
                mainSelection === "HORMONETHERAPY" ||
                mainSelection === "CHEMOTHERAPY";
              setIsTreatmentForm(isForm ? true : false);
              setShowStartTreatBtn(true);
              setShowedPart(isForm ? "showCycle" : "");
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
                  تاریخ شروع درمان:
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
                    placeholder="توضیحات مرتبط با درمان را وارد نمایید."
                  />
                </div>
              </div>

              <div className="d-flex gap-4 ">
                {allDatas?.state !== "DONE" && (
                  <Button
                    label="تایید و ثبت نتایج"
                    icon="pi pi-check"
                    onClick={handleSubmit}
                    // loading={loading}
                    className="w-100 rounded p-button-outlined"
                  />
                )}

                {finaleState !== "DONE" && (
                  <Button
                    label="پایان درمان"
                    icon="pi pi-check"
                    onClick={handleEndSubmit}
                    // loading={loading}
                    className="w-100 rounded"
                  />
                )}
              </div>
            </>
          ) : (
            <TreatChemi
              finaleState={finaleState}
              setChildState={setChildState}
              childState={childState}
              treatmentUidInGet={treatmentUidInGet}
              lineUid={lineUid}
              handleSubmitModal2={handleSubmitModal2}
              hiddenButtons={hiddenButtons}
              description={description}
              setDescription={setDescription}
              allDatas={allDatas}
              setAllDatas={setAllDatas}
              setTreatmentStartDateObj={setTreatmentStartDateObj}
              treatmentStartDateObj={treatmentStartDateObj}
              setTreatmentStartDate={setTreatmentStartDate}
              showStartTreatBtn={showStartTreatBtn}
              loading={loading}
              showedPart={showedPart}
              activeIndex={activeIndex}
              handleTabChange={handleTabChange}
              startDateObj={startDateObj}
              handleStartDateChange={handleStartDateChange}
              selectedProtocol={selectedProtocol}
              protocolOptions={protocolOptions}
              setSelectedProtocol={setSelectedProtocol}
              setCycles={setCycles}
              isCycleVisible={isCycleVisible}
              setisCycleVisible={setisCycleVisible}
              handleSubmit={handleSubmit}
              selectedTreatment={selectedTreatment}
              treatment={treatment}
              endDateObj={endDateObj}
              handleEndDateChange={handleEndDateChange}
              setSelectedTreatment={setSelectedTreatment}
              cycles={cycles}
              handleSubmitLine={handleSubmitLine}
              uidForCycle={uidForCycle}
              setStartDate={setStartDate}
              setShowStartTreatBtn={setShowStartTreatBtn}
              handleEndSubmit={handleEndSubmit}
            />
          )}
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
              // loading={loading}
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

export default NewTreat;
