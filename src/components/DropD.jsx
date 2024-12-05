import { Dropdown } from "primereact/dropdown";
import React from "react";

const DropD = ({ titleDirectToCat, selectedValue, setSelectedValue }) => {
  return (
    <Dropdown
      value={selectedValue} // Use the value passed as a prop
      onChange={(e) => setSelectedValue(e.value)} // Update the parent component's state via callback
      options={titleDirectToCat?.options} // List of options for the dropdown
      optionLabel="name" // The property to display in the dropdown
      optionValue="uid" // The value to store in the selected option
      placeholder={`${titleDirectToCat?.name} را انتخاب نمایید`} // Dynamic placeholder text
      className="w-full md:w-14rem"
    />
  );
};

export default DropD;
