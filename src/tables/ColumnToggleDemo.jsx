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
    { field: "created_at", header: "تاریخ ثبت" },
    { field: "updated_at", header: "تاریخ بروزرسانی" },
  ];

  const [products, setProducts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [loading, setLoading] = useState(columns);
  const [page, setPage] = useState(1); // current page
  const [rows, setRows] = useState(10); // current page
  const [count, setcount] = useState(10); // current page
  const [first, setFirst] = useState(10); // current page

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const response = await apiRequest(
        "GET",
        `/patient/patient-info/?page=${page + 1}&page_size=${rows}`
      );
      const patients = response.data.data.results;
      setProducts(patients);
      setcount(response.data?.data?.count);
      setLoading(false); // End loading state
    } catch (error) {
      setLoading(false);
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.removeItem("defaultActiveKey");
  }, [page, rows]); // Trigger when page  changes

  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
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
          onInput={(e) => setGlobalFilter(e.target.value)}
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

  // Custom rendering function for the created_at column
  const createdAtTemplate = (rowData) => {
    const formattedDate = new Date(rowData.created_at).toLocaleDateString(
      "fa-IR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    return formattedDate;
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
          paginator
          rows={rows}
          paginatorTemplate=""
          currentPageReportTemplate=""
          globalFilter={globalFilter}
          header={headerNew}
        >
          {visibleColumns.map((col, index) => (
            <Column
              sortable
              key={index}
              field={col.field}
              header={col.header}
              body={
                col.field === "created_at" || col.field === "updated_at"
                  ? createdAtTemplate
                  : undefined
              }
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
