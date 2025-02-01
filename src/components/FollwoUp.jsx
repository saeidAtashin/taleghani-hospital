import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "jalali-moment";
import SelectableIconItem from "./BadgeIcon";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PillsTabsTasvir from "./PillsTabsTasvir";

export default function FollwoUp() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allrow, setallrow] = useState([]);
  const [showAzmayeshPAge, setShowAzmayeshPAge] = useState("home");
  const [tasvirDetailUid, settasvirDetailUid] = useState(undefined);
  const dt = useRef(null);
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

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

  const tasvirbardatiCellClick = (record, allrow) => {
    settasvirDetailUid(record);
    setallrow(allrow);
    setShowAzmayeshPAge("orderRegister");
  };

  const medical_testsTemplate = (rowData) => {
    return (
      <div>
        {rowData?.medical_tests?.length > 0 ? (
          rowData?.medical_tests.map((record, index) => (
            <span
              key={index}
              onClick={() => tasvirbardatiCellClick(record, rowData)}
              style={{
                cursor: "pointer",
                color:
                  record?.state === "IN_PROGRESS"
                    ? "#FF7518"
                    : record?.state === "DONE"
                    ? "green"
                    : "blue",
                marginRight: "8px",
              }}
            >
              {record.category}
            </span>
          ))
        ) : (
          <>--</>
        )}
      </div>
    );
  };

  const graphic_recordsTemplate = (rowData) => {
    return (
      <div
        style={{
          textAlign: "right",
          direction: "ltr",
          // maxWidth: "120px",
          whiteSpace: "normal", // Allow text wrapping
          wordBreak: "break-word", // Break the text at space or word boundaries
        }}
      >
        {rowData?.graphic_records?.length > 0 ? (
          rowData?.graphic_records.map((record, index) => (
            <span
              key={index}
              onClick={() => tasvirbardatiCellClick(record, rowData)}
              style={{
                cursor: "pointer",
                color:
                  record?.state === "IN_PROGRESS"
                    ? "#FF7518"
                    : record?.state === "DONE"
                    ? "green"
                    : "blue",
                marginRight: "8px",
              }}
            >
              {record.name}
            </span>
          ))
        ) : (
          <>--</>
        )}
      </div>
    );
  };

  const treatmentsTemplate = (rowData) => {
    return (
      <div
        style={{
          textAlign: "right",
          direction: "rtl",
          // width: "250px",
          // whiteSpace: "normal", // Allow text wrapping
          // wordBreak: "break-word", // Break the text at space or word boundaries
        }}
      >
        {rowData?.treatments?.length > 0 &&
          rowData?.treatments.map((record, index) => (
            <span
              key={index}
              onClick={() => tasvirbardatiCellClick(record, rowData)}
              style={{
                cursor: "pointer",
                color:
                  record?.state === "IN_PROGRESS"
                    ? "#FF7518"
                    : record?.state === "DONE"
                    ? "green"
                    : "blue",
                marginRight: "8px",
              }}
            >
              {record.category}
              {record?.sub_category && ` (${record.sub_category})`}
            </span>
          ))}
      </div>
    );
  };

  const columns = [
    { field: "number", header: "ردیف", body: numberTemplate, width: "150px" },
    {
      field: "persianDate",
      header: "تاریخ مراجعه",
      body: persianDateTemplate,
      width: "200px",
    },
    {
      field: "medical_tests",
      header: "آزمایش‌ها",
      body: medical_testsTemplate,
      width: "280px",
    },
    {
      field: "graphic_records",
      header: "تصویربرداری‌ها",
      body: graphic_recordsTemplate,
      width: "80vw",
    },
    {
      field: "treatments",
      header: "درمان‌ها",
      body: treatmentsTemplate,
      width: "80vw",
    },
  ];

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`https://cancerreg.ir/api/v1/reports/follow-up/${uid}/`)
      .then((response) => {
        const fetchedData = response.data.results.map((item) => ({
          ...item,
          records: item.records,
          created_at: moment().format("YYYY-MM-DD"),
        }));
        setProducts(fetchedData);
        setSelectedOptions([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("خطا در بارگذاری داده‌ها");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [uid, showAzmayeshPAge]);

  const handlePrint = () => {};

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start"></div>
  );

  const handleDelete = () => {
    setProducts(
      products?.filter((product) => !selectedProducts.includes(product))
    );
    setSelectedProducts([]);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectionChange = (selected) => {
    setSelectedOptions(selected);
  };

  const [description, setDescreption] = useState("");

  const options = [
    { value: "sonography", label: "سونوگرافی" },
    { value: "petscan", label: "PET-Scan" },
    { value: "mri", label: "MRI" },
    { value: "corescan", label: "اسکن هسته ای" },
    { value: "ctscan", label: "CT-Scan" },
    { value: "mammography", label: "ماموگرافی" },
    { value: "othergraphy", label: "گرافی ساده" },
  ];

  const handleRefresh = () => {
    fetchData(); // Refetch data on button click
  };

  const handleSubmit = () => {
    setbtnLoading(true);

    const payload = {
      patient_uid: uid,
      description: description,
      content_types: selectedOptions,
    };

    axios
      .post(`https://cancerreg.ir/api/v1/records/records-order/`, payload)
      .then((response) => {
        setbtnLoading(false);
        setShowAzmayeshPAge("home");
        handleRefresh();
      })
      .catch((error) => {
        setbtnLoading(false);

        console.error("Error submitting data:", error);
        // Handle error
        toast.warning("مشکلی پیش آمده است.");
      });
  };

  return (
    <>
      <div className="" style={{ direction: "rtl" }}>
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
              style={{
                textAlign: "right",
                direction: "rtl",
                width: col.width,
                whiteSpace: "normal", // Allow text wrapping
                wordBreak: "break-word", // Break the text at space or word boundaries
              }}
              headerStyle={{
                borderBottom: "2px solid black",
                width: col.width,
                whiteSpace: "normal", // Allow text wrapping
                wordBreak: "break-word", // Break the text at space or word boundaries
              }}
            />
          ))}
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
    </>
  );
}
