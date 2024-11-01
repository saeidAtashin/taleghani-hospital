import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";

export default function AzmayeshatTable() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Multi-selection
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
        name: [{ value: "خون", type: "primary" }],
        category: "General",
        quantity: 10,
        date: "2024-11-01",
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
    ];
    setProducts(newData);
  }, []);

  const handlePrint = () => {
    console.log("Printing:", selectedProducts);
    // Add your print logic here
  };

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-start">
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

  const handleDelete = () => {
    setProducts(
      products.filter((product) => !selectedProducts.includes(product))
    );
    setSelectedProducts([]); // Clear selection after delete
  };

  return (
    <div className="card screen-width p-5" style={{ direction: "rtl" }}>
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
          headerStyle={{ width: "3em" }}
        ></Column>
        {columns?.map((col) => (
          <Column
            sortable
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            style={{ textAlign: "right", direction: "rtl" }}
          />
        ))}
        <Column
          header="عملیات"
          body={(rowData) => (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                window.open(`/dashboard/patients-lists/${rowData.id}`, "_blank")
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
  );
}
