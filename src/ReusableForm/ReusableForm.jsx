import React, { Fragment, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { DatePicker } from "zaman";
import { toast } from "react-toastify";

const ReusableForm = ({
  fields,
  formSchema,
  onSubmit,
  inputsPerRow,
  isEditable = false,
  onlyPost = false,
  onSelectChange,
  isLoading = false,
  defaultValuesFromBackend,
  activeIndex,
  loadingBtn,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuesFromBackend,
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
  const [errorFields, setErrorFields] = useState({});
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
      let url = `https://cancerreg.ir/api/v1/common/${fieldName.name}/`;

      const response = await axios.get(url);
      const fetchedOptions = response.data.data.results.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName.name]: fetchedOptions,
      }));

      setErrorFields((prevErrors) => ({
        ...prevErrors,
        [fieldName.name]: false,
      }));
    } catch (error) {
      // console.error(`Error fetching options for ${fieldName.name}:`, error);
      setErrorFields((prevErrors) => ({
        ...prevErrors,
        [fieldName.name]: true,
      }));
    }
  };

  useEffect(() => {
    reset();
  }, [activeIndex, reset]);

  useEffect(() => {
    if (defaultValuesFromBackend) {
      reset(defaultValuesFromBackend); // Reset form with backend data
    }
  }, [defaultValuesFromBackend, reset]);

  useEffect(() => {
    reset(defaultValuesFromBackend || {});
  }, [defaultValuesFromBackend, reset]);

  // Watch height and weight fields
  const height = watch("height");
  const weight = watch("weight");

  // Calculate BSA and BMI when height or weight changes
  useEffect(() => {
    // Convert string inputs to numbers and validate
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (!isNaN(heightValue) && !isNaN(weightValue) && heightValue > 0 && weightValue > 0) {
      // Height is already in cm, weight is already in kg
      const heightInM = heightValue / 100; // Convert cm to meters for BMI calculation

      // Calculate BMI = weight(kg) / height(m)²
      const bmi = (weightValue / (heightInM * heightInM)).toFixed(1);
      
      // Calculate BSA using Mosteller formula: BSA (m²) = √((height(cm) × weight(kg))/3600)
      const bsa = Math.sqrt((heightValue * weightValue) / 3600).toFixed(2);

      // Only set values if they're in a reasonable range
      if (bmi >= 10 && bmi <= 100) {
        setValue("BMI", bmi);
      } else {
        setValue("BMI", "Invalid BMI");
      }

      if (bsa >= 0.5 && bsa <= 3.0) {
        setValue("BSA", bsa);
      } else {
        setValue("BSA", "Invalid BSA");
      }
    } else {
      // Clear BSA and BMI if height or weight is invalid
      setValue("BSA", "");
      setValue("BMI", "");
    }
  }, [height, weight, setValue]);

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
      <form key={activeIndex} onSubmit={handleSubmit(onSubmit)}>
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
                      defaultValue={field.defaultValue || undefined}
                      render={({ field: controllerField }) => (
                        <div
                          className={`input-group custom-input-group ${
                            field?.value
                          } ${field.append ? "mb-3" : ""}`}
                        >
                          <input
                            {...controllerField}
                            type="text"
                            maxLength={
                              field.label === "کد ملی" ? 10 : undefined
                            } // Limit to 10 if "کد ملی"
                            className={`form-control ${controllerField.name} ${
                              errors[field.name] ? "is-invalid" : ""
                            }`}
                            id={field.name}
                            placeholder={field.placeholder || ""}
                            style={{ textAlign: "right" }} // Align placeholder and value to the right
                            disabled={!editable || field?.readOnly}
                            onInput={(e) => {
                              if (field.label === "کد ملی") {
                                e.target.value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10);
                              }
                              controllerField.onChange(e); // Ensure React Hook Form still works
                            }}
                          />
                          {field.append && (
                            <span className="input-group-text">
                              {field.append}
                            </span>
                          )}
                        </div>
                      )}
                    />
                    <div className="text-danger">
                      {errors?.[field?.name]?.message}
                    </div>
                  </>
                )}

                {/* Select Dropdown */}
                {field.type === "select" && (
                  <>
                    <label className="label" htmlFor={field.nameplus}>
                      {field.label}
                    </label>
                    <Controller
                      name={field.nameplus}
                      control={control}
                      defaultValue={field.defaultValue || undefined}
                      render={({ field: controllerField }) => {
                        if (field.localOptions) {
                          return (
                            <select
                              {...controllerField}
                              className={`form-control form-select ${
                                errors[field.nameplus] ? "is-invalid" : ""
                              }`}
                              id={field.nameplus}
                              disabled={!editable}
                              onChange={(e) => {
                                controllerField.onChange(e);
                                onSelectChange &&
                                  onSelectChange(e.target.value);
                              }}
                            >
                              <option value={undefined}>
                                {defaultValuesFromBackend[field.nameplus]
                                  ? defaultValuesFromBackend[field.nameplus]
                                  : field.placeholder || "Select an option"}
                              </option>
                              {field.options?.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          );
                        } else {
                          useEffect(() => {
                            fetchOptions(field);
                          }, [field]);

                          return (
                            <select
                              {...controllerField}
                              className={`form-control form-select ${
                                errors[field.nameplus] ? "is-invalid" : ""
                              }`}
                              id={field.nameplus}
                              disabled={!editable}
                              onChange={(e) => {
                                controllerField.onChange(e);
                                onSelectChange &&
                                  onSelectChange(e.target.value);
                              }}
                            >
                              <option value={undefined}>
                                {field.placeholder || "Select an option"}
                              </option>
                              {options[field.name]?.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          );
                        }
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
                                name={`drugs[${index}].name`}
                                control={control}
                                defaultValue={item.name || ""}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder={item.placeholder || "نام دارو"}
                                    className={`form-control ${
                                      errors.drugs?.[index]?.name
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
                                name={`drugs[${index}].dose`}
                                control={control}
                                defaultValue={item.dose || ""}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder={"دوز دارو"}
                                    className={`form-control ${
                                      errors.drugs?.[index]?.dose
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
                        onClick={() => append({ name: "", dose: "" })}
                        disabled={!editable}
                      >
                        افزودن
                      </button>
                    </div>
                  </div>
                )}

                {/* MultiSelect Input */}
                {field.type === "multi-select" && (
                  <div className="">
                    <label className="col-md-12 label" htmlFor={field.name}>
                      {field.label}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      defaultValue={[]}
                      render={({ field: controllerField }) => {
                        useEffect(() => {
                          fetchOptions(field);
                        }, [field]);

                        return (
                          <MultiSelect
                            value={controllerField.value}
                            onChange={(e) => {
                              controllerField.onChange(e.value);
                              // setSelectedCities(e.value);
                            }}
                            options={options[field.name] || []}
                            optionLabel="label"
                            placeholder={`${field.label} را وارد نمایید`}
                            display="chip"
                            maxSelectedLabels={3}
                            className="w-100"
                            disabled={!editable}
                          />
                        );
                      }}
                    />

                    {/*  */}
                    {errors[field.name] && (
                      <div className="invalid-feedback">
                        {errors[field.name].message}
                      </div>
                    )}
                  </div>
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
                      defaultValue={field.defaultValue || undefined}
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
                {field.type === "date" && (
                  <div className="d-flex flex-column">
                    <label className="label" htmlFor={field.name}>
                      {field.label}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          defaultValue={field.defaultValue || undefined}
                          {...field}
                          round="x4"
                          position="center"
                          onChange={(e) =>
                            field.onChange(e.value.toLocaleDateString("en-CA"))
                          }
                          className="p-2"
                        />
                      )}
                    />
                    {/*       {errors.date && <p>{errors.date.message}</p>}
                     */}
                    {errors[field.name] && (
                      <div className="invalid-feedback">
                        {errors[field.name].message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          {onlyPost && (
            <>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loadingBtn}
              >
                ثبت اطلاعات و ادامه
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReusableForm;
