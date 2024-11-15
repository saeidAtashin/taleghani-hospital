import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import PillsTabs from "./PillsTabs";
import SelectableIconItem from "./BadgeIcon";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { tabsInnerImage } from "../pages/PatientsDetails";

export default function TasvirBardari() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAzmayeshPAge, setShowAzmayeshPAge] = useState("home");
  const dt = useRef(null);
  const navigate = useNavigate();

  const numberTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>;
  };

  const persianDateTemplate = (rowData) => {
    return (
      <span>
        {moment(rowData.created_at, "YYYY-MM-DD")
          .locale("fa")
          .format("jYYYY/jMM/jDD")}
      </span>
    );
  };

  const nameTemplate = (rowData) => {
    return (
      <div>
        {rowData.records.map((record, index) => (
          <span
            key={index}
            onClick={() => navigate(`/dashboard/record/${record.uid}`)}
            style={{
              cursor: "pointer",
              color:
                record.record_type === "graphicrecord" ? "green" : "orange",
              marginRight: "8px",
            }}
          >
            {record.record_type}
          </span>
        ))}
      </div>
    );
  };

  const columns = [
    { field: "number", header: "ردیف", body: numberTemplate },
    { field: "name", header: "آزمایش‌ها", body: nameTemplate },
    { field: "persianDate", header: "تاریخ انجام", body: persianDateTemplate },
    { field: "persianDate", header: "تاریخ ثبت", body: persianDateTemplate },
  ];

  useEffect(() => {
    axios
      .get(
        "https://cancerreg.ir/api/v1/records/batch-records/f8807538-e9cd-455d-a7d2-c36f10410d9d/"
      )
      .then((response) => {
        const fetchedData = response.data.results.map((item) => ({
          ...item,
          records: item.records,
          created_at: moment().format("YYYY-MM-DD"),
        }));
        setProducts(fetchedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handlePrint = () => {
    console.log("Printing:", selectedProducts);
  };

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start">
      <Button
        label="ثبت نتیجه تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => setShowAzmayeshPAge("orderRegister")}
        className="rounded-3"
      />
      <Button
        label="ثبت دستور تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => setShowAzmayeshPAge("orderRegisterOrder")}
        className="rounded-3"
      />
    </div>
  );

  const handleDelete = () => {
    setProducts(
      products.filter((product) => !selectedProducts.includes(product))
    );
    setSelectedProducts([]);
  };

  const [selectedOptions, setSelectedOptions] = useState(["petscan"]);

  const handleSelectionChange = (selected) => {
    setSelectedOptions(selected);
  };

  const { uid } = useParams();
  const [description, setDescreption] = useState("");

  const options = [
    { value: "sonography", label: "سونوگرافی" },
    { value: "petscan", label: "PET-Scan" },
    { value: "mri", label: "MRI" },
  ];

  const handleSubmit = () => {
    const payload = {
      patient_uid: uid,
      description: description,
      content_types: ["sonography", "petscan", "mri"],
    };

    axios
      .post(`https://cancerreg.ir/api/v1/records/records-order/`, payload)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
        // Handle success
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        // Handle error
      });
  };

  return (
    <>
      {showAzmayeshPAge === "home" ? (
        <div className="card " style={{ direction: "rtl" }}>
          <DataTable
            dir="rtl"
            ref={dt}
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
                      `/dashboard/patients/batch-graphic-records/${rowData.uid}`,
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
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-2 pb-3">ثبت نتیجه تصویربرداری</h2>
            <span
              className="text-danger cursor-pointer"
              onClick={() => setShowAzmayeshPAge("home")}
            >
              x
            </span>
          </div>
          <PillsTabs tabs={tabsInnerImage} />
        </div>
      ) : (
        showAzmayeshPAge === "orderRegisterOrder" && (
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-2 pb-3">ثبت دستور تصویربرداری</h2>
              <span
                className="text-danger cursor-pointer"
                onClick={() => setShowAzmayeshPAge("home")}
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
        )
      )}
      <div className="m-2">
        <label htmlFor="description" className="label">
          توضیحات
        </label>
        <textarea
          type="text"
          className={`form-control controllerdecrepton`}
          id="description"
          placeholder={"توضیحات مرتبط با آزمایش را وارد کنید"}
          disabled={false}
          onChange={(e) => {
            setDescreption(e.target.value);
          }}
        />
      </div>
      <div className="m-2 d-flex justify-content-between mt-4">
        <>
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary w-100"
          >
            تایید و ثبت دستور تصویربرداری ها
          </button>
        </>
      </div>
    </>
  );
}
