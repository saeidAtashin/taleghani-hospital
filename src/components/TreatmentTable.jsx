import React, { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "jalali-moment";
import NewTreat from "./NewTreat";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";

const TreatmentTable = ({ rowDataTransfer, setrowDataTransfer }) => {
  const [treatmentValue, setTreatmentValue] = useState(null);
  const [protocolOptions, setProtocolOptions] = useState([]);
  const [description, setDescription] = useState("");
  const [newTreat, setnewTreat] = useState(false);
  const [startDateObj, setStartDateObj] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [treatmentStartDateObj, setTreatmentStartDateObj] = useState(null);
  const [treatmentStartDate, setTreatmentStartDate] = useState("");
  const [responseUid, setResponseUid] = useState(undefined);
  const [refreshTreatTable, setRefreshTreatTable] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(undefined);
  const [selectedTreatment, setSelectedTreatment] = useState(undefined);
  const [treatmentUidInGet, setTreatmentUidInGet] = useState(undefined);
  const [rowData, setRowData] = useState(null);
  const [childState, setChildState] = useState(null);

  const { uid } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [endDateObj, setEndDateObj] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [allDatas, setAllDatas] = useState(undefined);
  const [finaleState, setFinaleState] = useState(undefined);
  const [isTreatmentForm, setIsTreatmentForm] = useState(false);
  const [showStartTreatBtn, setShowStartTreatBtn] = useState(true);
  const [showedPart, setShowedPart] = useState("");
  const [dontCallForNow, setdontCallForNow] = useState(false);
  const [makeitof, setmakeitof] = useState(false);

  const [showLine, setshowLine] = useState(false);

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [treatmentOptions, setTreatmentOptions] = useState([]);

  const handleTabChange = (index) => {
    setSelectedProtocol(undefined);
    setSelectedTreatment(undefined);
    setStartDateObj(null);
    setEndDateObj(null);
    setDescription("");
    setCycles([]);
  };

  const stateTranslations = {
    IN_PROGRESS: "در حال انجام",
    DONE: "تکمیل شده",
    PENDING: "در انتظار",
  };

  const stateClasses = {
    IN_PROGRESS: "state-in_progress",
    DONE: "state-completed",
    PENDING: "state-pending",
  };

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
        // console.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://cancerreg.ir/api/v1/common/treatment-evaluation/")
      .then((response) => {
        const results = response.data?.data?.results || [];
        const formatted = results.map((item) => ({
          label: item.name,
          value: item.uid,
        }));
        setTreatmentOptions(formatted);
      })
      .catch((err) => {
        console.error("Error fetching treatment evaluations:", err);
      });
  }, []);

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
        // console.error("Error fetching data:", error);
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
    const isChemoOrHormone =
      rowData?.category === "HORMONETHERAPY" ||
      rowData?.category === "CHEMOTHERAPY";

    if (!isChemoOrHormone) {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/teatment/treatment/${rowData?.uid}/`
        );

        if (response.status >= 200 && response.status < 400) {
          const treatmentData = response.data.data;

          // Convert dates to Persian format
          const startDateJalali = treatmentData.start_date
            ? new DateObject({
                date: treatmentData.start_date,
                calendar: "gregorian",
              })
                .convert(persian)
                .format("YYYY/MM/DD")
            : "";

          const endDateJalali = treatmentData.end_date
            ? new DateObject({
                date: treatmentData.end_date,
                calendar: "gregorian",
              })
                .convert(persian)
                .format("YYYY/MM/DD")
            : "";

          setStartDateObj(startDateJalali);
          setEndDateObj(endDateJalali);
          setDescription(treatmentData.description || "");
          setSelectedTreatment({
            value: treatmentData.evaluation_uid,
            label: treatmentData.evaluation,
          });

          setSelectedRowData(treatmentData);
          setShowViewDialog(true);
        }
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات درمان");
      }
      return;
    }

    // Existing logic for CHEMOTHERAPY or HORMONETHERAPY
    setIsTreatmentForm(!isTreatmentForm);
    setshowLine(isChemoOrHormone);
    if (isChemoOrHormone) {
      setIsTreatmentForm(!isTreatmentForm);
      await tryyyy(rowData);
    }
    await newTryyy(rowData);
  };

  useEffect(() => {
    if (rowDataTransfer?.uid && products.length > 0) {
      const matchingRow = products.find(
        (item) => item.uid === rowDataTransfer?.uid
      );

      if (matchingRow) {
        // Only proceed with CHEMO or HORMONE treatments automatically
        const isChemoOrHormone =
          matchingRow?.category === "HORMONETHERAPY" ||
          matchingRow?.category === "CHEMOTHERAPY";

        if (isChemoOrHormone) {
          handleRowClick(matchingRow);
        }
      }
    }
  }, [rowDataTransfer, products]);

  const tryyyy = async (rowData) => {
    const getTreatmentLine = `https://cancerreg.ir/api/v1/teatment/treatment-line/${rowData?.uid}/`;
    try {
      const response = await fetch(getTreatmentLine);
      const data = await response.json();
      setAllDatas(data?.results);
      setmakeitof(true);
      setTreatmentUidInGet(rowData?.uid);
      setRowData(rowData);
    } catch (error) {
      // console.error("Error fetching treatment data:", error);
    }
  };

  const newTryyy = async (rowData) => {
    const isForm =
      rowData?.category === "HORMONETHERAPY" ||
      rowData?.category === "CHEMOTHERAPY";
    const getTreatment = `https://cancerreg.ir/api/v1/teatment/treatment/${rowData?.uid}/`;
    try {
      const response = await fetch(getTreatment);
      const data = await response.json();
      !isForm && setAllDatas(data?.data);

      setFinaleState(data?.data?.state);
      setShowStartTreatBtn(false);
      setShowedPart("showCycle");
      const treatmentData = data?.data;
      setTreatmentValue(
        rowData?.sub_category ? rowData?.sub_category : rowData?.category || ""
      );

      const startDateGregorian = treatmentData.start_date || "";
      const endDateGregorian = treatmentData.end_date || "";
      const startDateJalali = startDateGregorian
        ? new DateObject({
            date: startDateGregorian,
            calendar: "gregorian",
          })
            .convert(persian)
            .format("YYYY/MM/DD")
        : "";

      const endDateJalali = endDateGregorian
        ? new DateObject({
            date: endDateGregorian,
            calendar: "gregorian",
          })
            .convert(persian)
            .format("YYYY/MM/DD")
        : "";
      setStartDateObj(startDateJalali);
      setTreatmentStartDateObj(startDateJalali);

      setEndDateObj(endDateJalali);
      setSelectedTreatment({
        value: treatmentData?.evaluation_uid,
        label: treatmentData?.evaluation,
      });

      setSelectedProtocol({
        value: treatmentData.protocol_uid,
        label: treatmentData.protocol,
      });

      setDescription(treatmentData.description || "");
      setnewTreat(true);
    } catch (error) {
      // console.error("Error fetching treatment data:", error);
    }
  };

  useEffect(() => {
    if (rowData && !dontCallForNow) {
      tryyyy(rowData);
      newTryyy(rowData);
    }
  }, [rowData, childState, refreshTreatTable]);

  const handleEndTreatment = async () => {
    try {
      const payload = {
        treatment_uid: selectedRowData?.uid,
        end_date: endDate,
        description: description,
        evaluation_uid: selectedTreatment?.value
      };

      const response = await axios.put(
        `https://cancerreg.ir/api/v1/teatment/end-treatment/${selectedRowData?.uid}/`,
        payload
      );

      if (response.status >= 200 && response.status < 400) {
        toast.success("درمان با موفقیت به پایان رسید");
        setShowViewDialog(false);
        setRefreshTreatTable(!refreshTreatTable);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.errors?.[0]?.message || 
        "خطا در به‌روزرسانی نتیجه درمان"
      );
    }
  };

  return (
    <>
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
                onClick={() => handleRowClick(rowData)}
              >
                مشاهده
              </button>
            )}
          />
        </DataTable>
      )}

      <Dialog
        visible={showViewDialog}
        className="w-50"
        onHide={() => setShowViewDialog(false)}
        header="جزئیات درمان"
      >
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column">
            <label className="text-muted d-block mb-2">تاریخ شروع درمان:</label>
            <DatePicker
              value={startDateObj}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              className="p-2 border rounded w-100"
              inputClass="w-100 p-2 text-end border rounded"
              position="bottom-right"
              disabled
            />
          </div>

          <div className="d-flex flex-column">
            <label className="text-muted d-block mb-2">
              تاریخ پایان درمان:
            </label>
            <DatePicker
              value={endDateObj}
              onChange={(date) => {
                if (date) {
                  const gregorianDate = date.convert("gregorian").toDate();
                  const formattedDate = gregorianDate.toISOString().split("T")[0];
                  setEndDateObj(date);
                  setEndDate(formattedDate);
                } else {
                  setEndDateObj(null);
                  setEndDate("");
                }
              }}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              className="p-2 border rounded w-100"
              inputClass="w-100 p-2 text-end border rounded"
              position="bottom-right"
              disabled={selectedRowData?.state === "DONE"}
            />
          </div>

          <div className="d-flex flex-column">
            <label className="text-muted d-block mb-2">ارزیابی درمان:</label>
            {selectedRowData?.state === "DONE" ? (
              <input
                type="text"
                value={selectedRowData?.evaluation || ""}
                className="w-100 p-2 border rounded"
                disabled
              />
            ) : (
              <Dropdown
                value={selectedTreatment}
                options={treatmentOptions}
                onChange={(e) => setSelectedTreatment(e.value)}
                optionLabel="label"
                placeholder="ارزیابی را انتخاب کنید"
                className="w-100"
              />
            )}
          </div>

          <div className="d-flex flex-column">
            <label className="text-muted d-block mb-2">توضیحات:</label>
            <InputTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-100"
              disabled={selectedRowData?.state === "DONE"}
            />
          </div>

          {selectedRowData?.state !== "DONE" && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                label="پایان درمان"
                icon="pi pi-check"
                onClick={handleEndTreatment}
                className="p-button-primary"
              />
            </div>
          )}
        </div>
      </Dialog>

      {newTreat && (
        <NewTreat
          setTreatmentUidInGet={setTreatmentUidInGet}
          setrowDataTransfer={setrowDataTransfer}
          makeitof={makeitof}
          setmakeitof={setmakeitof}
          dontCallForNow={dontCallForNow}
          setdontCallForNow={setdontCallForNow}
          finaleState={finaleState}
          childState={childState}
          setChildState={setChildState}
          treatmentUidInGet={treatmentUidInGet}
          setAllDatas={setAllDatas}
          showedPart={showedPart}
          setShowedPart={setShowedPart}
          showStartTreatBtn={showStartTreatBtn}
          setShowStartTreatBtn={setShowStartTreatBtn}
          showLine={showLine}
          isTreatmentForm={isTreatmentForm}
          setIsTreatmentForm={setIsTreatmentForm}
          responseUid={responseUid}
          setResponseUid={setResponseUid}
          treatmentValue={treatmentValue}
          setTreatmentValue={setTreatmentValue}
          selectedProtocol={selectedProtocol}
          setSelectedProtocol={setSelectedProtocol}
          selectedTreatment={selectedTreatment}
          setSelectedTreatment={setSelectedTreatment}
          startDateObj={startDateObj}
          setStartDateObj={setStartDateObj}
          treatmentStartDateObj={treatmentStartDateObj}
          setTreatmentStartDateObj={setTreatmentStartDateObj}
          treatmentStartDate={treatmentStartDate}
          setTreatmentStartDate={setTreatmentStartDate}
          startDate={startDate}
          setStartDate={setStartDate}
          description={description}
          setDescription={setDescription}
          cycles={cycles}
          setCycles={setCycles}
          uid={uid}
          setnewTreat={setnewTreat}
          newTreat={newTreat}
          setRefreshTreatTable={setRefreshTreatTable}
          refreshTreatTable={refreshTreatTable}
          protocolOptions={protocolOptions}
          setProtocolOptions={setProtocolOptions}
          endDate={endDate}
          setEndDate={setEndDate}
          endDateObj={endDateObj}
          setEndDateObj={setEndDateObj}
          handleTabChange={handleTabChange}
          allDatas={allDatas}
          setshowLine={setshowLine}
        />
      )}
    </>
  );
};

export default TreatmentTable;
