import { Dropdown } from "primereact/dropdown";
import React from "react";

const DropD = ({ titleData, selectedValue, setSelectedValue, disabled }) => {
  return (
    <div className="">
      {/* <span>{titleDirectToCat?.ordering}</span> */}
      <Dropdown
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.value)}
        options={titleData?.options}
        optionLabel="name"
        optionValue="uid"
        placeholder={`${titleData?.name} را انتخاب کنید`}
        className="w-100"
        disabled={disabled}
      />
    </div>
  );
};

export default DropD;

// {
//   "uid": "ddbd10ef-41f7-463e-892c-90cc2c842e2a",
//   "value": "bc3c660a-2fc5-43b6-b70f-14a21c1b0727"
// }
