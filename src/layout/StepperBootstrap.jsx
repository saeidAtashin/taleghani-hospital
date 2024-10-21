import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stepper.css";
import HeaderName from "../components/HeaderName";
import ReusableForm from "../ReusableForm/ReusableForm";
import { z } from "zod";

const StepperBootstrap = () => {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleStepClick = (index) => {
    setProgress((index * 100) / 2);
    setActiveIndex(index);
  };

  const formFields = [
    {
      type: "text",
      label: "کد ملی",
      name: "national_id",
      placeholder: "کد ملی بیمار را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "text",
      label: "نام پزشک معرف",
      name: "introducing_doctor",
      placeholder: "نام پزشک را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "text",
      label: "نام",
      name: "name",
      placeholder: "نام بیمار را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "text",
      label: "نام خانوادگی",
      name: "last_name",
      placeholder: "نام خانوادگی بیمار را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "select",
      label: "تاریخ تولد",
      name: "birthdate",
      options: [
        { value: "ادیت", label: "ادیت" },
        { value: "ادیت2", label: "ادیت2" },
        { value: "ادیت3", label: "ادیت3" },
      ],
      placeholder: "تاریخ تولد را انتحاب نمایید",
      defaultValue: "ادیت",
      required: true,
    },

    {
      type: "select",
      label: "جنسیت",
      name: "gender",
      options: [
        { value: "زن", label: "زن" },
        { value: "مرد", label: "مرد" },
      ],
      placeholder: "جنسیت را انتخاب نمایید",
      defaultValue: "مرد",
      required: true,
    },
    {
      type: "select",
      label: "وضعیت تاهل",
      name: "rolesec",
      options: [
        { value: "مجرد", label: "مجرد" },
        { value: "متاهل", label: "متاهل" },
      ],
      placeholder: "وضعیت تاهل را انتخاب نمایید",
      defaultValue: "مجرد",
      required: true,
    },
    {
      type: "select",
      label: "استان محل تولد",
      name: "province-birth",
      options: [
        { value: "استان1", label: "استان1" },
        { value: "استان2", label: "استان2" },
        { value: "استان3", label: "استان3" },
      ],
      placeholder: "استان  را انتخاب نمایید",
      defaultValue: "استان1",
      required: true,
    },
    {
      type: "select",
      label: "شهر محل تولد",
      name: "city-birth",
      options: [
        { value: "شهر1", label: "شهر1" },
        { value: "شهر2", label: "شهر2" },
        { value: "شهر3", label: "شهر3" },
      ],
      placeholder: "شهر را انتخاب نمایید",
      defaultValue: "شهر1",
      required: true,
    },
    {
      type: "select",
      label: "استان محل زندگی",
      name: "province",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "استان محل زندگی را انتخاب نمایید",
      defaultValue: "0",
      required: true,
    },
    {
      type: "select",
      label: "شهر محل زندگی",
      name: "city",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "شهر محل زندگی را انتخاب نمایید",
      defaultValue: "3",
      required: true,
    },

    // {
    //   type: "checkbox",
    //   label: "Accept terms and conditions",
    //   name: "termsAccepted",
    //   defaultValue: false,
    // },

    {
      type: "text",
      label: "شماره تلفن همراه",
      name: "phone_number",
      placeholder: "شماره تلفن همراه را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "text",
      label: "شماره تلفن ثابت",
      name: "phone",
      placeholder: "شماره تلفن ثابت  را وارد نمایید",
      defaultValue: "",
      required: true,
    },
    {
      type: "select",
      label: "سطح تحصیلات",
      name: "edu",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "سطح تحصیلات را انتخاب نمایید",
      defaultValue: "0",
      required: true,
    },
    {
      type: "select",
      label: "رشته تحصیلی",
      name: "edu2",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "رشته تحصیلی را انتخاب نمایید",
      defaultValue: "0",
      required: true,
    },
    {
      type: "select",
      label: "شغل",
      name: "job",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "شغل بیمار را انتخاب نمایید",
      defaultValue: "0",
      required: true,
    },
    {
      type: "select",
      label: "تعداد فرزندان",
      name: "child_number",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "تعداد فرزندان را انتخاب نمایید ",
      defaultValue: "0",
      required: true,
    },
    {
      type: "select",
      label: "تاریخ فوت",
      name: "rolesec",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
      placeholder: "تاریخ فوت را انتخاب نمایید",
      defaultValue: "0",
      required: true,
    },
    {
      type: "text",
      label: "آدرس",
      name: "address_patient",
      placeholder: "آدرس بیمار را وارد نمایید",
      defaultValue: "",
      required: true,
    },
  ];

  const formSchema = z.object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(20, "Username must be 20 characters or less"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user", "guest"], "Role is required"),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms"),
  });

  const handleFormSubmit = (data) => {
    console.log("Submitted Data:", data);
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
      <div className="accordion" id="accordionExample">
        {[...Array(3)].map((_, i) => (
          <div className={`collapse ${activeIndex === i ? "show" : ""}`}>
            <ReusableForm
              fields={formFields}
              formSchema={formSchema}
              onSubmit={handleFormSubmit}
              inputsPerRow={[2, 3, 2, 2, 2, 2, 3, 2, 1]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperBootstrap;
