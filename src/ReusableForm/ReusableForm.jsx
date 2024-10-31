import React, { Fragment, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ReusableForm = ({
  fields,
  formSchema,
  onSubmit,
  inputsPerRow,
  isEditable = false,
  onlyPost = false,
  onSelectChange,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    fields: subfields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "drugs",
  });

  const [editable, setEditable] = useState(!isEditable);
  const [options, setOptions] = useState({});

  const toggleEditable = () => setEditable((prev) => !prev);

  const getFieldsInRows = (fields, inputsPerRow) => {
    let rows = [];
    let startIndex = 0;

    inputsPerRow?.forEach((count) => {
      const rowFields = fields.slice(startIndex, startIndex + count);
      rows.push(rowFields);
      startIndex += count;
    });

    if (startIndex < fields.length) {
      rows.push(fields.slice(startIndex));
    }

    return rows;
  };

  const rows = getFieldsInRows(fields, inputsPerRow);

  const fetchOptions = async (fieldName) => {
    try {
      let url = `https://cancerreg.ir/api/v1/common/${fieldName}/`;

      const response = await axios.get(url);
      const fetchedOptions = response.data.data.results.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]: fetchedOptions,
      }));
    } catch (error) {
      console.error(`Error fetching options for ${fieldName}:`, error);
    }
  };

  return (
    <div className="container mt-5">
      {!onlyPost && !editable ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={toggleEditable}
        >
          ویرایش
        </button>
      ) : (
        !onlyPost && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleEditable}
            >
              لغو
            </button>
            <button type="submit" className="btn btn-primary">
              ذخیره تغییرات
            </button>
          </div>
        )
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {rows.map((rowFields, rowIndex) => (
          <div className="row" key={rowIndex}>
            {rowFields.map((field, index) => (
              <div
                key={index}
                className={`mt-3 col-md-${Math.floor(
                  12 / rowFields.length
                )} mb-3`}
              >
                {/* Text Input */}
                {field.type === "text" && (
                  <>
                    <label htmlFor={field.name} className="label">
                      {field.label}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      defaultValue={field.defaultValue || ""}
                      render={({ field: controllerField }) => (
                        <div
                          className={`input-group custom-input-group ${
                            field.append ? "mb-3" : ""
                          }`}
                        >
                          <input
                            {...controllerField}
                            type="text"
                            className={`form-control ${
                              errors[field.name] ? "is-invalid" : ""
                            }`}
                            id={field.name}
                            placeholder={field.placeholder || ""}
                            disabled={!editable}
                          />
                          {field.append && (
                            <span className="input-group-text">
                              {field.append}
                            </span>
                          )}
                        </div>
                      )}
                    />
                    {/* {errors[field.name] && ( */}
                    <div className="text-danger">
                      {errors?.[field?.name]?.message}
                    </div>
                    {/* )} */}
                    {/* {errors[field?.name]?.message} */}
                  </>
                )}
                {/* Email Input */}
                {field.type === "email" && (
                  <>
                    <label className="label" htmlFor={field.name}>
                      {field.label}
                    </label>
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
                          disabled={!editable}
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
                    <label className="label" htmlFor={field.name}>
                      {field.label}
                    </label>
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
                          disabled={!editable}
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
                    <label className="label" htmlFor={field.name}>
                      {field.label}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      defaultValue={field.defaultValue || ""}
                      render={({ field: controllerField }) => {
                        // Fetch options when the component mounts or field.name changes
                        useEffect(() => {
                          fetchOptions(field.name);
                        }, [field.name]);

                        return (
                          <select
                            {...controllerField}
                            className={`form-control form-select ${
                              errors[field.name] ? "is-invalid" : ""
                            }`}
                            id={field.name}
                            disabled={!editable}
                            onChange={(e) => {
                              controllerField.onChange(e);
                              onSelectChange && onSelectChange(e.target.value);
                            }}
                          >
                            <option value="">
                              {field.placeholder || "Select an option"}
                            </option>
                            {options[field.name]?.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        );
                      }}
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
                          disabled={!editable}
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
                {/* Dynamic Fields for Drug Name and Drug Dose */}
                {field.type === "doubleinput" && (
                  <div className="">
                    <label className="col-md-12 label">{field.label}</label>

                    {subfields.map((item, index) => (
                      <Fragment key={item.id}>
                        <div className="d-flex">
                          <div className="col-md-6 mb-3">
                            <div className="input-group">
                              <Controller
                                name={`drugs[${index}].drug_name`} // Updated name to correctly reference array index
                                control={control}
                                defaultValue={item.drug_name || ""}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder={item.placeholder || "نام دارو"}
                                    className={`form-control ${
                                      errors.drugs?.[index]?.drug_name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    disabled={!editable}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="input-group">
                              <Controller
                                name={`drugs[${index}].drug_dose`} // Updated name to correctly reference array index
                                control={control}
                                defaultValue={item.drug_dose || ""}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder={"دوز دارو"}
                                    className={`form-control ${
                                      errors.drugs?.[index]?.drug_dose
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    disabled={!editable}
                                  />
                                )}
                              />
                              <button
                                type="button"
                                className="btn btn-danger ms-2 custom-border-radius-btn"
                                onClick={() => remove(index)}
                                disabled={!editable}
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => append({ drug_name: "", drug_dose: "" })}
                        disabled={!editable}
                      >
                        افزودن
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          {onlyPost && (
            <>
              {/* <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleEditable}
              >
                لغو
              </button> */}
              <button type="submit" className="btn btn-primary w-100">
                ثبت اطلاعات و ادامه
              </button>
            </>
          )}
        </div>

        {/* <button type="submit" className="btn btn-primary w-100">
          ثبت اطلاعات و ادامه
        </button> */}
      </form>
    </div>
  );
};

export default ReusableForm;
