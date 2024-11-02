import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const SelectableIconItem = ({
  icon,
  label,
  options,
  header,
  type,
  onChange,
  selectedValues,
  iconColor,
  size,
  style,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValues || []);

  const handleSelectChange = (option) => {
    const isSelected = selectedOptions.includes(option.value);
    const updatedSelection = isSelected
      ? selectedOptions.filter((val) => val !== option.value)
      : [...selectedOptions, option.value];

    setSelectedOptions(updatedSelection);
    if (onChange) onChange(updatedSelection);
  };

  const hasBorder = type === "bordered";

  return (
    <div style={{ ...style }}>
      {header && <h3 style={{ marginBottom: "0.5em" }}>{header}</h3>}
      {options.map((option) => (
        <div
          key={option.value}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.5em",
            borderRadius: "8px",
            border: hasBorder ? "1px solid #ccc" : "none",
            backgroundColor: selectedOptions.includes(option.value)
              ? "#e0f7fa"
              : "transparent",
            marginBottom: "0.5em",
            cursor: "pointer",
          }}
          onClick={() => handleSelectChange(option)}
        >
          <Checkbox
            checked={selectedOptions.includes(option.value)}
            onChange={() => handleSelectChange(option)}
            style={{ marginRight: "0.5em", transform: "scale(1.1)" }}
          />
          <Button
            icon={icon}
            style={{
              color: iconColor || "#333",
              fontSize: size || "1rem",
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              marginRight: "0.5em",
            }}
            className="p-button-rounded p-button-text"
          />
          <span
            style={{ fontSize: size || "1rem", color: iconColor || "#333" }}
          >
            {option.label}
          </span>
        </div>
      ))}
    </div>
  );
};

SelectableIconItem.propTypes = {
  icon: PropTypes.string.isRequired, // PrimeReact icon class (e.g., "pi pi-check")
  label: PropTypes.string, // Display label for the item
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired, // Unique value for each selectable option
      label: PropTypes.string.isRequired, // Display name for each option
    })
  ).isRequired, // Array of selectable options with values and labels
  header: PropTypes.string, // Optional header for the component
  type: PropTypes.oneOf(["bordered", "plain"]), // Style type: "bordered" or "plain"
  onChange: PropTypes.func, // Function to call when selected state changes
  selectedValues: PropTypes.array, // Array of initially selected values
  iconColor: PropTypes.string, // Icon color
  size: PropTypes.string, // Font size for icon and label
  style: PropTypes.object, // Custom styles for the component
};

SelectableIconItem.defaultProps = {
  type: "plain",
  selectedValues: [],
  iconColor: "#333",
  size: "1rem",
  style: {},
};

export default SelectableIconItem;
