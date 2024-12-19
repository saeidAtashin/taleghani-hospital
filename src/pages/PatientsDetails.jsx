import React, { useEffect, useRef, useState } from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";
import {
  formFielsIdentity,
  formPatientsFields,
  formPatientsInformationFields,
  generateReusableSchema,
} from "../form-fields/FormFields";
import ReusableForm from "../ReusableForm/ReusableForm";
import AzmayeshatTable from "../components/AzmayeshatTable";
import { useParams } from "react-router-dom";
import apiRequest from "../api/apiService";
import TasvirBardari from "../components/TasvirBardari";
import TreatmentTable from "../components/TreatmentTable";

const PatientsDetails = () => {
  const { uid } = useParams();
  const defaultActiveKey = localStorage.getItem("defaultActiveKey");
  const columns = [
    { field: "uid", header: "کد ملی" },
    { field: "first_name", header: "نام" },
    { field: "last_name", header: "نام خانوادگی" },
    { field: "created_at", header: "تاریخ ثبت" },
    { field: "updated_at", header: "تاریخ بروزرسانی" },
  ];

  const [products, setProducts] = useState([]);
  const [userIdentityData, setUserIdentityData] = useState([]);
  const [userRecords, setuserRecords] = useState([]);
  const [solidIdentityData, setsolidIdentityData] = useState(columns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/records/batch-records/${uid}/`
        );
        const patients = response?.data?.data?.results;
        setProducts(patients);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
  }, []);

  const dt = useRef(null);

  const handleFormSubmit = (data) => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/patient/patient-info/${uid}/`
        );
        const identityData = response.data.data;
        setUserIdentityData(identityData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataRecord = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/patient/patient-records/${uid}/`
        );
        const recordsData = response.data.data;
        setuserRecords(recordsData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchDataRecord();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/patient/patient-info/${uid}/`
        );
        const solidData = response.data.data;
        setsolidIdentityData(solidData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
  }, []);

  const defaultValues = {
    birth_province: "someValueFromBackend",
    birth_city: "anotherValueFromBackend",
    residential_province: "yetAnotherValue",
    residential_city: "finalValue",
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
            defaultValuesFromBackend={userIdentityData} // Pass default values here
          />
        </div>
        // in this code, I want that inputs, have value, set them when came from back, and set them as default value.
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
            defaultValuesFromBackend={userRecords} // Pass default values here
          />
        </div>
      ),
    },
    {
      key: "اطلاعات بیماری",
      label: "اطلاعات بیماری",
      content: (
        <div>
          <ReusableForm
            isEditable={true}
            fields={formPatientsInformationFields}
            formSchema={generateReusableSchema(formPatientsInformationFields)}
            onSubmit={handleFormSubmit}
            inputsPerRow={[1, 2, 3, 2, 2, 2, 2, 3, 2, 1]}
            defaultValuesFromBackend={solidIdentityData} // Pass default values here
          />
        </div>
        // in this code, I want that inputs, have value, set them when came from back, and set them as default value.
      ),
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
      content: (
        <>
          <TreatmentTable />
        </>
      ),
    },
    {
      key: "follow up",
      label: "follow up",
      content: <div>follow up</div>,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-5">
        بیمار {userIdentityData?.first_name} / {userIdentityData?.last_name} /
        {userIdentityData?.phone_number}{" "}
      </h2>
      <ReusableTabs
        tabs={tabs}
        defaultActiveKey={defaultActiveKey ? defaultActiveKey : "اطلاعات هویتی"}
      />
    </div>
  );
};

export default PatientsDetails;
