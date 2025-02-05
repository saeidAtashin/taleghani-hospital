import React, { useEffect, useRef, useState } from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";
import AzmayeshatTable from "../components/AzmayeshatTable";
import { useParams } from "react-router-dom";
import apiRequest from "../api/apiService";
import TasvirBardari from "../components/TasvirBardari";
import TreatmentTable from "../components/TreatmentTable";
import FollwoUp from "../components/FollwoUp";
import PatientInfoForm from "./PatientInfoForm";
import PatientRecordsForm from "./PatientRecordsForm";
import PatientDiseaseMap from "./PatientDiseaseMap";

const PatientsDetails = () => {
  const { uid } = useParams();
  const defaultActiveKey = localStorage.getItem("defaultActiveKey");

  const [userIdentityData, setUserIdentityData] = useState([]);
  const [activeTabForce, setActiveTabForce] = useState(0);
  const [rowDataTransfer, setrowDataTransfer] = useState(undefined);

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
        // console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    {
      key: "اطلاعات هویتی",
      label: "اطلاعات هویتی",
      content: (
        <div>
          <PatientInfoForm />
        </div>
      ),
    },
    {
      key: "سوابق بیمار",
      label: "سوابق بیمار",
      content: (
        <div>
          {" "}
          <PatientRecordsForm />
        </div>
      ),
    },
    {
      key: "اطلاعات بیماری",
      label: "اطلاعات بیماری",
      content: (
        <div>
          <PatientDiseaseMap />
        </div>
      ),
    },
    {
      key: "تصویربرداری",
      label: "تصویربرداری",
      content: (
        <TasvirBardari
          rowDataTransfer={rowDataTransfer}
          setrowDataTransfer={setrowDataTransfer}
        />
      ),
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
          <TreatmentTable
            rowDataTransfer={rowDataTransfer}
            setrowDataTransfer={setrowDataTransfer}
          />
        </>
      ),
    },
    {
      key: "follow up",
      label: "follow up",
      content: (
        <div>
          <FollwoUp
            activeTabForce={activeTabForce}
            setActiveTabForce={setActiveTabForce}
            rowDataTransfer={rowDataTransfer}
            setrowDataTransfer={setrowDataTransfer}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-5">
        بیمار {userIdentityData?.first_name} {userIdentityData?.last_name} -{" "}
        {userIdentityData?.phone_number}
      </h2>
      <ReusableTabs
        tabs={tabs}
        activeTabForce={activeTabForce}
        setActiveTabForce={setActiveTabForce}
      />
    </div>
  );
};

export default PatientsDetails;
