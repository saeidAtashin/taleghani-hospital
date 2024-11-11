import React, { useEffect, useRef, useState } from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";
import {
  formFielsIdentity,
  formPatientsFields,
  generateReusableSchema,
  InnerAzmayesh,
  loginForm,
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
import { useParams } from "react-router-dom";
import apiRequest from "../api/apiService";
import TasvirBardari from "../components/TasvirBardari";

const handleFormSubmit = (data) => {
  console.log("data", data);
  // navigate("/dashboard");
};

export const tabsInnerImage = [
  {
    eventKey: "home",
    title: "سونوگرافی",
    content: (
      <>
        <ReusableForm
          isEditable={false}
          onlyPost={true}
          fields={InnerAzmayesh}
          formSchema={generateReusableSchema(InnerAzmayesh)}
          onSubmit={handleFormSubmit}
          inputsPerRow={[1, 2]}
        />{" "}
      </>
    ),
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

const PatientsDetails = () => {
  const { uid } = useParams();

  console.log("uid", uid);

  const columns = [
    { field: "uid", header: "کد ملی" },
    { field: "first_name", header: "نام" },
    { field: "last_name", header: "نام خانوادگی" },
    { field: "created_at", header: "تاریخ ثبت" },
    { field: "updated_at", header: "تاریخ بروزرسانی" },
  ];

  const [products, setProducts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/records/batch-records/${uid}`
        );
        const patients = response.data.data.results;
        setProducts(patients);
        console.log("patients", patients);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
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
  // const [productDialog, setProductDialog] = useState(false);
  // const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [itemToDisplay, setItemToDisplay] = useState("home");
  const dt = useRef(null);

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

  const detailsTemplate = (rowData) => {
    return (
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

  const handleFormSubmit = (data) => {
    console.log("Final form submission:", data);
  };

  // /

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
      <TasvirBardari />
    },
    {
      key: "آزمایشات",
      label: "آزمایشات",
      content: (
        <>
          <AzmayeshatTable />
        </>
      ),
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
