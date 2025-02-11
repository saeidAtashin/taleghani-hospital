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

export default function TasvirBardari({ rowDataTransfer, setrowDataTransfer }) {
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
    if (!rowData || !rowData.date) {
      const fallbackDate = rowData.created_at
        ? rowData.created_at.split("T")[0]
        : null;

      if (fallbackDate) {
        return (
          <span>
            {moment(fallbackDate, "YYYY-MM-DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD")}
          </span>
        );
      } else {
        return <span style={{ color: "red" }}>تاریخ نامعتبر</span>;
      }
    }

    const date = rowData.date.split("T")[0];
    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    }

    return (
      <span>
        {moment(date, "YYYY-MM-DD").locale("fa").format("jYYYY/jMM/jDD")}
      </span>
    );
  };

  const tasvirbardatiCellClick = (rowData, allrow) => {
    if (rowData?.records?.length > 0) {
      const clickedRecordType = rowData.records[0].record_type;
      settasvirDetailUid({
        records: rowData.records,
        activeRecord: clickedRecordType,
      });
      setallrow(allrow);
      setShowAzmayeshPAge("orderRegister");
    }
  };

  useEffect(() => {
    if (rowDataTransfer && products.length > 0) {
      const matchingRow = products.find((row) =>
        row.records.some((record) => record.uid === rowDataTransfer?.data?.uid)
      );

      if (matchingRow) {
        tasvirbardatiCellClick(matchingRow, products);
      }
    }
  }, [rowDataTransfer, products]);

  const nameTemplate = (rowData) => {
    return (
      <div>
        {rowData?.records?.map((record, index) => (
          <span
            key={index}
            onClick={() => {
              settasvirDetailUid({
                records: rowData.records,
                activeRecord: record.record_type,
              });
              setallrow(rowData);
              setShowAzmayeshPAge("orderRegister");
            }}
            style={{
              cursor: "pointer",
              color: record?.state === "IN_PROGRESS" ? "#FF7518" : "green",
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
    { field: "order_description", header: "توضیحات" },
  ];

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`https://cancerreg.ir/api/v1/records/batch-records/${uid}/`)
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
        // // console.error("Error fetching data:", error);
        toast.error("خطا در بارگذاری داده‌ها");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    showAzmayeshPAge === "home" && fetchData();
  }, [uid, showAzmayeshPAge]);

  const handlePrint = () => {};

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start">
      <Button
        label="ثبت نتیجه تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => {
          setSelectedOptions([]);
          setShowAzmayeshPAge("orderRegister");
          setrowDataTransfer(undefined);
          settasvirDetailUid({
            records: [],
            activeRecord: "sonography",
          });
          setallrow([]);
        }}
        className="rounded-3"
      />
      <Button
        label="ثبت دستور تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        onClick={() => {
          setSelectedOptions([]);
          setShowAzmayeshPAge("orderRegisterOrder");
          setrowDataTransfer(undefined);
        }}
        className="rounded-3"
      />
    </div>
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
    fetchData();
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
        setrowDataTransfer(undefined);
        handleRefresh();
      })
      .catch((error) => {
        setbtnLoading(false);

        // // console.error("Error submitting data:", error);
        // Handle error
        toast.warning("مشکلی پیش آمده است.");
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
                  onClick={() => tasvirbardatiCellClick(rowData, rowData)}
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
        <div className="container my-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-2 pb-3">ثبت نتیجه تصویربرداری</h2>
            <span
              className="text-danger cursor-pointer"
              style={{ fontSize: "32px" }}
              onClick={() => {
                setSelectedOptions([]);
                setShowAzmayeshPAge("home");
                setrowDataTransfer(undefined);
              }}
            >
              x
            </span>
          </div>
          <PillsTabsTasvir
            setShowAzmayeshPAge={setShowAzmayeshPAge}
            dataOfTable={tasvirDetailUid}
            allrow={allrow}
          />
        </div>
      ) : (
        showAzmayeshPAge === "orderRegisterOrder" && (
          <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-2 pb-3">ثبت دستور تصویربرداری</h2>
              <span
                style={{ fontSize: "32px" }}
                className="text-danger cursor-pointer "
                onClick={() => {
                  setSelectedOptions([]);
                  setShowAzmayeshPAge("home");
                  setrowDataTransfer(undefined);
                }}
              >
                x
              </span>
            </div>
            <SelectableIconItem
              icon="pi pi-check"
              header=""
              options={options}
              type="bordered"
              selectedValues={selectedOptions}
              onChange={handleSelectionChange}
              iconColor="green"
              size="1.2rem"
            />
            <div className="">
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
            <div className="d-flex justify-content-between mt-4">
              <>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={btnLoading}
                >
                  تایید و ثبت دستور تصویربرداری ها
                </button>
              </>
            </div>
          </div>
        )
      )}
    </>
  );
}
