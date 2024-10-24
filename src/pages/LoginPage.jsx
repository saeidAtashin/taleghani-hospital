import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../ReusableForm/ReusableForm";
import { generateReusableSchema, loginForm } from "../form-fields/FormFields";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleFormSubmit = (data) => {
    console.log("data", data);
    navigate("/dashboard");
  };
  return (
    <>
      <section className="vh-100 vw-100  bg-image overflow-hidden">
        <div className="container-fluid h-custom w-100 ">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-6 col-lg-6 col-xl-6 offset-xl-1">
              <div className="mt-4 w-50 mx-auto">
                <h3 className="fw-bold fs-20 ">ورود به پنل</h3>
              </div>

              <ReusableForm
                fields={loginForm}
                formSchema={generateReusableSchema(loginForm)}
                onSubmit={handleFormSubmit}
                inputsPerRow={[1]}
              />
            </div>
            <div className="col-md-6 col-lg-6 col-xl-5 position-relative ">
              <img
                src="./images/login.png"
                className="w-100 d-none d-md-block"
                alt="Sample image"
              />
              <div className="d-flex flex-column align-items-center position-absolute top-50 start-50 translate-middle primary-300 p-5 rounded d-none d-md-block">
                <div className="bg-light p-5 mb-4 rounded-circle" />
                <h1 className="text-light text-nowrap">بیمارستان طالقانی</h1>
                <h5 className="text-light text-nowrap">بخش خون و آنکولوژی</h5>
              </div>
            </div>
          </div>
        </div>
        <div className=" responsive-bottom d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
          <div className="text-white mb-0">
            Copyright © 2020. All rights reserved.
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
