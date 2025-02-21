import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import PillsTabs from "./PillsTabs";
import { useParams } from "react-router-dom";
import axios from "axios";
import RegisterTests from "./RegisterTests";
import { Dialog } from "primereact/dialog";

export default function AzmayeshatTable({
  diseaseType,
  rowDataTransfer,
  setrowDataTransfer,
  activeTabForce,
}) {
  const [groupedData, setGroupedData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [showAzmayeshPAge, setShowAzmayeshPAge] = useState("home");
  const dt = useRef(null);
  const { uid } = useParams();
  const [categoryDetails, setCategoryDetails] = useState({});
  const [viewTestData, setViewTestData] = useState(null);

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
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: nameItem.type === "info" ? "#FF7518" : "green",
              marginRight: "8px",
              display: "inline-block",
              marginBottom: "4px",
            }}
          >
            {categoryDetails[nameItem.id] || nameItem.value}
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
            uid: test.uid,
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

  useEffect(() => {
    if (rowDataTransfer && activeTabForce === "آزمایشات") {
      setShowAzmayeshPAge("viewTest");
      setViewTestData(rowDataTransfer);
      setrowDataTransfer(null);
    }
  }, [rowDataTransfer]);

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

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(
        `https://cancerreg.ir/api/v1/tests/category-details/`
      );
      if (response.status >= 200 && response.status < 400) {
        const categories = response?.data?.data?.result ?? [];
        const categoryMap = {};
        categories.forEach((category) => {
          categoryMap[category.uid] = category.name;
        });
        setCategoryDetails(categoryMap);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  const operationsTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => {
          const groupedTests = rowData.names.reduce((acc, test) => {
            if (!acc[test.value]) {
              acc[test.value] = [];
            }
            acc[test.value].push(test);
            return acc;
          }, {});

          const uniqueTests = [
            ...new Set(rowData.names.map((test) => test.value)),
          ];

          const testUids = rowData.names.map((test) => test.uid);

          setShowAzmayeshPAge("viewTest");
          setViewTestData({
            testUids,
            testNames: uniqueTests,
            groupedTests: groupedTests,
          });
        }}
      >
        مشاهده
      </button>
    );
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
              body={operationsTemplate}
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
            <PillsTabs
              isLoadingData={false}
              setShowAzmayeshPAge={setShowAzmayeshPAge}
              diseaseType={diseaseType}
            />
          </div>
        </>
      ) : showAzmayeshPAge === "viewTest" ? (
        <>
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-2 pb-3">مشاهده نتیجه آزمایش</h2>
              <span
                className="text-danger cursor-pointer"
                style={{ fontSize: "32px" }}
                onClick={() => {
                  setShowAzmayeshPAge("home");
                  setViewTestData(null);
                }}
              >
                x
              </span>
            </div>
            <PillsTabs
              setShowAzmayeshPAge={setShowAzmayeshPAge}
              viewMode={true}
              viewTestData={viewTestData}
            />
          </div>
        </>
      ) : (
        showAzmayeshPAge === "orderRegisterOrder" && (
          <>
            <div className="container mt-5 mb-4">
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
              <RegisterTests setShowAzmayeshPAge={setShowAzmayeshPAge} />
            </div>
          </>
        )
      )}
    </>
  );
}
