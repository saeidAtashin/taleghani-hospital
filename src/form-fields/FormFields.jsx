import { z } from "zod";

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
            ? z.string().min(1, `${field.label} را انتخاب کنید`)
            : z
                .string()
                .optional()
                .default(field.defaultValue || "");
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
                .refine(
                  (val) => !isNaN(Date.parse(val)),
                  `${field.label} تاریخ معتبری نیست`
                )
            : z.string().optional();
          break;

        case "number":
          schema[field.name] = field.required
            ? z.number().min(0, `${field.label} باید عددی مثبت باشد`)
            : z.number().optional();
          break;

        case "doubleinput":
          schema[field.name] = z
            .array(
              z.object(
                field?.subfields?.reduce((subfieldSchema, subfield) => {
                  subfieldSchema[subfield.name] = subfield.required
                    ? z.string().min(1, `${subfield.label} را وارد نمایید`)
                    : z.string().optional();
                  return subfieldSchema;
                }, {})
              )
            )
            .optional();
          break;

        default:
          console.warn(`Unknown field type "${field.type}" encountered.`);
          schema[field.name] = z.any().optional(); // Fallback for unknown types
      }
      return schema;
    }, {})
  );

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
    name: "referring_doctor",
    placeholder: "نام پزشک را وارد نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "text",
    label: "نام",
    name: "first_name",
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
    name: "birth_date",
    options: [
      { value: "ادیت", label: "ادیت" },
      { value: "ادیت2", label: "ادیت2" },
      { value: "ادیت3", label: "ادیت3" },
    ],
    placeholder: "تاریخ تولد را انتحاب نمایید",
    defaultValue: "",
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
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "وضعیت تاهل",
    name: "marital_status",
    options: [
      { value: "مجرد", label: "مجرد" },
      { value: "متاهل", label: "متاهل" },
    ],
    placeholder: "وضعیت تاهل را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "استان محل تولد",
    name: "province",
    options: [
      { value: "استان1", label: "استان1" },
      { value: "استان2", label: "استان2" },
      { value: "استان3", label: "استان3" },
    ],
    placeholder: "استان  را انتخاب نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "شهر محل تولد",
    name: "birth_city",
    options: [
      { value: "شهر1", label: "شهر1" },
      { value: "شهر2", label: "شهر2" },
      { value: "شهر3", label: "شهر3" },
    ],
    placeholder: "شهر را انتخاب نمایید",
    defaultValue: "",
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
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "شهر محل زندگی",
    name: "residential_city",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
    ],
    placeholder: "شهر محل زندگی را انتخاب نمایید",
    defaultValue: "",
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
    name: "tell_number",
    placeholder: "شماره تلفن ثابت  را وارد نمایید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "سطح تحصیلات",
    name: "education",
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
    name: "major_field",
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
    name: "num_children",
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
    name: "death_date",
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
    name: "address",
    placeholder: "آدرس بیمار را وارد نمایید",
    defaultValue: "",
    required: false,
  },
];

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
    append: "cm",
  },
  {
    type: "text",
    label: "وزن",
    name: "weight",
    placeholder: "وزن بیمار را  وارد نمایید",
    defaultValue: "",
    required: false,
    append: "kg",
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
    name: "underlying-disease",
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
    name: "habit-disease",
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
    name: "family-history",
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
    name: "surgery",
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
    type: "doubleinput", // Dynamic pair input type
    label: "سوابق دارویی",
    name: "drugs",

    subfields: [
      {
        label: "نام دارو",
        name: "drug_name",
        placeholder: " نام دارو",
      },
      {
        label: "دور دارو",
        name: "drug_dose",
        placeholder: " دور دارو",
      },
    ],
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
      { value: "Solid", label: "Solid" },
      { value: "non Solid", label: "non Solid" },
    ],
    placeholder: "نوع سرطان بیمار را انتخاب نمایید",
    defaultValue: "",
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
    message: "test",
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

export const InnerAzmayesh = [
  {
    type: "text",
    label: "تاریخ",
    name: "date",
    placeholder: "تاریخ را وارد نمایید",
    defaultValue: "",
    required: true,
    message: "test",
  },
  {
    type: "select",
    label: "Blood Group",
    name: "Blood-Group",
    options: [
      { value: "Solid", label: "Solid" },
      { value: "non Solid", label: "non Solid" },
    ],
    placeholder: "از زیرمنو انتخاب کنید",
    defaultValue: "",
    required: false,
  },
  {
    type: "select",
    label: "RH",
    name: "RH",
    options: [
      { value: "Solid", label: "Solid" },
      { value: "non Solid", label: "non Solid" },
    ],
    placeholder: "از زیرمنو انتخاب کنید",
    defaultValue: "",
    required: false,
  },
];

export const solidFields = [
  { type: "text", label: "Field 1", name: "field1_solid", required: true },
  { type: "text", label: "Field 2", name: "field2_solid", required: true },
  { type: "text", label: "Field 3", name: "field3_solid", required: true },
];

export const nonSolidFields = [
  { type: "text", label: "Field 1", name: "field1_nonSolid", required: true },
  { type: "text", label: "Field 2", name: "field2_nonSolid", required: true },
  { type: "text", label: "Field 3", name: "field3_nonSolid", required: true },
  { type: "text", label: "Field 4", name: "field4_nonSolid", required: true },
  { type: "text", label: "Field 5", name: "field5_nonSolid", required: true },
];
