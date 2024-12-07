import { Dropdown } from "primereact/dropdown";
import React from "react";

const DropD = ({ titleDirectToCat, selectedValue, setSelectedValue }) => {
  return (
    <div className="">
      {/* <span>{titleDirectToCat?.ordering}</span> */}
      <Dropdown
        value={selectedValue} // Use the value passed as a prop
        // onChange={(e) => setSelectedValue(e.value)} // Update the parent component's state via callback
        options={titleDirectToCat?.options} // List of options for the dropdown
        onChange={(e) => {
          // Find the selected option based on the uid
          const selectedOption = titleDirectToCat?.options?.find(
            (option) => option.uid === e.value
          );

          // Pass both uid and name to the parent component
          setSelectedValue(e.value, selectedOption?.name);
        }}
        optionLabel="name" // The property to display in the dropdown
        optionValue="uid" // The value to store in the selected option
        placeholder={`${titleDirectToCat?.name} را انتخاب نمایید`} // Dynamic placeholder text
        className="w-100"
      />
    </div>
  );
};

export default DropD;

// {
//   "uid": "ddbd10ef-41f7-463e-892c-90cc2c842e2a",
//   "value": "bc3c660a-2fc5-43b6-b70f-14a21c1b0727"
// }
