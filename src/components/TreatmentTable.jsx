import React, { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "jalali-moment";
import NewTreat from "./NewTreat";

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

  const handleTabChange = (index) => {
    console.log("index", index?.index);
    setSelectedProtocol(undefined);
    setSelectedTreatment(undefined);
    setStartDateObj(null);
    setEndDateObj(null);
    setDescription("");
    setCycles([]);
  };

  // const [items, setItems] = useState([
  //   {
  //     label: "ثبت خط درمان جدید",
  //     command: () => addNewTreatment(),
  //   },
  //   {
  //     label: "خط درمان 1",
  //     command: () => null,
  //   },
  // ]);

  // const addNewTreatment = () => {
  //   setItems((prevItems) => {
  //     const newItem = {
  //       label: `خط درمان ${prevItems.length}`,
  //       command: () => handleTabChange(prevItems.length),
  //     };
  //     return [...prevItems, newItem];
  //   });

  //   handleTabChange(items.length);
  // };

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
    console.log("isTreatmentForm", isTreatmentForm);
    const uid = rowData.uid;
    const getTreatment = `https://cancerreg.ir/api/v1/teatment/treatment/${uid}/`;
    const getTreatmentLine = `https://cancerreg.ir/api/v1/teatment/treatment-line/${uid}/`;

    if (!isTreatmentForm) {
      try {
        const response = await fetch(getTreatmentLine);
        const data = await response.json();
        setAllDatas(data?.results);
        console.log("holy data?.results", data?.results);
      } catch (error) {
        console.error("Error fetching treatment data:", error);
      }
    }
    try {
      const response = await fetch(getTreatment);
      const data = await response.json();
      console.log("data injaaaaaaa", data?.data);

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
    } catch (error) {
      console.error("Error fetching treatment data:", error);
    }
  };

  const handleRowClick2 = async (rowData) => {
    const uid = rowData.uid;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setAllDatas(data?.results);
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
          // items={items}
          // setItems={setItems}
          protocolOptions={protocolOptions}
          setProtocolOptions={setProtocolOptions}
          endDate={endDate}
          setEndDate={setEndDate}
          endDateObj={endDateObj}
          setEndDateObj={setEndDateObj}
          handleTabChange={handleTabChange}
          allDatas={allDatas}
        />
      )}
    </>
  );
};

export default TreatmentTable;
