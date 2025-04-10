import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import { toast } from "react-toastify";

// CSS imports moved to a separate style file or main entry point
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });

  // Memoized validation function
  const validateForm = useMemo(() => {
    return {
      username: !formData.username.trim(),
      password: !formData.password.trim(),
    };
  }, [formData.username, formData.password]);

  // Memoized change handlers
  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: false,
    }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm;
    setErrors(validationErrors);

    if (Object?.values(validationErrors)?.some((error) => error)) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://cancerreg.ir/api/v1/user/auth/login/",
        formData
      );
      navigate("/dashboard");
    } catch (error) {
      toast.warn(error?.response?.data?.errors[0]?.message);
    } finally {
      setLoading(false);
    }
  };

  // Memoized form content
  const formContent = useMemo(
    () => (
      <form onSubmit={handleFormSubmit} className="login-form">
        <div className="p-field mb-3">
          <label htmlFor="username" className="form-label">
            نام کاربری
          </label>
          <InputText
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="نام کاربری"
            className={`w-100 ${errors.username ? "p-invalid" : ""}`}
            aria-label="نام کاربری"
            disabled={loading}
          />
          {errors.username && (
            <small className="p-error">نام کاربری نمی‌تواند خالی باشد</small>
          )}
        </div>
        <div className="p-field mb-4">
          <label htmlFor="password" className="form-label">
            رمز عبور
          </label>
          <div className="p-inputgroup">
            <InputText
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="رمز عبور"
              className={`w-100 ${errors.password ? "p-invalid" : ""}`}
              aria-label="رمز عبور"
              disabled={loading}
            />
            <Button
              type="button"
              icon={`pi ${passwordVisible ? "pi-eye-slash" : "pi-eye"}`}
              className="p-button-secondary"
              onClick={togglePasswordVisibility}
              aria-label={
                passwordVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"
              }
              disabled={loading}
            />
          </div>
          {errors.password && (
            <small className="p-error">رمز عبور نمی‌تواند خالی باشد</small>
          )}
        </div>
        <Button
          label="ورود"
          icon="pi pi-sign-in"
          type="submit"
          className="w-100"
          loading={loading}
          disabled={loading}
        />
      </form>
    ),
    [
      formData,
      errors,
      passwordVisible,
      loading,
      handleInputChange,
      togglePasswordVisibility,
    ]
  );

  return (
    <div className="login-container">
      <section className="login-section">
        <div className="container-fluid">
          <div className="row h-100">
            <div className="col-12 col-md-6 login-form-container">
              <div className="login-form-wrapper">
                <h3 className="login-title">ورود به پنل</h3>
                {formContent}
              </div>
            </div>
            <div className="col-12 col-md-6 login-image-container d-none d-md-block">
              <img
                src="./images/login.png"
                className="login-image"
                alt="تصویر ورود"
                loading="lazy"
              />
              <div className="hospital-info">
                <div className="hospital-logo" />
                <h1>بیمارستان طالقانی</h1>
                <h5>بخش خون و آنکولوژی</h5>
              </div>
            </div>
          </div>
        </div>
        <footer className="login-footer">
          <div className="copyright">
            Copyright © {new Date().getFullYear()}. All rights reserved.
          </div>
        </footer>
      </section>
    </div>
  );
};

export default React.memo(LoginPage);
