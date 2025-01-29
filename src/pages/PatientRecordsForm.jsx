import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect"; // Import MultiSelect
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

  const patientUid = uid;
  const patientApiUrl = `https://cancerreg.ir/api/v1/patient/patient-records/${patientUid}/`;
  const dropdownApis = {
    underlying_diseases:
      "https://cancerreg.ir/api/v1/common/underlying-disease/",
    habits: "https://cancerreg.ir/api/v1/common/habit-disease/",
    family_history: "https://cancerreg.ir/api/v1/common/family-history/",
    surgeries: "https://cancerreg.ir/api/v1/common/surgery/",
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
      .then((data) => {
        console.log("data?.data data?.data", data?.data);
        setPatient(data?.data);
      });

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
          const selectedValues = patient[key]?.map((item) =>
            dropdownData[key]?.find((option) => option.name === item)
          );
          if (selectedValues) {
            setPatient((prev) => ({ ...prev, [key]: selectedValues }));
          }
        }
      });
    }
  }, [patient, dropdownData]);

  const handleChange = (e, field) => {
    const selectedValues = e.value; // e.value will be an array of selected objects from MultiSelect

    // Ensure you're updating both patient and updatedFields with the correct value
    setUpdatedFields((prev) => ({ ...prev, [field]: selectedValues }));

    if (dropdownApis[field]) {
      // Update `patient` with full objects from selected items (not just `uid`)
      setPatient((prev) => ({
        ...prev,
        [field]: selectedValues.map((selected) => selected.name), // Storing the names of selected options
      }));
    } else {
      // If not a dropdown field, update the field directly with the new value
      setPatient((prev) => ({ ...prev, [field]: e.target.value }));
    }
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
            className={`${
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
            >
              <label>{dropdownLabels[field]}</label>

              {dropdownApis[field] ? (
                <MultiSelect
                  value={patient[field]?.map((item) => item?.uid)} // The selected values
                  options={dropdownData[field]}
                  onChange={(e) => handleChange(e, field)}
                  optionLabel="name"
                  placeholder={`انتخاب ${dropdownLabels[field]}`}
                  className={`custom-dropdown ${
                    classNameMapping[field] || "w-100"
                  }`}
                  disabled={isFormDisabled}
                  filter
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
