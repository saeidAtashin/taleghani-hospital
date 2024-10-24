import { z } from "zod";

export const formFielsIdentity = [
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
    required: false,
  },
  {
    type: "text",
    label: "نام خانوادگی",
    name: "last_name",
    placeholder: "نام خانوادگی بیمار را وارد نمایید",
    defaultValue: "",
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
  },
  {
    type: "text",
    label: "شماره تلفن ثابت",
    name: "phone",
    placeholder: "شماره تلفن ثابت  را وارد نمایید",
    defaultValue: "",
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
  },
  {
    type: "text",
    label: "آدرس",
    name: "address_patient",
    placeholder: "آدرس بیمار را وارد نمایید",
    defaultValue: "",
    required: false,
  },
];

// Dynamically construct the Zod schema based on form fields
export const generateReusableSchema = (formFields) =>
  z.object(
    formFields.reduce((schema, field) => {
      switch (field.type) {
        case "text":
          schema[field.name] = field.required
            ? z.string().min(1, `${field.label} را وارد نمایید`)
            : z.string().optional();
          break;

        case "select":
          schema[field.name] = field.required
            ? z.string().min(1, `Please select a value for ${field.label}`)
            : z.string().optional().default(field.defaultValue);
          break;

        case "checkbox":
          schema[field.name] = field.required
            ? z
                .boolean()
                .refine((val) => val === true, `${field.label} را وارد نمایید`)
            : z.boolean().optional();
          break;

        case "date":
          schema[field.name] = field.required
            ? z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
            : z.string().optional();
          break;

        case "number":
          schema[field.name] = field.required
            ? z.number().min(0, `${field.label} must be a positive number`)
            : z.number().optional();
          break;

        // Add cases for other input types as needed (e.g., radio, date, etc.)
        default:
          schema[field.name] = z.any().optional(); // Fallback for unknown types
      }
      return schema;
    }, {})
  );

export const formPatientsFields = [
  {
    type: "text",
    label: "نام پزشک معالج",
    name: "doctor_name",
    placeholder: "نام  پزشک معالج را وارد نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "قد",
    name: "patient_height",
    placeholder: "قد بیمار را وارد نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "وزن",
    name: "weight",
    placeholder: "وزن بیمار را  وارد نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "BSA",
    name: "BSA",
    placeholder: "طبق قد و وزن محاسبه می‌شود",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "BMI",
    name: "BMI",
    placeholder: "طبق قد و وزن محاسبه می‌شود",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "بیماری‌های زمینه‌ای",
    name: "gender",
    options: [
      { value: "زن", label: "زن" },
      { value: "مرد", label: "مرد" },
    ],
    placeholder: "بیماری‌های زمینه ای را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "عادات",
    name: "rolesec",
    options: [
      { value: "مجرد", label: "مجرد" },
      { value: "متاهل", label: "متاهل" },
    ],
    placeholder: "عادات بیمار را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "سابقه خانوادگی",
    name: "province-birth",
    options: [
      { value: "استان1", label: "استان1" },
      { value: "استان2", label: "استان2" },
      { value: "استان3", label: "استان3" },
    ],
    placeholder: "افراد با سابقه سرطان را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "سوابق جراحی",
    name: "city-birth",
    options: [
      { value: "شهر1", label: "شهر1" },
      { value: "شهر2", label: "شهر2" },
      { value: "شهر3", label: "شهر3" },
    ],
    placeholder: "جراحی‌ها را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "سوابق دارویی",
    name: "province",
    placeholder: "نام دارو",
    required: false,
  },
  {
    type: "text",
    label: "علت مراجعه",
    name: "res",
    placeholder: "علت مراجعه را وارد نمایید",
    required: false,
  },
  {
    type: "text",
    label: "توضیحات",
    name: "desc",
    placeholder: "توضیحات مرتبط به سوابق بیمار را وارد نمایید",
    defaultValue: "",
    required: false,
  },
];

export const formPatientsInformationFields = [
  {
    type: "select",
    label: "نوع بدخیمی",
    name: "rolesec",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
    ],
    placeholder: "نوع سرطان بیمار را انتخاب نمایید",
    defaultValue: "0",
    required: false,
  },
];

export const loginForm = [
  {
    type: "text",
    label: "نام کاربری",
    name: "username",
    placeholder: "نام کاربری را وارد نمایید",
    defaultValue: "",
    required: true,
  },
  {
    type: "text",
    label: "رمز عبور",
    name: "password",
    placeholder: "رمز عبور را وارد نمایید",
    defaultValue: "",
    required: true,
  },
];

export const loginFormSchema = z.object({
  username: z.string().min(1, "نام کاربری را وارد نمایید"),
  password: z.string().min(1, "رمز عبور را وارد نمایید"),
});
