import React, { useEffect, useRef, useState } from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";
import {
  formFielsIdentity,
  formPatientsFields,
  generateReusableSchema,
} from "../form-fields/FormFields";
import ReusableForm from "../ReusableForm/ReusableForm";
import ColumnToggleDemo from "../tables/ColumnToggleDemo";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { ProductService } from "../tables/ProductService";
import { Button } from "primereact/button";
import PillsTabs from "../components/PillsTabs";
import AzmayeshatTable from "../components/AzmayeshatTable";

const PatientsDetails = () => {
  const columns = [
    { field: "name", header: "Name" },
    { field: "category", header: "Category" },
    { field: "quantity", header: "Quantity" },
  ];
  const [products, setProducts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);

  useEffect(() => {
    ProductService?.getProductsMini().then((data) => setProducts(data));
  }, []);

  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };
  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState("home");
  const dt = useRef(null);

  const tabsInnerImage = [
    {
      eventKey: "home",
      title: "سونوگرافی",
      content: <div>سونوگرافی</div>,
    },
    {
      eventKey: "ماموگرافی",
      title: "ماموگرافی",
      content: <div>This is the profile content.</div>,
    },
    {
      eventKey: "MRI",
      title: "MRI",
      content: <div>This is the profile content.</div>,
    },
    {
      eventKey: "profile",
      title: "CT-Scan",
      content: <div>This is the profile content.</div>,
    },
    {
      eventKey: "اسکن هسته ای",
      title: "اسکن هسته ای",
      content: <div>This is the profile content.</div>,
    },
    {
      eventKey: "PET-Scan",
      title: "PET-Scan",
      content: <div>This is the profile content.</div>,
    },
    {
      eventKey: "گرافی ساده",
      title: "گرافی ساده",
      content: <div>This is the contact content.</div>,
    },
  ];

  const openNew2 = () => {
    console.log("ytytytyty");
    setItemToDisplay("recordImagingResult");
  };

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-end">
      <Button
        label="ثبت دستور تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        onClick={openNew2}
        className="rounded-3 "
      />
      <Button
        label="ثبت نتیجه تصویربرداری"
        icon="pi pi-plus"
        severity="primary"
        // onClick={openNew2}
        className="rounded-3 "
      />
    </div>
  );

  // Custom function to render the "Details" button
  const detailsTemplate = (rowData) => {
    return (
      // <Button
      //   label="مشاهده"
      //   icon="pi pi-external-link"
      //   onClick={() => window.open(`/details/${rowData.id}`, "_blank")}
      // />
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
  };

  const handleFormSubmit = (data) => {
    console.log("Final form submission:", data);
  };

  const tabs = [
    {
      key: "اطلاعات هویتی",
      label: "اطلاعات هویتی",
      content: (
        <div>
          <ReusableForm
            isEditable={true}
            fields={formFielsIdentity}
            formSchema={generateReusableSchema(formFielsIdentity)}
            onSubmit={handleFormSubmit}
            inputsPerRow={[1, 2, 3, 2, 2, 2, 2, 3, 2, 1]}
          />
        </div>
      ),
    },
    {
      key: "سوابق بیمار",
      label: "سوابق بیمار",
      content: (
        <div>
          {" "}
          <ReusableForm
            isEditable={true}
            fields={formPatientsFields}
            formSchema={generateReusableSchema(formPatientsFields)}
            onSubmit={handleFormSubmit}
            inputsPerRow={[1, 2, 2, 2, 2, 1, 3, 2, 1]}
          />
        </div>
      ),
    },
    {
      key: "اطلاعات بیماری",
      label: "اطلاعات بیماری",
      content: <div>اطلاعات بیماری</div>,
    },
    {
      key: "تصویربرداری",
      label: "تصویربرداری",
      content:
        itemToDisplay === "home" ? (
          <div className="mt-5">
            <DataTable
              stripedRows
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
              // globalFilter={globalFilter}
              header={headerNew}
            >
              <Column field="code" header="Code" />
              {visibleColumns.map((col) => (
                <Column
                  sortable
                  key={col.field}
                  field={col.field}
                  header={col.header}
                />
              ))}
              {/* Add the Details column */}
              <Column
                header="Details"
                body={detailsTemplate} // Use custom template for rendering button
              />
            </DataTable>
          </div>
        ) : itemToDisplay === "recordImagingResult" ? (
          <>
            <div className="container mt-5">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-2 pb-3">ثبت نتیجه تصویربرداری</h2>
                <span
                  className="text-danger cursor-pointer"
                  onClick={() => setItemToDisplay("home")}
                >
                  x
                </span>
              </div>
              <PillsTabs tabs={tabsInnerImage} />
            </div>
          </>
        ) : (
          <></>
        ),
    },
    {
      key: "آزمایشات",
      label: "آزمایشات",
      content: <><AzmayeshatTable /></>,
    },
    {
      key: "درمان",
      label: "درمان",
      content: <div>درمان</div>,
    },
    {
      key: "follow up",
      label: "follow up",
      content: <div>follow up</div>,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-5">بیمار امیررضا موحدی - 0024534961</h2>
      <ReusableTabs tabs={tabs} defaultActiveKey="اطلاعات هویتی" />
    </div>
  );
};

export default PatientsDetails;
