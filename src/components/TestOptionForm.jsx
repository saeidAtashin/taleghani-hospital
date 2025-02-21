import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TestOptionForm = ({ selectedCategory, fields, setFields }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [ordering, setOrdering] = useState(0);
  const [fieldType, setFieldType] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/fields-list/${selectedCategory}/`
        );

        const fieldsData = response?.data?.data;

        setFields(fieldsData);
      } catch (error) {
        toast.error("Failed to load fields.");
      }
    };

    fetchFields();
  }, [selectedCategory]);

  const handleSubmit = async () => {
    if (!selectedField) {
      alert("Please select a field and enter a value.");
      return;
    }

    const payload = {
      field_uid: selectedField.uid,
      ordering: ordering || 0,
    };

    if (fieldType === "FLOAT") {
      payload.float_value = parseFloat(inputValue);
    } else if (fieldType === "CHAR") {
      payload.char_value = inputValue;
    } else if (fieldType === "PERCENTAGE") {
      payload.float_value = parseFloat(inputValue);
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
    } catch (error) {
      toast.warning("Failed to submit data.");
    }
  };

  const handleInputChange = (value) => {
    if (fieldType === "PERCENTAGE") {
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
    setInputValue("");
  };

  const handleDelete = async (uid) => {
    Swal.fire({
      title: "آیا از حذف این مورد مطمئن هستید؟",
      text: "این عمل قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "حذف",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://cancerreg.ir/api/v1/tests/mng-field/${uid}/`
          );
          Swal.fire("حذف شد", "آیتم مورد نظر با موفقیت حذف شد", "success");
        } catch (error) {
          Swal.fire("خطا", "حذف آیتم با خطا مواجه شد", "error");
        }
      }
    });
  };

  return (
    <div className="form-container">
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
          <Dropdown
            id="field-select"
            value={selectedField}
            options={fields}
            onChange={(e) => handleFieldChange(e.value)}
            optionLabel="name"
            placeholder="نام آزمایش مربوطه"
            className="w-100 mb-3"
          />
        </div>
{/*  */}
        <div className="form-group w-100">
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
          <InputText
            id="ordering"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            placeholder="ترتیب"
            className="w-100 mb-3"
          />
        </div>
      </div>
    </div>
  );
};

export default TestOptionForm;
