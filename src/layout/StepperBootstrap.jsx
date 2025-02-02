import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stepper.css";
import HeaderName from "../components/HeaderName";
import ReusableForm from "../ReusableForm/ReusableForm";
import {
  formFielsIdentity,
  formPatientsFields,
  generateReusableSchema,
} from "../form-fields/FormFields";
import { PATIENT_INFO, PATIENT_RECORDS } from "../api/apiClient";
import axios from "axios";
import { toast } from "react-toastify";
import Step3Form from "../pages/Step3Form";

const StepperBootstrap = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const patient_uid_info = localStorage.getItem("patient_uid_info");

  const handleFormSubmit = async (data) => {
    setLoadingBtn(true);
    const currentFields =
      activeIndex === 0 ? formFielsIdentity : formPatientsFields;

    try {
      // Validate the data based on the current form schema
      const schema = generateReusableSchema(currentFields);
      schema.parse(data);

      if (activeIndex === 0) {
        const { ...restOfData } = data;

        const formattedData = {
          ...restOfData,
          patient_uid: patient_uid_info,
          marital_status: data?.["marital-status"]
            ? data?.["marital-status"]
            : undefined,
        };

        setIsLoading(true);
        try {
          // Perform the API call
          const response = await axios.post(
            "https://cancerreg.ir/api/v1" + PATIENT_INFO,
            formattedData
          );

          if (response.status >= 200 && response.status < 400) {
            // Update the local storage and active index on success
            localStorage.setItem("patient_uid_info", response.data.data.uid);
            setActiveIndex((prevIndex) => prevIndex + 1);
            setLoadingBtn(false);
            toast.success("ثبت شد");
          }
        } catch (error) {
          // Handle errors from the API call
          setLoadingBtn(false);
          // console.error("Error submitting data:", error);
          setIsLoading(false);
          if (error.response && error.response.status === 400) {
            const errorDetails = error.response.data?.errors;
            toast.warning(errorDetails?.[0]?.message || "Invalid inputs");
          }
        }
      }

      if (activeIndex === 1) {
        const {
          surgery,
          "underlying-disease": underlyingDisease,
          "family-history": familyhistory,
          "habit-disease": habitdisease,
          drugs,
          ...restOfData
        } = data;

        const formattedData = {
          ...restOfData,
          patient_uid: patient_uid_info,
          surgeries: data?.surgery ? data.surgery : undefined,
          underlying_diseases: underlyingDisease
            ? underlyingDisease
            : undefined,
          habits: habitdisease ? habitdisease : undefined,
          family_history: familyhistory ? familyhistory : undefined,
          drugs_records: data?.drugs ? data?.drugs : undefined,
        };

        setIsLoading(true);
        try {
          // Perform the API call
          const response = await axios.post(
            "https://cancerreg.ir/api/v1" + PATIENT_RECORDS,
            formattedData
          );

          if (response.status >= 200 && response.status < 400) {
            setActiveIndex((prevIndex) => prevIndex + 1);
            setLoadingBtn(false);
          }
        } catch (error) {
          setLoadingBtn(false);
          // console.error("Error submitting data:", error);
          setIsLoading(false);
        }
      }
    } catch (error) {
      // Handle validation errors
      setIsLoading(false);
      setLoadingBtn(false);
      // console.error("Validation error:", error);
    }
  };

  return (
    <div className="container">
      <HeaderName HeaderName="ثبت نام بیمار جدید" className="mt-5" />
      <div className="steps">
        {[...Array(3)].map((_, i) => (
          <div className="step-item mt-4" key={i}>
            <button
              className={`step-button text-center d-flex align-items-center justify-content-between fw-bold ${
                activeIndex >= i ? "done" : ""
              }`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-expanded={activeIndex === i}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${i + 1}`}
            >
              <div>
                مرحله {i + 1}
                <div className="step-title text-nowrap">
                  {["اطلاعات هویتی", "سوابق بیمار", "اطلاعات بیماری"][i]}
                </div>
              </div>
              <img
                className="m-4 rotate-90"
                src="/images/dropdown.svg"
                alt="dropdown"
              />
            </button>
          </div>
        ))}
      </div>
      <div className="accordion shadow p-2 pb-5 mb-5" id="accordionExample">
        {activeIndex === 2 ? (
          <Step3Form
            patient_uid={patient_uid_info}
            diagnosis_uid={null} // Replace null with actual diagnosis_uid if applicable
            onNext={() => setActiveIndex(activeIndex + 1)}
          />
        ) : activeIndex === 3 ? (
          <div>
            <div className="card text-center">
              <div className="card-body ">
                <h5 className="card-title text-success mb-4">
                  ثبت نام بیمار با موفقیت انجام شد
                </h5>
                <p className="card-text mb-4">
                  برای تکمیل اطلاعات بر روی دکمه زیر کلیک نمایید{" "}
                </p>
                <a
                  href={`patients-lists/${patient_uid_info}`}
                  className="btn btn-primary"
                  onClick={() =>
                    localStorage.setItem("defaultActiveKey", "تصویربرداری")
                  }
                >
                  تکمیل اطلاعات
                </a>
              </div>
            </div>
          </div>
        ) : activeIndex === 0 ? (
          <ReusableForm
            activeIndex={activeIndex}
            isLoading={isLoading}
            onlyPost={true}
            isEditable={false}
            fields={formFielsIdentity}
            formSchema={generateReusableSchema(formFielsIdentity)}
            onSubmit={handleFormSubmit}
            inputsPerRow={[2, 3, 2, 2, 2, 2, 3, 2, 1]}
            loadingBtn={loadingBtn}
          />
        ) : (
          <ReusableForm
            activeIndex={activeIndex}
            isLoading={isLoading}
            onlyPost={true}
            isEditable={false}
            fields={formPatientsFields}
            formSchema={generateReusableSchema(formPatientsFields)}
            onSubmit={handleFormSubmit}
            inputsPerRow={[1, 2, 2, 3, 1]}
            loadingBtn={loadingBtn}
          />
        )}
      </div>
    </div>
  );
};

export default StepperBootstrap;
