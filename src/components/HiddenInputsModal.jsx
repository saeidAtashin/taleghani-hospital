import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const HiddenInputsModal = ({
  hiddenInputs,
  setSubmittedInputs,
  submittedInputs,
  setHiddenSubmittedData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHiddenInput, setSelectedHiddenInput] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedHiddenInput(null);
    setInputValue("");
  };

  const handleSubmit = () => {
    if (selectedHiddenInput) {
      const submittedData = {
        uid: selectedHiddenInput.uid,
        value: inputValue,
      };

      setHiddenSubmittedData(submittedData);
      // Log the data in the requested format

      // Add the submitted input to the list of submitted inputs
      setSubmittedInputs((prev) => [
        ...prev,
        { name: selectedHiddenInput.name, value: inputValue },
      ]);

      // Close the modal and reset the form
      handleCloseModal();
    }
  };

  const inputType = selectedHiddenInput?.type;

  return (
    <div>
      {hiddenInputs?.length > 0 && (
        <Button
          type="button"
          className="rounded"
          label="ثبت آزمایش جدید"
          onClick={handleOpenModal}
        />
      )}

      <Dialog
        header="ثبت آزمایش جدید"
        visible={isModalVisible}
        onHide={handleCloseModal}
        style={{ width: "30vw" }}
      >
        <div className="p-field d-flex flex-column my-2">
          <label className="mb-1" htmlFor="hiddenInputSelect">
            آزمایش
          </label>
          <Dropdown
            id="hiddenInputSelect"
            value={selectedHiddenInput}
            options={hiddenInputs}
            optionLabel="name"
            onChange={(e) => setSelectedHiddenInput(e.value)}
            placeholder="یک آزمایش انتخاب نمایید."
          />
        </div>

        {selectedHiddenInput && (
          <div className="p-field d-flex flex-column my-4">
            <label className="mb-1" htmlFor="inputValue">
              {inputType === "CHAR" ? "نتیجه آزمایش" : "نتیجه آزمایش (عدد)"}
            </label>
            {inputType === "CHAR" ? (
              <InputText
                id="inputValue"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <InputNumber
                id="inputValue"
                value={inputValue}
                onValueChange={(e) => setInputValue(e.value)}
              />
            )}
          </div>
        )}

        <div className="p-field d-flex align-items-center justify-content-between">
          <Button
            type="button"
            label="لغو"
            className="bg-dark rounded"
            onClick={handleCloseModal}
          />
          <Button
            type="button"
            label="ثبت"
            className="rounded"
            onClick={handleSubmit}
            disabled={!selectedHiddenInput || inputValue === ""}
          />
        </div>
      </Dialog>

      {/* Render submitted inputs */}
      <div style={{ marginTop: "20px" }}>
        {submittedInputs?.length > 0 && <h3>آزمایش ثبت‌شده</h3>}
        {submittedInputs?.map((input, index) => (
          <div
            key={index}
            className="submitted-input d-flex flex-column my-2"
            style={{ marginBottom: "10px" }}
          >
            <label>{input.name}:</label>
            <input
              type="text"
              value={input.value}
              readOnly
              style={{
                marginLeft: "10px",
                padding: "5px",
                width: "200px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiddenInputsModal;
