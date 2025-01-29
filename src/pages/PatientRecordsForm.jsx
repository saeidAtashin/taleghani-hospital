import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const PatientRecordsForm = () => {
  const [patient, setPatient] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const { uid } = useParams();

  const patientUid = "ef5b7f1f-90b7-4b97-b684-f8670752fb8b";
  const patientApiUrl = `https://cancerreg.ir/api/v1/patient/patient-records/${patientUid}/`;
  const dropdownApis = {
    underlying_diseases:
      "https://cancerreg.ir/api/v1/common/underlying-disease/",
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
  };

  const classNameMapping = {
    gender: "w-100",
    height: "w-50",
    weight: "w-50",
  };
  const sortedDropdownKeys = Object.keys(dropdownLabels);

  const toggleForm = () => {
    setIsFormDisabled((prev) => !prev);
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
        patient_uid: uid,
      }),
    })
      .then(async (res) => {
        const responseData = await res.json();

        if (res.status >= 200 && res.status < 400) {
          setPatient((prev) => ({
            ...prev,
            bmi: responseData?.data?.bmi ?? prev.bmi,
            bmi: responseData?.data?.bsa ?? prev.bsa,
          }));

          toast.success("ویرایش شما انجام شد");
          toggleForm();
        } else {
          toast.error("خطا در ویرایش اطلاعات");
        }
      })
      .catch((error) => {
        console.error("Request Failed:", error);
        toast.error("مشکلی پیش آمد، لطفاً دوباره امتحان کنید.");
      });
  };

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

      <div className="d-flex flex-wrap">
        {sortedDropdownKeys?.map((field, index) => (
          <div
            key={index}
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
