import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stepper.css";
import HeaderName from "../components/HeaderName";

const StepperBootstrap = () => {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleStepClick = (index) => {
    setProgress((index * 100) / 2);
    setActiveIndex(index);
  };

  return (
    <div className="container">
      <HeaderName HeaderName="ثبت نام بیمار جدید" className="mt-5" />
      <div className="steps">
        {[...Array(3)].map((_, i) => (
          <div className="step-item mt-4" key={i}>
            <button
              className={`step-button text-center fw-bold ${
                activeIndex >= i ? "done" : ""
              }`}
              type="button"
              onClick={() => handleStepClick(i)}
              aria-expanded={activeIndex === i}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${i + 1}`}
            >
              مرحله {i + 1}
              <div className="step-title text-nowrap">
                {["اطلاعات هویتی", "سوابق بیمار", "اطلاعات بیماری"][i]}
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="accordion" id="accordionExample">
        {[...Array(3)].map((_, i) => (
          <div className="card" key={i}>
            <div id={`heading${i + 1}`}>Step {i + 1}</div>
            <div
              id={`collapse${i + 1}`}
              className={`collapse ${activeIndex === i ? "show" : ""}`}
              aria-labelledby={`heading${i + 1}`}
              data-bs-parent="#accordionExample"
            >
              <div className="card-body">محتوا</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperBootstrap;
