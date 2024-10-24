import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stepper.css";
import HeaderName from "../components/HeaderName";
import ReusableForm from "../ReusableForm/ReusableForm";
import {
  formFielsIdentity,
  formPatientsFields,
  formPatientsInformationFields,
  generateReusableSchema,
} from "../form-fields/FormFields";

const StepperBootstrap = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFormSubmit = (data) => {
    try {
      // Dynamically generate the schema based on the current step's form fields
      const schema = generateReusableSchema(
        activeIndex === 0
          ? formFielsIdentity
          : activeIndex === 1
          ? formPatientsFields
          : formPatientsInformationFields
      );

      schema.parse(data); // Validate the form data with the generated schema

      console.log("Form data is valid for step:", activeIndex, data);

      // If form is valid, proceed to the next step
      if (activeIndex < 2) {
        setActiveIndex(activeIndex + 1); // Move to the next step if there is one
      } else {
        console.log("Final form submission:", data);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
      } else {
        console.log("Unexpected error:", error);
      }
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
              onClick={() => handleStepClick(i)}
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
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`collapse ${activeIndex === i ? "show" : ""}`}
          >
            <ReusableForm
              fields={
                activeIndex === 0
                  ? formFielsIdentity
                  : activeIndex === 1
                  ? formPatientsFields
                  : formPatientsInformationFields
              }
              formSchema={generateReusableSchema(
                activeIndex === 0
                  ? formFielsIdentity
                  : activeIndex === 1
                  ? formPatientsFields
                  : formPatientsInformationFields
              )}
              onSubmit={handleFormSubmit}
              inputsPerRow={
                activeIndex === 0
                  ? [2, 3, 2, 2, 2, 2, 3, 2, 1]
                  : activeIndex === 1
                  ? [1, 2, 2, 3, 1, 1, 1, 1]
                  : [1]
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperBootstrap;
