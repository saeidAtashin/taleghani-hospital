import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import HeaderName from "../components/HeaderName";
// Import jalali-moment for Persian date conversion
import moment from "jalali-moment";

export default function AzmayeshatTable() {
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
        {names.map((nameItem, index) => {
          if (typeof nameItem?.value !== "string") {
            console.warn(
              `Expected a string in nameItem.value, found:`,
              nameItem
            );
            return null; // Skip invalid entries
          }

          return (
            <span
              key={index}
              onClick={() => console.log(nameItem.value)}
              style={{
                cursor: "pointer",
                color:
                  nameItem.type === "primary"
                    ? "blue"
                    : nameItem.type === "secondary"
                    ? "green"
                    : nameItem.type === "info"
                    ? "purple"
                    : "black",
                marginRight: "8px",
              }}
            >
              {nameItem.value}
            </span>
          );
        })}
      </div>
    );
  }

  const columns = [
    { field: "number", header: "ردیف", body: numberTemplate },
    { field: "name", header: "آزمایش‌ها", body: nameTemplate },
    { field: "persianDate", header: "تاریخ انجام", body: persianDateTemplate },
    { field: "persianDate", header: "تاریخ ثبت", body: persianDateTemplate },
  ];

  const [products, setProducts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  // Mock data with date field
  useEffect(() => {
    const newData = [
      {
        id: 1,
        name: [{ value: "خون", type: "primary" }],
        category: "General",
        quantity: 10,
        date: "2024-11-01", // Sample Gregorian date
      },
      {
        id: 2,
        name: [
          { value: "Jane Smith", type: "secondary" },
          { value: "گروه خون", type: "info" },
        ],
        category: "Special",
        quantity: 5,
        date: "2024-11-02",
      },
      {
        id: 3,
        name: [
          { value: "تومور مارکرها", type: "primary" },
          { value: "روتین ", type: "secondary" },
          { value: "مولکولار", type: "info" },
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
      // Add more items as needed
    ];
    setProducts(newData);
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-end">
      <Button
        label="ثبت دستور آزمایش"
        icon="pi pi-plus"
        severity="primary"
        // onClick={openNew2}
        className="rounded-3 "
      />
      <Button
        label="ثبت نتیجه آزمایش"
        icon="pi pi-plus"
        severity="primary"
        // onClick={openNew2}
        className="rounded-3 "
      />
    </div>
  );

  const detailsTemplate = (rowData) => (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={() =>
        window.open(`/dashboard/patients-lists/${rowData.id}`, "_blank")
      }
    >
      مشاهده
    </button>
  );

  return (
    <div className="card screen-width p-5 ">
      <DataTable
        dir="ltr"
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
        globalFilter={globalFilter}
        header={headerNew}
      >
        {visibleColumns?.map((col) => (
          <Column
            sortable
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body} // Use custom body template if provided
          />
        ))}
        <Column header="عملیات" body={detailsTemplate} />
      </DataTable>
    </div>
  );
}
