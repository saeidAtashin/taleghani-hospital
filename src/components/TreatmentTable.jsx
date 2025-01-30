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
// import persian_fa from "react-date-object/locales/persian_fa";

const TreatmentTable = () => {
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
  const { uid } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [endDateObj, setEndDateObj] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [allDatas, setAllDatas] = useState(undefined);
  const [isTreatmentForm, setIsTreatmentForm] = useState(false);
  const [showStartTreatBtn, setShowStartTreatBtn] = useState(true);
  const [showedPart, setShowedPart] = useState("");

  const [showLine, setshowLine] = useState(false);

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
    const getTreatment = `https://cancerreg.ir/api/v1/teatment/treatment/${uid}/`;
    const getTreatmentLine = `https://cancerreg.ir/api/v1/teatment/treatment-line/${uid}/`;
    setIsTreatmentForm(!isTreatmentForm);
    const isForm =
      rowData?.category === "HORMONETHERAPY" ||
      rowData?.category === "CHEMOTHERAPY";
    setIsTreatmentForm(!isForm);
    setshowLine(isForm);
    if (isForm) {
      // setIsTreatmentForm(!isTreatmentForm);
      try {
        const response = await fetch(getTreatmentLine);
        const data = await response.json();
        setAllDatas(data?.results);
        // setCycles()
      } catch (error) {
        console.error("Error fetching treatment data:", error);
      }
    }
    try {
      const response = await fetch(getTreatment);
      const data = await response.json();
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
      // setSelectedTreatment(treatmentData.evaluation_uid);
      setSelectedTreatment({
        value: treatmentData.evaluation_uid,
        label: treatmentData.evaluation,
      });

      // setSelectedProtocol(
      //   protocolOptions.find((item) => item.value === treatmentData.protocol) ||
      //     null
      // );

      setSelectedProtocol({
        value: treatmentData.protocol_uid,
        label: treatmentData.protocol,
      });

      setDescription(treatmentData.description || "");
      setnewTreat(true);
    } catch (error) {
      console.error("Error fetching treatment data:", error);
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
        <NewTreat
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
