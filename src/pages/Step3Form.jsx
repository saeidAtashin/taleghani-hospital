import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";

const Step3Form = ({ patient_uid, onNext, initialData, isEditing = false }) => {
  const [formType, setFormType] = useState(initialData?.type || null);
  const [formData, setFormData] = useState({
    lymph_nodes: initialData?.disease_data?.lymph_nodes || [],
    spleen: initialData?.disease_data?.spleen || "",
    b_symptoms: initialData?.disease_data?.b_symptoms || "",
    stage: initialData?.disease_data?.stage || "",
    primary_tumors: initialData?.disease_data?.primary_tumors || [],
    nearby_lymphs: initialData?.disease_data?.nearby_lymphs || [],
    metastasis: initialData?.disease_data?.metastasis || [],
  });
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(
    initialData?.diagnosis_uid || null
  );
  const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
  const [selectedDiagnosisLabel, setSelectedDiagnosisLabel] = useState(
    initialData?.diagnosis || ""
  );
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [selectedStageLabel, setSelectedStageLabel] = useState("");

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

        // Set initial diagnosis label if we have a selected diagnosis
        if (selectedDiagnosis) {
          const selectedOption = options.find(
            (opt) => opt.value === selectedDiagnosis
          );
          if (selectedOption) {
            setSelectedDiagnosisLabel(selectedOption.label);
          }
        }
      } catch (error) {}
    };

    fetchDiagnosisOptions();
  }, [selectedDiagnosis]);

  useEffect(() => {
    if (initialData) {
      console.log("initialData", initialData);
      setFormType(initialData.type);
      setSelectedDiagnosis(initialData.diagnosis_uid);
      setSelectedDiagnosisLabel(initialData.diagnosis_uid);
      setFormData((prev) => ({
        ...prev,
        stage: initialData.disease_data?.stage || "",
        b_symptoms: initialData.disease_data?.b_symptoms || "",
        spleen: initialData.disease_data?.spleen || "",
        lymph_nodes: initialData.disease_data?.lymph_nodes || [],
        primary_tumors: initialData.disease_data?.primary_tumors || [],
        nearby_lymphs: initialData.disease_data?.nearby_lymphs || [],
        metastasis: initialData.disease_data?.metastasis || [],
      }));

      // Set initial stage label
      if (initialData.disease_data?.stage) {
        setSelectedStageLabel(initialData.disease_data.stage);
      }
    }
  }, [initialData]);

  const handleDiagnosisChange = (e) => {
    setSelectedDiagnosis(e.value);
    const selectedOption = diagnosisOptions.find(
      (opt) => opt.value === e.value
    );
    if (selectedOption) {
      setSelectedDiagnosisLabel(selectedOption.label);
    }
    setShowDiagnosisDropdown(false);
  };

  const handleStageChange = (e) => {
    setFormData((prev) => ({ ...prev, stage: e.value }));
    setSelectedStageLabel(`مرحله: ${e.value}`);
    setShowStageDropdown(false);
  };

  const stageOptions = [
    { label: "A-I", value: "A-I" },
    { label: "B-I", value: "B-I" },
    { label: "C-I", value: "C-I" },
  ];

  const b_symptomsOptions = [
    { label: "+", value: "+" },
    { label: "-", value: "-" },
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
    const diseaseData =
      formType === "NON_SOLID"
        ? {
            lymph_nodes: formData.lymph_nodes.filter(
              (node) =>
                node.site.trim() || node.size.trim() || node.description.trim()
            ),
            spleen: formData.spleen.trim() || undefined,
            b_symptoms: formData.b_symptoms.trim() || undefined,
            stage: formData.stage.trim() || undefined,
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
            ...(formData.stage?.trim() && { stage: formData.stage.trim() }),
          };

    const cleanedDiseaseData = Object.keys(diseaseData).reduce((acc, key) => {
      if (Array.isArray(diseaseData[key]) && diseaseData[key].length > 0) {
        acc[key] = diseaseData[key];
      } else if (diseaseData[key] !== undefined) {
        acc[key] = diseaseData[key];
      }
      return acc;
    }, {});

    const payload = {
      type: formType,
      diagnosis_uid: selectedDiagnosis,
      ...(isEditing ? {} : { patient_uid }),
      ...(Object.keys(cleanedDiseaseData).length > 0 && {
        disease_data: cleanedDiseaseData,
      }),
    };

    try {
      if (isEditing) {
        // If editing, let parent component handle the API call
        onNext(payload);
      } else {
        // If creating new, handle POST request here
        const response = await axios.post(
          "https://cancerreg.ir/api/v1/patient/user-disease/",
          payload
        );
        if (response.status >= 200 && response.status < 400) {
          toast.success("اطلاعات با موفقیت ثبت شد");
          onNext();
        }
      }
    } catch (error) {
      toast.error("خطا در ثبت اطلاعات");
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
          disabled={isEditing}
        />
      </div>
      {formType === "NON_SOLID" && (
        <div>
          <div>
            <label>تشخیص</label>
            {showDiagnosisDropdown ? (
              <Dropdown
                value={selectedDiagnosis}
                onChange={handleDiagnosisChange}
                options={diagnosisOptions}
                placeholder="تشخیص بیمار را انتخاب نمایید"
                className="w-100 mb-3"
                autoFocus
              />
            ) : (
              <div
                className="p-inputtext p-component w-100 mb-3"
                style={{ cursor: "pointer", textAlign: "right" }}
                onClick={() => setShowDiagnosisDropdown(true)}
              >
                {selectedDiagnosisLabel}
              </div>
            )}
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
            {showDiagnosisDropdown ? (
              <Dropdown
                value={selectedDiagnosis}
                onChange={handleDiagnosisChange}
                options={diagnosisOptions}
                placeholder="تشخیص بیمار را انتخاب نمایید"
                className="w-100 mb-3"
                autoFocus
              />
            ) : (
              <div
                className="p-inputtext p-component w-100 mb-3"
                style={{ cursor: "pointer", textAlign: "right" }}
                onClick={() => setShowDiagnosisDropdown(true)}
              >
                {selectedDiagnosisLabel}
              </div>
            )}
          </div>
          {renderArrayField("primary_tumors", "T")}
          {renderArrayField("nearby_lymphs", "N")}
          {renderArrayField("metastasis", "M")}
        </div>
      )}
      {formType && (
        <div>
          <label>stage</label>
          {showStageDropdown ? (
            <Dropdown
              value={formData.stage}
              onChange={handleStageChange}
              options={stageOptions}
              placeholder="مرحله بیمار را انتخاب نمایید"
              className="w-100 mb-3"
              autoFocus
            />
          ) : (
            <div
              className="p-inputtext p-component w-100 mb-3"
              style={{ cursor: "pointer", textAlign: "right" }}
              onClick={() => setShowStageDropdown(true)}
            >
              {selectedStageLabel}
            </div>
          )}
        </div>
      )}
      <Button
        label={isEditing ? "ثبت تغییرات" : "ثبت اطلاعات و اتمام ثبت نام"}
        icon="pi pi-check"
        onClick={handleSubmit}
        disabled={!formType || !selectedDiagnosis}
        className="p-button-primary mt-3"
      />
    </div>
  );
};

export default Step3Form;
