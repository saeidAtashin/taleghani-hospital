import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const PatientRecordsForm = () => {
  const [patient, setPatient] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [startDateObj, setstartDateObj] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const patientUid = "ef5b7f1f-90b7-4b97-b684-f8670752fb8b";
  const patientApiUrl = `https://cancerreg.ir/api/v1/patient/patient-records/${patientUid}/`;
  const dropdownApis = {
    underlying_diseases:
      "https://cancerreg.ir/api/v1/common/underlying-diseases/",
    num_children: "https://cancerreg.ir/api/v1/common/num-of-children/",
    major_field: "https://cancerreg.ir/api/v1/common/major-field/",
    education: "https://cancerreg.ir/api/v1/common/education/",
    residential_city: "https://cancerreg.ir/api/v1/common/city/",
    birth_city: "https://cancerreg.ir/api/v1/common/city/",
    job: "https://cancerreg.ir/api/v1/common/job/",
    marital_status: "https://cancerreg.ir/api/v1/common/marital-status/",
  };

  const dropdownLabels = {
    height: "قد",
    weight: "وزن",
    bmi: "bmi",
    bsa: "bsa",
    treating_physician: "نام پزشک معالج",
    bsa: "bsa",
    underlying_diseases: "بیماری‌های زمینه‌ای",
    habits: "عادات",
    family_history: "سوابق خانوادگی",
    surgeries: "سوابق جراحی",
    drugs_records: "سوابق دارویی",
    refer_reason: "دلیل مراجعه",
    description: "توضیحات",

    // national_id:"کدملی",
    // marital_status: "وضعیت تأهل",
    // job: "شغل",
    // residential_city: "شهر محل سکونت",
    // birth_city: "شهر محل تولد",
    // address: "آدرس",
    // phone_number: "شماره تلفن همراه",
    // tell_number: "شماره تلفن ثابت",
    // major_field: "رشته تحصیلی",
    // education: "تحصیلات",
    // num_children: "تعداد فرزندان",
    // referring_doctor: "پزشک معالج",
  };

  const classNameMapping = {
    gender: "w-100",
    height: "w-50",
    weight: "w-50",

    // marital_status: "w-100",
    // num_children: "w-100",
    // education: "w-100 d-flex flex-clumn",
    // major_field: "w-100 d-flex flex-clumn",
    // job: "w-100",
    // birth_city: "w-100",
    // residential_city: "w-100",
  };
  const sortedDropdownKeys = Object.keys(dropdownLabels);

  const toggleForm = () => {
    setIsFormDisabled((prev) => !prev);
  };

  const handleDateChange = (date, field) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      setPatient((prev) => ({ ...prev, [field]: formattedDate }));
      setUpdatedFields((prev) => ({ ...prev, [field]: formattedDate }));
    }
  };

  useEffect(() => {
    fetch(patientApiUrl)
      .then((res) => res.json())
      .then((data) => setPatient(data?.data));

    Object.keys(dropdownApis).forEach((key) => {
      fetch(dropdownApis[key])
        .then((res) => res.json())
        .then((data) => {
          setDropdownData((prev) => ({ ...prev, [key]: data.data.results }));
        });
    });
  }, []);

  useEffect(() => {
    if (patient) {
      Object.keys(dropdownData).forEach((key) => {
        if (dropdownData[key]) {
          const selectedValue = dropdownData?.[key]?.find(
            (item) => item.name === patient[key]
          );
          if (selectedValue) {
            setPatient((prev) => ({ ...prev, [key]: selectedValue.uid }));
          }
        }
      });
    }
  }, [patient, dropdownData]);

  const handleChange = (e, field) => {
    const value = dropdownData[field] ? e.value.uid : e.target.value;
    setPatient((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    fetch(patientApiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatedFields,
        national_id: patient.national_id,
      }),
    }).then((res) => {
      res.json();
      toggleForm();
      toast.success("ویرایش شما انجام شد");
    });
  };

  console.log("sortedDropdownKeys", sortedDropdownKeys);
  if (!patient || Object.keys(dropdownData).some((key) => !dropdownData[key]))
    return <p>Loading...</p>;

  return (
    <div className="p-4 d-flex flex-wrap">
      {isFormDisabled ? (
        <Button
          label={isFormDisabled ? "ویرایش" : "لغو"}
          onClick={toggleForm}
          className="button-outlined rounded mb-3"
        />
      ) : (
        <div className="d-flex gap-3 mb-4">
          <Button
            label="ذخیره"
            onClick={handleSubmit}
            disabled={isFormDisabled}
            className="rounded"
          />
          <Button
            label="لغو"
            onClick={toggleForm}
            disabled={isFormDisabled}
            className="rounded p-button-outlined"
          />
        </div>
      )}
      {/* <div className="p-field w-100 d-flex flex-column mb-4">
        <label>کد ملی</label>
        <InputText
          value={patient.national_id}
          onChange={(e) => handleChange(e, "first_name")}
          disabled={isFormDisabled}
        />
      </div>

      <div className="p-field w-100 d-flex gap-4 mb-4">
        <div className="p-field d-flex flex-column w-50">
          <label>نام</label>
          <InputText
            value={patient.first_name}
            onChange={(e) => handleChange(e, "first_name")}
            disabled={isFormDisabled}
          />
        </div>
        <div className="p-field d-flex flex-column w-50">
          <label>نام خانوادگی</label>
          <InputText
            value={patient.last_name}
            onChange={(e) => handleChange(e, "last_name")}
            disabled={isFormDisabled}
          />
        </div>
      </div> */}

      {/* <div className="d-flex w-100 flex-column my-3">
        <label className="p-col-12 p-md-2" htmlFor="start_date">
          تاریخ تولد:
        </label>
        <DatePicker
          value={
            patient.birth_date
              ? new DateObject({
                  date: patient?.birth_date,
                  calendar: "gregorian",
                })
                  .convert(persian)
                  .format("YYYY/MM/DD")
              : startDateObj
          }
          onChange={(date) => handleDateChange(date, "birth_date")}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تاریخ تولد را انتخاب کنید"
          className="p-2 border rounded"
          inputClass="w-full p-2 text-end w-100 border rounded"
          position="bottom-right"
          disabled={isFormDisabled}
        />
      </div> */}

      <div className="d-flex flex-wrap">
        {sortedDropdownKeys.map((field) => (
          <div
            className={`   ${
              dropdownLabels[field] === "قد" ||
              dropdownLabels[field] === "وزن" ||
              dropdownLabels[field] === "bsa" ||
              dropdownLabels[field] === "bmi"
                ? "w-50"
                : "w-100"
            }`}
          >
            <div
              className={`p-field d-flex flex-column mb-3 ${
                dropdownLabels[field] === "رشته تحصیلی" ? "flex-row" : ""
              }`}
              key={field}
            >
              <label>{dropdownLabels[field]}</label>

              {dropdownApis[field] ? (
                <Dropdown
                  value={dropdownData?.[field]?.find(
                    (item) => item.uid === patient[field]
                  )}
                  options={dropdownData[field]}
                  onChange={(e) => handleChange(e, field)}
                  optionLabel="name"
                  placeholder={`انتخاب ${dropdownLabels[field]}`}
                  className={`custom-dropdown  ${
                    classNameMapping[field] || "w-100"
                  }`}
                  disabled={isFormDisabled}
                />
              ) : (
                <InputText
                  value={patient[field] || ""}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={`لطفا ${dropdownLabels[field]} را وارد کنید`}
                  className={
                    dropdownLabels[field] === "bsa" ||
                    dropdownLabels[field] === "bmi"
                      ? "custom-disabled"
                      : ""
                  }
                  disabled={
                    dropdownLabels[field] === "bsa" ||
                    dropdownLabels[field] === "bmi"
                      ? true
                      : isFormDisabled
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecordsForm;
