import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableForm = ({ fields, onSubmit }) => {
  // Initialize form data state based on fields prop
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass form data to the onSubmit callback
  };

  return (
    <div className="container mt-5">
      <h2>Reusable Bootstrap Form</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            {/* Render different input types based on field.type */}
            {field.type === "text" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="text"
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                />
              </>
            )}
            {field.type === "email" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="email"
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                />
              </>
            )}
            {field.type === "password" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="password"
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                />
              </>
            )}
            {field.type === "select" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <select
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">
                    {field.placeholder || "Select an option"}
                  </option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {field.type === "checkbox" && (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={field.name}
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor={field.name}>
                  {field.label}
                </label>
              </div>
            )}
          </div>
        ))}
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReusableForm;
