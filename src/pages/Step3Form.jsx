import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";

const Step3Form = ({ patient_uid, onNext }) => {
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({
    lymph_nodes: [],
    spleen: "",
    b_symptoms: "",
    stage: "",
    primary_tumors: [],
    nearby_lymphs: [],
    metastasis: [],
  });
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  // Fetch diagnosis options on component mount
  useEffect(() => {
    const fetchDiagnosisOptions = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/common/diagnosis/"
        );
        const options = response.data.data.results.map((item) => ({
          label: item.name,
          value: item.uid,
        }));
        setDiagnosisOptions(options);
      } catch (error) {
        console.error("Error fetching diagnosis options:", error);
      }
    };

    fetchDiagnosisOptions();
  }, []);

  const stageOptions = [
    { label: "A-I", value: "A-I" },
    { label: "B-I", value: "B-I" },
    { label: "C-I", value: "C-I" },
  ];

  const b_symptomsOptions = [
    { label: "+", value: "+" },
    { label: "-", value: "-" },
  ];

  // b_symptomsOptions

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { site: "", size: "", description: "" }],
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleSubmit = async () => {
    const diseaseData =
      formType === "NON_SOLID"
        ? {
            lymph_nodes: formData.lymph_nodes.filter(
              (node) =>
                node.site.trim() || node.size.trim() || node.description.trim()
            ),
            spleen: formData.spleen.trim() || undefined,
            b_symptoms: formData.b_symptoms.trim() || undefined,
          }
        : {
            primary_tumors:
              formData.primary_tumors.length > 0
                ? formData.primary_tumors.filter(
                    (tumor) =>
                      tumor.site.trim() ||
                      tumor.size.trim() ||
                      tumor.description.trim()
                  )
                : undefined,
            nearby_lymphs:
              formData?.nearby_lymphs?.length > 0
                ? formData.nearby_lymphs.filter(
                    (lymph) =>
                      lymph.site.trim() ||
                      lymph.size.trim() ||
                      lymph.description.trim()
                  )
                : undefined,
            metastasis:
              formData.metastasis.length > 0
                ? formData.metastasis.filter(
                    (met) =>
                      met.site.trim() ||
                      met.size.trim() ||
                      met.description.trim()
                  )
                : undefined,
          };

    // Remove empty arrays or undefined values from diseaseData
    const cleanedDiseaseData = Object.keys(diseaseData).reduce((acc, key) => {
      if (Array.isArray(diseaseData[key]) && diseaseData[key].length > 0) {
        acc[key] = diseaseData[key];
      } else if (diseaseData[key] !== undefined) {
        acc[key] = diseaseData[key];
      }
      return acc;
    }, {});

    // Construct the payload conditionally including disease_data
    const payload = {
      type: formType,
      diagnosis_uid: selectedDiagnosis,
      patient_uid,
      stage: formData.stage.trim() || undefined,
      ...(Object.keys(cleanedDiseaseData).length > 0 && {
        disease_data: cleanedDiseaseData,
      }), // Include disease_data only if it's not empty
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/patient/user-disease/",
        payload
      );

      onNext();
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  const renderArrayField = (fieldName, label) => (
    <div>
      {formData[fieldName].map((item, index) => (
        <div key={index} className="p-fluid grid">
          {formData[fieldName].length > 0 && (
            <label className="mt-4 border-top w-100">{`${label} `}</label>
          )}
          <div className="d-flex align-items-center justify-content-center gap-4">
            <div className="w-100">
              <InputText
                value={item.site}
                onChange={(e) =>
                  updateArrayItem(fieldName, index, "site", e.target.value)
                }
                placeholder={`سایت ${label} را وارد نمایید`}
              />
            </div>
            <div className="w-100 ">
              <InputText
                value={item.size}
                onChange={(e) =>
                  updateArrayItem(fieldName, index, "size", e.target.value)
                }
                placeholder={`سایز ${label} را وارد نمایید`}
              />
            </div>
          </div>
          <div className="col-4 w-50 mt-2">
            <InputTextarea
              value={item.description}
              onChange={(e) =>
                updateArrayItem(fieldName, index, "description", e.target.value)
              }
              placeholder={`توضیحات ${label} را وارد نمایید`}
            />
          </div>
        </div>
      ))}
      <Button
        dir="ltr"
        label={`جدید ${label}`}
        icon="pi pi-plus-circle"
        iconPos="right"
        onClick={() => addArrayItem(fieldName)}
        className="p-button-sm mt-2"
      />
    </div>
  );

  return (
    <div>
      <Toast />
      <div>
        <label>نوع بدخیمی</label>
        <Dropdown
          value={formType}
          onChange={(e) => setFormType(e.value)}
          options={[
            { label: "SOLID", value: "SOLID" },
            { label: "NON_SOLID", value: "NON_SOLID" },
          ]}
          placeholder="نوع سرطان بیمار را انتخاب نمایید"
          className="w-100 mb-3"
        />
      </div>
      {formType === "NON_SOLID" && (
        <div>
          <div>
            <label>تشخیص</label>
            <Dropdown
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.value)}
              options={diagnosisOptions}
              placeholder="تشخیص بیمار را انتخاب نمایید"
              className="w-100 mb-3"
            />
          </div>
          {renderArrayField("lymph_nodes", "LN involmentN")}

          <div className="d-flex w-100 align-items-center justify-content-center gap-4 mt-4">
            <div className="w-100 ">
              <label>B symptoms</label>
              <Dropdown
                value={formData.b_symptoms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, b_symptoms: e.value }))
                }
                options={b_symptomsOptions}
                placeholder="انتخاب نمایید"
                className="w-100 mb-3"
              />
            </div>
            <div className="w-100 ">
              <label>Spleen</label>
              <InputText
                value={formData.spleen}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spleen: e.target.value }))
                }
                className="w-100 mb-3"
              />
            </div>
          </div>
        </div>
      )}
      {formType === "SOLID" && (
        <div>
          <div>
            <label>تشخیص</label>
            <Dropdown
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.value)}
              options={diagnosisOptions}
              placeholder="تشخیص بیمار را انتخاب نمایید"
              className="w-100 mb-3"
            />
          </div>
          {renderArrayField("primary_tumors", "T")}
          {renderArrayField("nearby_lymphs", "N")}
          {renderArrayField("metastasis", "M")}
        </div>
      )}
      {formType && (
        <div>
          <label>stage</label>
          <Dropdown
            value={formData.stage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, stage: e.value }))
            }
            options={stageOptions}
            placeholder="مرحله بیمار را انتخاب نمایید"
            className="w-100 mb-3"
          />
        </div>
      )}
      <Button
        label="ثبت اطلاعات و اتمام ثبت نام"
        icon="pi pi-check"
        onClick={handleSubmit}
        disabled={!formType || !selectedDiagnosis}
        className="p-button-primary mt-3"
      />
    </div>
  );
};

export default Step3Form;
