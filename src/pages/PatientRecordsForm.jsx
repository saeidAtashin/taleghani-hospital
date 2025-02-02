import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Chip } from "primereact/chip";

const PatientRecordsForm = () => {
  const [patient, setPatient] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
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
        setPatient(data?.data);
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
            [key]: fetchedOptions, // Correcting fieldName.name issue
          }));
        })
        .catch();
    });
  }, []);

  useEffect(() => {
    if (patient && dropdownData) {
      const updatedPatient = { ...patient };
      let hasChanges = false;

      Object.keys(dropdownData).forEach((key) => {
        if (dropdownData[key] && patient[key]) {
          const selectedValues = patient[key]?.map((item) =>
            dropdownData[key]?.find((option) => option?.name === item)
          );

          if (
            selectedValues &&
            !areArraysEqual(updatedPatient[key], selectedValues)
          ) {
            updatedPatient[key] = selectedValues;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setPatient(updatedPatient);
      }
    }
  }, [patient, dropdownData]);

  const areArraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const handleChange = (e, field) => {
    console.log("e in e", e);
    console.log("field in e", field);
    if (dropdownApis[field]) {
      setPatient((prev) => {
        const newValues = e.value.map((selected) => selected?.label);

        // Prevent unnecessary re-renders
        if (JSON.stringify(prev[field]) === JSON.stringify(newValues)) {
          return prev;
        }

        return {
          ...prev,
          [field]: newValues, // Store labels for UI
        };
      });

      setUpdatedFields((prev) => {
        const newValues = e.value.map((selected) => selected?.value);

        if (JSON.stringify(prev[field]) === JSON.stringify(newValues)) {
          return prev;
        }

        return {
          ...prev,
          [field]: newValues, // Store values for API submission
        };
      });
    } else {
      setPatient((prev) => {
        if (prev[field] === e.target.value) {
          return prev;
        }
        return { ...prev, [field]: e.target.value };
      });

      setUpdatedFields((prev) => {
        if (prev[field] === e.target.value) {
          return prev;
        }
        return { ...prev, [field]: e.target.value };
      });
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
        drugs_records: patient?.drugs_records,
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
              dropdownLabels[field] === "BSA" ||
              dropdownLabels[field] === "BMI"
                ? "w-50"
                : "w-100"
            }`}
          >
            {dropdownLabels[field] === "سوابق دارویی" ? (
              <div className="p-field mb-4">
                <label>سوابق دارویی</label>
                {!isFormDisabled && (
                  <div className="d-flex gap-2 w-100">
                    <InputText
                      value={drugName}
                      onChange={(e) => setDrugName(e.target.value)}
                      placeholder="نام دارو"
                    />
                    <InputText
                      value={drugDose}
                      onChange={(e) => setDrugDose(e.target.value)}
                      placeholder="دوز دارو"
                    />
                    <Button
                      label="افزودن"
                      className="rounded"
                      onClick={handleAddDrug}
                    />
                  </div>
                )}
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
                  dropdownLabels[field] === "رشته تحصیلی" ? "flex-row" : ""
                }`}
              >
                <label>{dropdownLabels[field]}</label>

                {dropdownApis[field] ? (
                  <MultiSelect
                    value={
                      dropdownData.underlying_diseases?.filter((option) =>
                        patient.underlying_diseases?.includes(option.label)
                      ) || []
                    }
                    options={dropdownData.underlying_diseases || []}
                    onChange={(e) => {
                      console.log("e", e);
                      handleChange(e, field);
                    }}
                    multiple
                    optionLabel="label"
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
                    value={patient[field] || ""}
                    onChange={(e) => handleChange(e, field)}
                    placeholder={`لطفا ${dropdownLabels[field]} را وارد کنید`}
                    className={
                      dropdownLabels[field] === "BSA" ||
                      dropdownLabels[field] === "BMI"
                        ? "custom-disabled"
                        : ""
                    }
                    disabled={
                      dropdownLabels[field] === "BSA" ||
                      dropdownLabels[field] === "BMI"
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
