import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./ProductService";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import HeaderName from "../components/HeaderName";

export default function ColumnToggleDemo() {
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
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const openNew2 = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const headerNew = (
    <div className="d-flex flex-wrap gap-2 align-items-center  justify-content-end">
      <Button
        label="جستجو"
        icon="pi pi-search"
        severity="primary"
        onClick={openNew2}
      />
      <IconField iconPosition="left">
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="جستجوی کد ملی"
        />
      </IconField>
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

  return (
    <div className="card screen-width p-5">
      <HeaderName HeaderName="لیست بیماران" />

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
        globalFilter={globalFilter}
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
  );
}
