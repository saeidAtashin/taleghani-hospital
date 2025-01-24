import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import HeaderName from "../components/HeaderName";
import apiRequest from "../api/apiService";
import { Paginator } from "primereact/paginator";

export default function ColumnToggleDemo() {
  const columns = [
    { field: "first_name", header: "نام" },
    { field: "last_name", header: "نام خانوادگی" },
    { field: "national_id", header: "کد ملی" },
    { field: "disease.first_reference", header: "تاریخ اولین مراجعه" },
    { field: "disease.last_reference", header: "تاریخ آخرین مراجعه" },
    { field: "disease.type", header: "نوع بدخیمی" },
    { field: "disease.diagnosis", header: "تشخیص" },
  ];

  const [products, setProducts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [loading, setLoading] = useState(false); // Fixed incorrect initial state
  const [page, setPage] = useState(0); // Fixed to 0-based index for consistency
  const [rows, setRows] = useState(10);
  const [count, setCount] = useState(0);
  const [first, setFirst] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/patient/patient-info/?page=${page + 1}&page_size=${rows}`
      );
      const patients = response.data.data.results;
      setProducts(patients);
      setCount(response.data?.data?.count || 0);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.removeItem("defaultActiveKey");
  }, [page, rows]); // Ensure dependencies are correct

  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const dt = useRef(null);

  const headerNew = (
    <div
      className="d-flex flex-wrap gap-2 align-items-center justify-content-start"
      style={{ direction: "rtl" }}
    >
      <Button
        label="جستجو"
        icon="pi pi-search"
        severity="primary"
        onClick={() => console.log("Search button clicked")}
      />
      <IconField iconPosition="left">
        <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="جستجوی کد ملی"
          style={{ textAlign: "right" }}
        />
      </IconField>
    </div>
  );

  const detailsTemplate = (rowData) => (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={() =>
        window.open(`/dashboard/patients-lists/${rowData.uid}`, "_blank")
      }
    >
      مشاهده
    </button>
  );

  // Custom rendering function for date columns
  const dateTemplate = (rowData, field) => {
    const dateValue = field
      .split(".")
      .reduce((o, key) => (o ? o[key] : null), rowData);
    return dateValue
      ? new Date(dateValue).toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
  };

  return (
    <div className="card screen-width p-5" style={{ direction: "rtl" }}>
      <HeaderName HeaderName="لیست بیماران" />

      {loading ? (
        <div>در حال دریافت اطلاعات ... </div>
      ) : (
        <DataTable
          stripedRows
          dir="rtl"
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="uid"
          rows={rows}
          globalFilter={globalFilter}
          header={headerNew}
        >
          {visibleColumns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              sortable
              body={(rowData) => {
                if (
                  col.field === "disease.last_reference" ||
                  col.field === "disease.first_reference" ||
                  col.field === "created_at"
                ) {
                  return dateTemplate(rowData, col.field);
                }

                // Handle nested properties safely
                const fieldValue = col.field
                  .split(".")
                  .reduce((o, key) => (o ? o[key] : null), rowData);
                return fieldValue ?? "-"; // Show "-" if value is null/undefined
              }}
              style={{ textAlign: "right", direction: "rtl" }}
            />
          ))}
          <Column header="جزئیات" body={detailsTemplate} />
        </DataTable>
      )}

      <Paginator
        dir="ltr"
        first={first}
        rows={rows}
        totalRecords={count}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={(event) => {
          setFirst(event.first);
          setPage(event.page);
          setRows(event.rows);
        }}
      />
    </div>
  );
}
