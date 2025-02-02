import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme CSS
import "primereact/resources/primereact.min.css"; // PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {
      username: !username.trim(),
      password: !password.trim(),
    };
    setErrors(validationErrors);

    // Prevent submission if any field is empty
    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/user/auth/login/",
        {
          username,
          password,
        }
      );
      navigate("/dashboard");
    } catch (error) {
      toast.warn(error?.response?.data?.errors[0]?.message);
      // console.error(
        "Error submitting data:",
        error?.response?.data?.errors[0]?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="vh-100 vw-100 bg-image overflow-hidden">
        <div className="container-fluid h-custom w-100">
          <div className="row d-flex justify-content-between align-items-center h-100 w-100">
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="mt-4 w-50 mx-auto">
                <h3 className="fw-bold fs-20">ورود به پنل</h3>
              </div>
              <div className="w-50 mx-auto">
                <form onSubmit={handleFormSubmit}>
                  <div className="p-field mb-3">
                    <label htmlFor="username" className="form-label">
                      نام کاربری
                    </label>
                    <InputText
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="نام کاربری"
                      className={`w-100 ${errors.username ? "p-invalid" : ""}`}
                    />
                    {errors.username && (
                      <small className="p-error">
                        نام کاربری نمی‌تواند خالی باشد
                      </small>
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="رمز عبور"
                        className={`w-100 ${
                          errors.password ? "p-invalid" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        icon={`pi ${
                          passwordVisible ? "pi-eye-slash" : "pi-eye"
                        }`}
                        className="p-button-secondary"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      />
                    </div>
                    {errors.password && (
                      <small className="p-error">
                        رمز عبور نمی‌تواند خالی باشد
                      </small>
                    )}
                  </div>
                  <Button
                    label="ورود"
                    icon="pi pi-sign-in"
                    type="submit"
                    className="w-100"
                    loading={loading}
                  />
                </form>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-5 position-relative">
              <img
                src="./images/login.png"
                className="w-100 d-none d-md-block"
                alt="Sample"
              />
              <div className="d-flex flex-column align-items-center position-absolute top-50 start-50 translate-middle primary-300 p-5 rounded d-none d-md-block">
                <div className="bg-light p-5 mb-4 rounded-circle" />
                <h1 className="text-light text-nowrap">بیمارستان طالقانی</h1>
                <h5 className="text-light text-nowrap">بخش خون و آنکولوژی</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="responsive-bottom d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
          <div className="text-white mb-0">
            Copyright © 2020. All rights reserved.
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
