import React, { useEffect, useRef, useState } from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";
import {
  formFielsIdentity,
  formPatientsFields,
  generateReusableSchema,
  InnerAzmayesh,
} from "../form-fields/FormFields";
import ReusableForm from "../ReusableForm/ReusableForm";
import AzmayeshatTable from "../components/AzmayeshatTable";
import { useParams } from "react-router-dom";
import apiRequest from "../api/apiService";
import TasvirBardari from "../components/TasvirBardari";

const handleFormSubmit = (data) => {
  console.log("data", data);
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

  const columns = [
    { field: "uid", header: "کد ملی" },
    { field: "first_name", header: "نام" },
    { field: "last_name", header: "نام خانوادگی" },
    { field: "created_at", header: "تاریخ ثبت" },
    { field: "updated_at", header: "تاریخ بروزرسانی" },
  ];

  const [products, setProducts] = useState([]);
  // const [visibleColumns, setVisibleColumns] = useState(columns);

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

  const dt = useRef(null);

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
      content: <TasvirBardari />,
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
