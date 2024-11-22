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
    const payload = {
      type: formType,
      diagnosis_uid: selectedDiagnosis,
      patient_uid,
      disease_data: {
        ...(formType === "NON_SOLID"
          ? {
              lymph_nodes: formData.lymph_nodes.filter(
                (node) =>
                  node.site.trim() ||
                  node.size.trim() ||
                  node.description.trim()
              ),
              spleen: formData.spleen.trim() || undefined,
              b_symptoms: formData.b_symptoms.trim() || undefined,
              stage: formData.stage.trim() || undefined,
            }
          : {
              primary_tumors: formData.primary_tumors.filter(
                (tumor) =>
                  tumor.site.trim() ||
                  tumor.size.trim() ||
                  tumor.description.trim()
              ),
              nearby_lymphs: formData.nearby_lymphs.filter(
                (lymph) =>
                  lymph.site.trim() ||
                  lymph.size.trim() ||
                  lymph.description.trim()
              ),
              metastasis: formData.metastasis.filter(
                (met) =>
                  met.site.trim() || met.size.trim() || met.description.trim()
              ),
              stage: formData.stage.trim() || undefined,
            }),
      },
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/patient/user-disease/",
        payload
      );
      console.log("Response:", response);
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
          {renderArrayField("lymph_nodes", "N")}
          <div className="p-field">
            <label>Spleen</label>
            <InputText
              value={formData.spleen}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, spleen: e.target.value }))
              }
            />
          </div>
          <div className="p-field">
            <label>B symptoms</label>
            <InputText
              value={formData.b_symptoms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, b_symptoms: e.target.value }))
              }
            />
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
        label="ارسال"
        icon="pi pi-check"
        onClick={handleSubmit}
        disabled={!formType || !selectedDiagnosis}
        className="p-button-primary mt-3"
      />
    </div>
  );
};

export default Step3Form;
