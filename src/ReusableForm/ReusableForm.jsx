import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the Zod schema for validation
const formSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(20, "Username must be 20 characters or less"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user", "guest"], "Role is required"),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
});

const ReusableForm = ({ fields, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="container mt-5">
      <h2>Reusable Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            {/* Text Input */}
            {field.type === "text" && (
              <>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue || ""}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      type="text"
                      className={`form-control ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      id={field.name}
                      placeholder={field.placeholder || ""}
                    />
                  )}
                />
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </>
            )}

            {/* Email Input */}
            {field.type === "email" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue || ""}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      type="email"
                      className={`form-control ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      id={field.name}
                      placeholder={field.placeholder || ""}
                    />
                  )}
                />
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </>
            )}

            {/* Password Input */}
            {field.type === "password" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue || ""}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      type="password"
                      className={`form-control ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      id={field.name}
                      placeholder={field.placeholder || ""}
                    />
                  )}
                />
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </>
            )}

            {/* Select Dropdown */}
            {field.type === "select" && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue || ""}
                  render={({ field: controllerField }) => (
                    <select
                      {...controllerField}
                      className={`form-control form-select ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      id={field.name}
                    >
                      <option value="">
                        {field.placeholder || "Select an option"}
                      </option>
                      {field.options &&
                        field.options.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  )}
                />
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </>
            )}

            {/* Checkbox */}
            {field.type === "checkbox" && (
              <div className="form-check">
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue || false}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      type="checkbox"
                      className={`form-check-input ${
                        errors[field.name] ? "is-invalid" : ""
                      }`}
                      id={field.name}
                      checked={controllerField.value}
                    />
                  )}
                />
                <label className="form-check-label" htmlFor={field.name}>
                  {field.label}
                </label>
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReusableForm;
