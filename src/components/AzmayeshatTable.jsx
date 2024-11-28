import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import PillsTabs from "./PillsTabs";
import { tabsInnerImage } from "../pages/PatientsDetails";
// import BadgeIcon from "./BadgeIcon";
import SelectableIconItem from "./BadgeIcon";

export default function AzmayeshatTable() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAzmayeshPAge, setShowAzmayeshPAge] = useState("home");
  const dt = useRef(null);

  const numberTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>; // Display row index as the row number
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

  function nameTemplate(rowData) {
    const names = Array.isArray(rowData?.name) ? rowData.name : [];
    return (
      <div>
        {names.map((nameItem, index) => (
          <span
            key={index}
            onClick={() => console.log(nameItem.value)}
            style={{
              cursor: "pointer",
              color: nameItem.type === "secondary" ? "green" : "orange",
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
    const newData = [
      {
        id: 1,
        name: [{ value: "خون", type: "secondary" }],
        category: "General",
        quantity: 10,
        date: "2024-11-01",
      },
      {
        id: 2,
        name: [
          { value: "تومور مارکرها", type: "secondary" },
          { value: "گروه خون", type: "info" },
        ],
        category: "Special",
        quantity: 5,
        date: "2024-11-02",
      },
      {
        id: 3,
        name: [
          { value: "تومور مارکرها", type: "secondary" },
          { value: "روتین ", type: "secondary" },
          { value: "مولکولار", type: "secondary" },
          { value: "گروه خون", type: "primary" },
        ],
        category: "General",
        quantity: 8,
        date: "2024-11-03",
      },
      {
        id: 3,
        name: [{ value: "تومور مارکرها", type: "primary" }],
        category: "General",
        quantity: 8,
        date: "2024-11-03",
      },
    ];
    setProducts(newData);
  }, []);

  const handlePrint = () => {
    // Add your print logic here
  };

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
    setSelectedProducts([]); // Clear selection after delete
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectionChange = (selected) => {
    setSelectedOptions(selected);
  };

  const options = [
    { value: "opt1", label: "CEA" },
    { value: "opt2", label: "CA125" },
    { value: "opt3", label: "CA19-9" },
  ];

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

          {/* Footer with conditional buttons */}
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
                  setSelectedOptions([]);
                  setShowAzmayeshPAge("home");
                }}
              >
                x
              </span>
            </div>
            <PillsTabs tabs={tabsInnerImage} />
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
                    setSelectedOptions([]);
                    setShowAzmayeshPAge("home");
                  }}
                >
                  x
                </span>
              </div>
              <SelectableIconItem
                icon="pi pi-check"
                header="تومور مارکرها"
                options={options}
                type="bordered"
                selectedValues={selectedOptions}
                onChange={handleSelectionChange}
                iconColor="green"
                size="1.2rem"
              />
            </div>
          </>
        )
      )}
    </>
  );
}
