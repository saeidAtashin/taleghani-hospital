import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = () => {
    console.log("object");
    navigate("/dashboard");
  };
  return (
    <>
      <section className="vh-100 vw-100  bg-image overflow-hidden">
        <div className="container-fluid h-custom w-100 ">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-6 col-lg-6 col-xl-6 offset-xl-1">
              <div className="mt-4 ">
                <h3 className="fw-bold fs-20 ">ورود به پنل</h3>
              </div>
              <form>
                <div data-mdb-input-init className="form-outline my-4">
                  <label className="form-label" htmlFor="form3Example3">
                    نام کاربری
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
                    className="form-control form-control-lg"
                    placeholder="نام کاربری خود را وارد نمایید"
                  />
                </div>

                {/* <!-- Password input --> */}
                <div data-mdb-input-init className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="رمز عبور خود را وارد نمایید"
                  />
                </div>

                <div className="text-center text-lg-start mt-4 pt-2 ">
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn1 btn btn-primary btn-lg w-100 mb-4"
                    onClick={login}
                  >
                    Login
                  </button>
                </div>
              </form>
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
          {/* <!-- Copyright --> */}
          <div className="text-white mb-0">
            Copyright © 2020. All rights reserved.
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
