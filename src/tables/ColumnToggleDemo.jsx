import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import HeaderName from "../components/HeaderName";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [count, setCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://cancerreg.ir/api/v1/patient/patient-info/?search_query=${globalFilter}&page=${
          page + 1
        }&page_size=${rows}`
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
  }, [page, rows]);

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

  const dt = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    fetchData();
  };

  const headerNew = (
    <div
      className="d-flex flex-wrap gap-2 align-items-center justify-content-start"
      style={{ direction: "rtl" }}
    >
      <Button
        label="جستجو"
        icon="pi pi-search"
        severity="primary"
        onClick={handleSearch}
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

  return (
    <div className="card screen-width p-5" style={{ direction: "rtl" }}>
      <HeaderName HeaderName="لیست بیماران" />
      <Button
        label="افزودن بیمار جدید"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => navigate("/dashboard/register-patient")}
        className="rounded-3 w-25 mb-4"
      />
      {loading ? (
        <div>در حال دریافت اطلاعات ... </div>
      ) : (
        <DataTable
          stripedRows
          dir="rtl"
          ref={dt}
          value={products}
          dataKey="uid"
          rows={rows}
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

                const fieldValue = col.field
                  .split(".")
                  .reduce((o, key) => (o ? o[key] : null), rowData);
                return fieldValue ?? "-";
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
