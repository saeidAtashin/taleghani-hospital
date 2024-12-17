import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import PillsTabs from "./PillsTabs";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AzmayeshatTable() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  // function nameTemplate(rowData) {
  //   const names = Array.isArray(rowData?.name) ? rowData.name : [];

  //   console.log("rowData", rowData);
  //   return (
  //     <div>
  //       {names.map((nameItem, index) => (
  //         <span
  //           onClick={() => {
  //             console.log("batch_id?", rowData?.id);
  //           }}
  //           key={index}
  //           style={{
  //             cursor: "pointer",
  //             fontWeight: "bold",
  //             color: nameItem.type === "info" ? "#aa9f00" : "green",
  //             marginRight: "8px",
  //           }}
  //         >
  //           {nameItem.value}
  //         </span>
  //       ))}
  //     </div>
  //   );
  // }

  function nameTemplate(rowData) {
    const names = Array.isArray(rowData?.name) ? rowData.name : [];

    console.log("rowData", rowData);
    return (
      <div>
        {names.map((nameItem, index) => (
          <span
            key={index}
            onClick={() => {
              console.log("UID of the clicked item:", rowData?.id); // Log the uid when clicked
            }}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: nameItem.type === "info" ? "#FF7518" : "green",
              marginRight: "8px",
            }}
          >
            {nameItem.value}
          </span>
        ))}
      </div>
    );
  }

  const columns = [
    { field: "number", header: "ردیف", body: numberTemplate },
    { field: "name", header: "آزمایش‌ها", body: nameTemplate },
    { field: "persianDate", header: "تاریخ انجام", body: persianDateTemplate },
    { field: "persianDate", header: "تاریخ ثبت", body: persianDateTemplate },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/batch-test/${uid}/`
        );
        const { results } = response.data;
        console.log("results", results);
        const mappedData = results.map((item) => ({
          id: item.uid,
          name: item.tests.map((test) => ({
            value: test.category,
            type: test.state === "IN_PROGRESS" ? "info" : "secondary",
          })),
          category: item.order_description || "General",
          quantity: item.tests.length,
          date: item.created_at ? item.created_at.slice(0, 10) : null,
        }));

        setProducts(mappedData);
        console.log("mappedData", mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [showAzmayeshPAge]);

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
    setProducts(
      products.filter((product) => !selectedProducts.includes(product))
    );
    setSelectedProducts([]);
  };

  return (
    <>
      {showAzmayeshPAge === "home" ? (
        <div className="card" style={{ direction: "rtl" }}>
          <DataTable
            dir="rtl"
            ref={dt}
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
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
            {columns?.map((col, index) => (
              <Column
                sortable
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
                style={{ textAlign: "right", direction: "rtl" }}
                headerStyle={{ borderBottom: "2px solid black" }}
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
                      `/dashboard/patients-lists/${rowData.id}`,
                      "_blank"
                    )
                  }
                >
                  مشاهده
                </button>
              )}
            />
          </DataTable>

          {selectedProducts.length > 0 && (
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
            <PillsTabs />
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
            </div>
          </>
        )
      )}
    </>
  );
}

//  in this code, i want that when click on any items in cell with test.state is "IN_PROGRESS" make its color yellow, and if DONE make it green, and when click on any of them, console.log its uid
