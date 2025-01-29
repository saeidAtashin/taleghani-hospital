import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PatientForm = () => {
  const [patient, setPatient] = useState(null);
  const [genders, setGenders] = useState([]);
  const [dropdownData, setDropdownData] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [startDateObj, setstartDateObj] = useState(null);
  const patientUid = "ef5b7f1f-90b7-4b97-b684-f8670752fb8b";
  const patientApiUrl = `https://cancerreg.ir/api/v1/patient/patient-info/${patientUid}/`;
  const dropdownApis = {
    gender: "https://cancerreg.ir/api/v1/common/gender/",
    num_children: "https://cancerreg.ir/api/v1/common/num-of-children/",
    major_field: "https://cancerreg.ir/api/v1/common/major-field/",
    education: "https://cancerreg.ir/api/v1/common/education/",
    residential_city: "https://cancerreg.ir/api/v1/common/city/",
    birth_city: "https://cancerreg.ir/api/v1/common/city/",
    job: "https://cancerreg.ir/api/v1/common/job/",
    marital_status: "https://cancerreg.ir/api/v1/common/marital-status/",
  };

  const dropdownLabels = {
    gender: "جنسیت",
    marital_status: "وضعیت تأهل",
    job: "شغل",
    num_children: "تعداد فرزندان",
    major_field: "رشته تحصیلی",
    education: "تحصیلات",
    residential_city: "شهر محل سکونت",
    birth_city: "شهر محل تولد",
  };

  const classNameMapping = {
    gender: "w-100",
    marital_status: "w-100",
    num_children: "w-100",
    education: "w-25 d-flex flex-clumn",
    major_field: "w-25 d-flex flex-clumn",
    job: "w-100",
    birth_city: "w-100",
    residential_city: "w-100",
  };
  const sortedDropdownKeys = Object.keys(dropdownLabels);

  const handleStartDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];

      setstartDateObj(date);
      setPatient((prev) => ({ ...prev, birth_date: formattedDate }));
      setUpdatedFields((prev) => ({ ...prev, birth_date: formattedDate }));
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
    }).then((res) => res.json());
  };

  console.log("sortedDropdownKeys", sortedDropdownKeys);
  if (!patient || Object.keys(dropdownData).some((key) => !dropdownData[key]))
    return <p>Loading...</p>;

  return (
    <div className="p-4 d-flex flex-wrap">
      <div className="p-field w-100 d-flex flex-column mb-4">
        <label>کد ملی</label>
        <InputText
          value={patient.national_id}
          onChange={(e) => handleChange(e, "first_name")}
        />
      </div>

      <div className="p-field w-100 d-flex gap-4 mb-4">
        <div className="p-field d-flex flex-column w-50">
          <label>نام</label>
          <InputText
            value={patient.first_name}
            onChange={(e) => handleChange(e, "first_name")}
          />
        </div>
        <div className="p-field d-flex flex-column w-50">
          <label>نام خانوادگی</label>
          <InputText
            value={patient.last_name}
            onChange={(e) => handleChange(e, "last_name")}
          />
        </div>
      </div>

      <div className="d-flex flex-column my-3">
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
          onChange={handleStartDateChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تاریخ تولد را انتخاب کنید"
          className="p-2 border rounded"
          inputClass="w-full p-2 text-end w-100 border rounded"
          position="bottom-right"
        />
      </div>

      {sortedDropdownKeys.map((field) => (
        <div
          className={`   ${
            dropdownLabels[field] === "رشته تحصیلی" ? "w-50" : "w-100"
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
                  classNameMapping[field] || "w-50"
                }`}
              />
            ) : (
              <InputText
                value={patient[field] || ""}
                onChange={(e) => handleChange(e, field)}
                placeholder={`لطفا ${dropdownLabels[field]} را وارد کنید`}
                className="custom-input"
              />
            )}
          </div>
        </div>
      ))}

      <Button label="Save" onClick={handleSubmit} />
    </div>
  );
};

export default PatientForm;
