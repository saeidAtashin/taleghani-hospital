import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Chip } from "primereact/chip";

const PatientRecordsForm = () => {
  const [patient, setPatient] = useState({
    height: "",
    weight: "",
    bmi: "",
    bsa: "",
    treating_physician: "",
    underlying_diseases: [],
    habits: [],
    family_history: [],
    surgeries: [],
    drugs_records: [],
    refer_reason: "",
    description: "",
  });
  const [dropdownData, setDropdownData] = useState({
    underlying_diseases: [],
    habits: [],
    family_history: [],
    surgeries: [],
  });
  const [updatedFields, setUpdatedFields] = useState({});
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [drugName, setDrugName] = useState("");
  const [drugDose, setDrugDose] = useState("");

  const { uid } = useParams();

  const patientUid = uid;
  const patientApiUrl = `https://cancerreg.ir/api/v1/patient/patient-records/${patientUid}/`;
  const dropdownApis = {
    underlying_diseases:
      "https://cancerreg.ir/api/v1/common/underlying-disease/",
    habits: "https://cancerreg.ir/api/v1/common/habit-disease/",
    family_history: "https://cancerreg.ir/api/v1/common/family-history/",
    surgeries: "https://cancerreg.ir/api/v1/common/surgery/",
  };
  const dropdownLabels = {
    height: "قد",
    weight: "وزن",
    bmi: "BMI",
    bsa: "BSA",
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

  const handleAddDrug = () => {
    if (drugName && drugDose) {
      const newDrugRecord = { name: drugName, dose: parseFloat(drugDose) };
      const updatedDrugsRecords = [
        ...(patient.drugs_records || []),
        newDrugRecord,
      ];
      setPatient((prev) => ({
        ...prev,
        drugs_records: updatedDrugsRecords,
      }));
      setDrugName("");
      setDrugDose("");
    }
  };

  const handleRemoveDrug = (drugNameToRemove) => {
    const updatedDrugsRecords = patient.drugs_records.filter(
      (drug) => drug.name !== drugNameToRemove
    );
    setPatient((prev) => ({
      ...prev,
      drugs_records: updatedDrugsRecords,
    }));
  };

  const sortedDropdownKeys = Object.keys(dropdownLabels);

  const toggleForm = () => {
    setIsFormDisabled((prev) => !prev);
  };

  useEffect(() => {
    fetch(patientApiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          const formattedData = { ...data.data };

          Object.keys(dropdownApis).forEach((field) => {
            if (Array.isArray(data.data[field])) {
              formattedData[field] = data.data[field].map((item) => ({
                value: item.id,
                label: item.name,
              }));
            }
          });

          setPatient(formattedData);

          const initialUpdatedFields = {};
          Object.keys(dropdownApis).forEach((field) => {
            if (Array.isArray(formattedData[field])) {
              initialUpdatedFields[field] = formattedData[field].map(
                (item) => item.value
              );
            }
          });
          setUpdatedFields(initialUpdatedFields);
        }
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
        toast.error("خطا در دریافت اطلاعات بیمار");
      });

    Object.entries(dropdownApis).forEach(([key, url]) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const fetchedOptions = data?.data?.results?.map((item) => ({
            value: item.id,
            label: item.name,
          }));

          setDropdownData((prevOptions) => ({
            ...prevOptions,
            [key]: fetchedOptions || [],
          }));
        })
        .catch((error) => {
          console.error(`Error fetching ${key} data:`, error);
        });
    });
  }, []);

  const handleChange = (e, field) => {
    if (dropdownApis[field]) {
      const selectedValues = e.value || [];
      const formattedValues = selectedValues.map((value) => {
        const option = dropdownData[field].find((opt) => opt.value === value);
        return {
          value: value,
          label: option?.label || "",
        };
      });

      setPatient((prev) => ({
        ...prev,
        [field]: formattedValues,
      }));

      setUpdatedFields((prev) => ({
        ...prev,
        [field]: selectedValues,
      }));
    } else {
      const newValue = e?.target?.value;

      setPatient((prev) => {
        const updatedPatient = { ...prev, [field]: newValue };

        if (
          (field === "height" || field === "weight") &&
          updatedPatient.height &&
          updatedPatient.weight
        ) {
          const height = parseFloat(updatedPatient.height) / 100;
          const weight = parseFloat(updatedPatient.weight);

          if (!isNaN(height) && !isNaN(weight) && height > 0 && weight > 0) {
            updatedPatient.bmi = (weight / (height * height)).toFixed(2);
            updatedPatient.bsa = Math.sqrt((height * weight) / 36).toFixed(2);
          }
        }

        return updatedPatient;
      });

      setUpdatedFields((prev) => {
        if (prev[field] === newValue) {
          return prev;
        }
        return { ...prev, [field]: newValue };
      });
    }
  };

  const handleSubmit = () => {
    const apiData = {
      ...updatedFields,
      patient_uid: uid,
      drugs_records: patient?.drugs_records,
    };

    fetch(patientApiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
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
              dropdownLabels?.[field] === "قد" ||
              dropdownLabels?.[field] === "وزن" ||
              dropdownLabels?.[field] === "BSA" ||
              dropdownLabels?.[field] === "BMI"
                ? "w-50"
                : "w-100"
            }`}
          >
            {dropdownLabels?.[field] === "سوابق دارویی" ? (
              <div className="p-field mb-4">
                <label>سوابق دارویی</label>
                {
                  <div className="d-flex gap-2 w-100">
                    <InputText
                      disabled={isFormDisabled}
                      value={drugName}
                      onChange={(e) => setDrugName(e.target.value)}
                      placeholder="نام دارو"
                    />
                    <InputText
                      disabled={isFormDisabled}
                      value={drugDose}
                      onChange={(e) => setDrugDose(e.target.value)}
                      placeholder="دوز دارو"
                    />
                    <Button
                      disabled={isFormDisabled}
                      label="افزودن"
                      className="rounded"
                      onClick={handleAddDrug}
                    />
                  </div>
                }
                <div className="mt-3">
                  {patient?.drugs_records?.map((drug, index) => (
                    <Chip
                      label={` ${drug.name} (${drug.dose} mg )`}
                      removable={!isFormDisabled}
                      key={index}
                      value={`${drug.name} (${drug.dose} mg)`}
                      className="mx-2 "
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        !isFormDisabled && handleRemoveDrug(drug.name)
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`p-field d-flex flex-column mb-3 ${
                  dropdownLabels?.[field] === "رشته تحصیلی" ? "flex-row" : ""
                }`}
              >
                <label>{dropdownLabels?.[field]}</label>

                {dropdownApis?.[field] ? (
                  <MultiSelect
                    value={patient[field]?.map((item) => item.value) || []}
                    options={dropdownData[field] || []}
                    onChange={(e) => {
                      handleChange(e, field);
                    }}
                    multiple
                    optionLabel="label"
                    optionValue="value"
                    maxSelectedLabels={10}
                    placeholder={`انتخاب ${dropdownLabels[field]}`}
                    className={`custom-dropdown ${
                      classNameMapping[field] || "w-100"
                    }`}
                    disabled={isFormDisabled}
                    filter
                  />
                ) : (
                  <InputText
                    value={patient?.[field] || ""}
                    onChange={(e) => {
                      if (
                        (field === "height" || field === "weight") &&
                        !/^\d*\.?\d*$/.test(e.target.value)
                      ) {
                        return;
                      }
                      handleChange(e, field);
                    }}
                    placeholder={`لطفا ${dropdownLabels?.[field]} را وارد کنید`}
                    className={
                      dropdownLabels?.[field] === "BSA" ||
                      dropdownLabels?.[field] === "BMI"
                        ? "custom-disabled"
                        : ""
                    }
                    disabled={
                      dropdownLabels?.[field] === "BSA" ||
                      dropdownLabels?.[field] === "BMI"
                        ? true
                        : isFormDisabled
                    }
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecordsForm;
