import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

const DropD = ({ titleDirectToCat }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <>
      <Dropdown
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={titleDirectToCat?.options}
        optionLabel="name"
        optionValue="uid"
        placeholder={`${titleDirectToCat?.name} را انتخاب نمایید`}
        className="w-full md:w-14rem "
      />
    </>
  );
};

export default DropD;
