import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { toast } from "react-toastify";

const TestOptionForm = ({ selectedCategory }) => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null); // PrimeReact Dropdown uses objects
  const [inputValue, setInputValue] = useState("");
  const [ordering, setOrdering] = useState(0);
  const [fieldType, setFieldType] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/fields-list/${selectedCategory}/`
        );

        const fieldsData = response?.data?.results;

        setFields(fieldsData);
      } catch (error) {
        console.error("Error fetching fields:", error);
        toast.error("Failed to load fields.");
      }
    };

    fetchFields();
  }, [selectedCategory]);

  const handleSubmit = async () => {
    if (!selectedField || !inputValue) {
      alert("Please select a field and enter a value.");
      return;
    }

    const payload = {
      field_uid: selectedField.uid,
      ordering: ordering || 0,
    };

    // Send the correct value based on the type
    if (fieldType === "FLOAT") {
      payload.float_value = parseFloat(inputValue);
    } else if (fieldType === "CHAR") {
      payload.char_value = inputValue;
    } else if (fieldType === "PERCENTAGE") {
      payload.float_value = parseFloat(inputValue); // Percentage also uses float_value
    } else {
      toast.warning("Invalid field type selected.");
      return;
    }

    try {
      await axios.post(
        "https://cancerreg.ir/api/v1/tests/mng-option/",
        payload
      );
      toast.success("Data submitted successfully!");
      setInputValue("");
      setOrdering(0);
      // setSelectedField(null);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.warning("Failed to submit data.");
    }
  };

  const handleInputChange = (value) => {
    if (fieldType === "PERCENTAGE") {
      // Validate input for PERCENTAGE
      const percentage = parseFloat(value);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        toast.info("لطفا یک عدد بین 1 تا 100 انتخاب نمایید.");
        return;
      }
    }
    setInputValue(value);
  };

  const handleFieldChange = (selected) => {
    setSelectedField(selected);
    setFieldType(selected?.type || "");
    setInputValue(""); // Reset input value when field changes
  };

  return (
    <div className="form-container">
      {/* <h2>Submit Test Option</h2> */}
      <div className="d-flex gap-2 mb-4">
        <Button
          className="align-left rounded-3"
          label="ذخیره تغییرات"
          onClick={handleSubmit}
        />
        <Button
          className="align-left rounded-3 bg-white text-dark border"
          label="لغو"
        />
      </div>
      <div className="d-flex w-100 gap-3">
        <div className="form-group w-100">
          {/* <label htmlFor="field-select">Select Field</label> */}
          <Dropdown
            id="field-select"
            value={selectedField}
            options={fields}
            onChange={(e) => handleFieldChange(e.value)}
            optionLabel="name" // Display name in the dropdown
            placeholder="نام آزمایش مربوطه"
            className="w-100 mb-3"
          />
        </div>

        <div className="form-group w-100">
          {/* <label htmlFor="input-value">
          {fieldType === "FLOAT"
            ? "Enter Float Value"
            : fieldType === "PERCENTAGE"
            ? "Enter Percentage (0-100)"
            : "Enter Char Value"}
        </label> */}
          <InputText
            id="input-value"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              fieldType === "FLOAT"
                ? "یک مقدار عددی وارد نمایید"
                : fieldType === "PERCENTAGE"
                ? "یک عدد بین 0 تا 100 وارد نمایید."
                : "متن آیتم"
            }
            className="w-100 mb-3"
          />
        </div>

        <div className="form-group w-100">
          {/* <label htmlFor="ordering">Ordering</label> */}
          <InputText
            id="ordering"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            placeholder="ترتیب"
            className="w-100 mb-3"
          />
        </div>
      </div>

      {/* <Button label="Submit" className="mt-3" onClick={handleSubmit} /> */}
    </div>
  );
};

export default TestOptionForm;
