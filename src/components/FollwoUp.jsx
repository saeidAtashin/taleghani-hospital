import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "jalali-moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "primereact/badge";

export default function FollwoUp({
  activeTabForce,
  setActiveTabForce,
  rowDataTransfer,
  setrowDataTransfer,
}) {
  const [products, setProducts] = useState([]);
  const [allrow, setallrow] = useState([]);
  const [tasvirDetailUid, settasvirDetailUid] = useState(undefined);
  const dt = useRef(null);
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);

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

  const tasvirbardatiCellClick = (record, allrow, type) => {
    console.log("record", record?.data?.uid);
    switch (type) {
      case "tests":
        setActiveTabForce("آزمایشات");
        break;

      case "graphic":
        setActiveTabForce("تصویربرداری");
        setrowDataTransfer(record);

        break;

      case "treatments":
        setActiveTabForce("درمان");
        break;

      default:
        setActiveTabForce(4);
    }
  };

  const medical_testsTemplate = (rowData) => {
    return (
      <div>
        {rowData?.medical_tests?.length > 0 ? (
          rowData?.medical_tests.map((record, index) => (
            <span
              key={index}
              onClick={() => tasvirbardatiCellClick(record, rowData, "tests")}
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
        className=""
        style={{
          direction: "rtl",
          textAlign: "right",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        <div className="d-flex flex-wrap align-items-end">
          {rowData?.graphic_records?.length > 0 ? (
            rowData?.graphic_records.map((record, index) => (
              <span
                key={index}
                className="p-1"
                onClick={() =>
                  tasvirbardatiCellClick(record, rowData, "graphic")
                }
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
                <Badge
                  severity="warning"
                  value={record.name}
                  className=" bg-white shadow"
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
                />
              </span>
            ))
          ) : (
            <>--</>
          )}
        </div>
      </div>
    );
  };

  const treatmentsTemplate = (rowData) => {
    return (
      <div
        style={{
          textAlign: "right",
          direction: "rtl",
        }}
      >
        {rowData?.treatments?.length > 0 &&
          rowData?.treatments.map((record, index) => (
            <span
              key={index}
              onClick={() =>
                tasvirbardatiCellClick(record, rowData, "treatments")
              }
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
    { field: "number", header: "ردیف", body: numberTemplate, width: "250px" },
    {
      field: "persianDate",
      header: "تاریخ مراجعه",
      body: persianDateTemplate,
      width: "350px",
    },
    {
      field: "medical_tests",
      header: "آزمایش‌ها",
      body: medical_testsTemplate,
      width: "350px",
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
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
        toast.error("خطا در بارگذاری داده‌ها");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [uid]);

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start"></div>
  );

  return (
    <>
      <div className="" style={{ direction: "rtl" }}>
        <DataTable
          dir="rtl"
          ref={dt}
          value={products}
          // selection={selectedProducts}
          // onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="uid"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} اطلاعات"
          globalFilter={null}
          header={headerNew}
        >
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
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
              headerStyle={{
                borderBottom: "2px solid black",
                width: col.width,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            />
          ))}
        </DataTable>
      </div>
    </>
  );
}
