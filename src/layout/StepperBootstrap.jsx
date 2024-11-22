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

  const patient_uid_info = localStorage.getItem("patient_uid_info");

  const transformDataForApi = (data, fields) => {
    let transformedData = {};
    fields.forEach((field) => {
      const { name, name_to_send_api, dontSendApi } = field;
      if (!dontSendApi) {
        if (name_to_send_api) {
          transformedData[name_to_send_api] = data[name];
        } else {
          transformedData[name] = data[name];
        }
      }
    });
    return transformedData;
  };

  const makeApiRequest = async (
    url,
    requestData,
    successCallback,
    errorCallback
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(url, requestData);
      if (successCallback) successCallback(response);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorDetails = error.response.data?.errors;
        toast.warning(errorDetails?.[0]?.message || "Invalid inputs");
      } else {
        toast.warning("An error occurred while submitting data.");
      }
      console.error("Error submitting data:", error);
      if (errorCallback) errorCallback(error);
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    const currentFields =
      activeIndex === 0 ? formFielsIdentity : formPatientsFields;

    try {
      const schema = generateReusableSchema(currentFields);
      schema.parse(data);

      if (activeIndex === 0) {
        const transformedData = transformDataForApi(data, currentFields);
        const url = "https://cancerreg.ir/api/v1" + PATIENT_INFO;

        makeApiRequest(
          url,
          transformedData,
          (response) => {
            localStorage.setItem("patient_uid_info", response?.data?.data?.uid);
            setActiveIndex(activeIndex + 1);
          },
          () => setIsLoading(false)
        );
      }

      if (activeIndex === 1) {
        const transformedData = transformDataForApi(data, currentFields);
        const formattedData = {
          ...transformedData,
          patient_uid: patient_uid_info,
        };

        setIsLoading(true);
        try {
          await axios.post(
            "https://cancerreg.ir/api/v1" + PATIENT_RECORDS,
            formattedData
          );
          setActiveIndex(activeIndex + 1);
        } catch (error) {
          console.error("Error submitting data:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Validation error:", error);
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
        ) : (
          <ReusableForm
            isLoading={isLoading}
            onlyPost={true}
            isEditable={false}
            fields={activeIndex === 0 ? formFielsIdentity : formPatientsFields}
            formSchema={generateReusableSchema(
              activeIndex === 0 ? formFielsIdentity : formPatientsFields
            )}
            onSubmit={handleFormSubmit}
            inputsPerRow={
              activeIndex === 0 ? [2, 3, 2, 2, 2, 2, 3, 2, 1] : [1, 2, 2, 3, 1]
            }
          />
        )}
      </div>
    </div>
  );
};

export default StepperBootstrap;
