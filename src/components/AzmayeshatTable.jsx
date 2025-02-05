import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import PillsTabs from "./PillsTabs";
import { useParams } from "react-router-dom";
import axios from "axios";
import RegisterTests from "./RegisterTests";

export default function AzmayeshatTable() {
  const [groupedData, setGroupedData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [showAzmayeshPAge, setShowAzmayeshPAge] = useState("home");
  const dt = useRef(null);
  const { uid } = useParams();

  const numberTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>;
  };

  const persianDateTemplate = (rowData) => {
    return (
      <span>
        {moment(rowData.date, "YYYY-MM-DD")
          .locale("fa")
          .format("jYYYY/jMM/jDD")}
      </span>
    );
  };

  const namesTemplate = (rowData) => {
    return (
      <div>
        {rowData.names.map((nameItem, index) => (
          <span
            key={index}
            onClick={() => {}}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: nameItem.type === "info" ? "#FF7518" : "green",
              marginRight: "8px",
              display: "inline-block",
              marginBottom: "4px",
            }}
          >
            {nameItem.value}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/batch-test/${uid}/`
        );
        const { results } = response.data;

        const mappedData = results.map((item) => ({
          id: item.uid,
          name: item.tests.map((test) => ({
            value: test.category,
            type: test.state === "IN_PROGRESS" ? "info" : "secondary",
            id: test.id,
          })),
          date: item.created_at ? item.created_at.slice(0, 10) : null,
        }));

        const grouped = mappedData.reduce((acc, current) => {
          const date = current.date;
          if (!acc[date]) {
            acc[date] = {
              date: date,
              names: [],
            };
          }
          acc[date].names = acc[date].names.concat(current.name);
          return acc;
        }, {});

        const groupedArray = Object.values(grouped).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setGroupedData(groupedArray);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [showAzmayeshPAge, uid]);

  const handlePrint = () => {};

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-start">
      <Button
        label="ثبت نتیجه آزمایش"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => setShowAzmayeshPAge("orderRegister")}
        className="rounded-3 "
      />
      <Button
        label="ثبت دستور آزمایش"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => setShowAzmayeshPAge("orderRegisterOrder")}
        className="rounded-3 "
      />
    </div>
  );

  const handleDelete = () => {
    setSelectedGroups([]);
  };

  return (
    <>
      {showAzmayeshPAge === "home" ? (
        <div className="card" style={{ direction: "rtl" }}>
          <DataTable
            dir="rtl"
            ref={dt}
            value={groupedData}
            selection={selectedGroups}
            onSelectionChange={(e) => setSelectedGroups(e.value)}
            dataKey="date"
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
              headerStyle={{ width: "3em", borderBottom: "2px solid black" }}
            ></Column>
            <Column
              sortable
              field="number"
              header="ردیف"
              body={numberTemplate}
              style={{ textAlign: "right", direction: "rtl" }}
              headerStyle={{ borderBottom: "2px solid black" }}
            />
            <Column
              sortable
              field="names"
              header="آزمایش‌ها"
              body={namesTemplate}
              style={{ textAlign: "right", direction: "rtl" }}
              headerStyle={{ borderBottom: "2px solid black" }}
            />
            <Column
              sortable
              field="persianDate"
              header="تاریخ انجام"
              body={persianDateTemplate}
              style={{ textAlign: "right", direction: "rtl" }}
              headerStyle={{ borderBottom: "2px solid black" }}
            />
            <Column
              sortable
              field="persianDate"
              header="تاریخ ثبت"
              body={persianDateTemplate}
              style={{ textAlign: "right", direction: "rtl" }}
              headerStyle={{ borderBottom: "2px solid black" }}
            />

            <Column
              header="عملیات"
              headerStyle={{ borderBottom: "2px solid black" }}
              body={(rowData) => (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => console.log("rowData", rowData)}
                >
                  مشاهده
                </button>
              )}
            />
          </DataTable>

          {selectedGroups.length > 0 && (
            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button
                label="چاپ"
                icon="pi pi-print"
                onClick={handlePrint}
                className="p-button-success"
              />
              <Button
                label="حذف"
                icon="pi pi-trash"
                onClick={handleDelete}
                className="p-button-danger"
              />
            </div>
          )}
        </div>
      ) : showAzmayeshPAge === "orderRegister" ? (
        <>
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-2 pb-3">ثبت نتیجه آزمایش</h2>
              <span
                className="text-danger cursor-pointer"
                style={{ fontSize: "32px" }}
                onClick={() => {
                  setShowAzmayeshPAge("home");
                }}
              >
                x
              </span>
            </div>
            <PillsTabs setShowAzmayeshPAge={setShowAzmayeshPAge} />
          </div>
        </>
      ) : (
        showAzmayeshPAge === "orderRegisterOrder" && (
          <>
            <div className="container mt-5">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-2 pb-3">ثبت دستور آزمایش</h2>
                <span
                  className="text-danger cursor-pointer"
                  style={{ fontSize: "32px" }}
                  onClick={() => {
                    setShowAzmayeshPAge("home");
                  }}
                >
                  x
                </span>
              </div>
              <RegisterTests
                showAzmayeshPAge={showAzmayeshPAge}
                setShowAzmayeshPAge={setShowAzmayeshPAge}
              />
            </div>
          </>
        )
      )}
    </>
  );
}
