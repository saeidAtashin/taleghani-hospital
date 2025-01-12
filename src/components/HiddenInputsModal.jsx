import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const HiddenInputsModal = ({ hiddenInputs }) => {
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
      console.log("UID:", selectedHiddenInput.uid);
      console.log("Input Value:", inputValue);
    }
  };

  const inputType = selectedHiddenInput?.type;

  return (
    <div>
      {hiddenInputs?.length > 0 && (
        <Button
          type="button"
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
          <label htmlFor="hiddenInputSelect">آزمایش</label>
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
            <label htmlFor="inputValue">
              {inputType === "CHAR" ? "نتیجه آزمایش" : "نتیجه آزمایش(عدد)"}
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
    </div>
  );
};

export default HiddenInputsModal;
