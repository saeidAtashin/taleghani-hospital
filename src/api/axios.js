import React, { useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const BASE_URL = process.env.REACT_APP_API_KEY;
const BASE_URL_APP_VERSION = `${process.env.REACT_APP_API_KEY}/api/${process.env.REACT_APP_VERSION}`;

const handleError = (error) => {
  if (!error?.config?.globalErrorHandler) return;

  if (error.response) {
    switch (error?.response?.status) {
      case 400:
        // Handle the specific error structure for status 400
        const errorDetails = error.response.data?.errors;
        if (errorDetails && errorDetails.length > 0) {
          // Display the first error message from the errors array
          toast.warning(errorDetails[0].message || "Invalid inputs");
        } else {
          // Fallback to a generic message
          toast.warning(error.response.data?.message || "Invalid inputs");
        }
        break;
      case 401:
        toast.error(
          "شما به این بخش دسترسی ندارید. " + error.response.data?.message
        );
        break;
      case 403:
        toast.error("مشکلی پیش آمده است. " + error.response.data?.message);
        break;
      case 404:
        toast.error(
          "خطای 404: یافت نشد. " + (error.response.data?.message || error.name)
        );
        break;
      case 500:
        toast.error("ارتباط با سرور به درستی برقرار نشد");
        break;
      case 502:
        toast.info("سامانه در حال بروزرسانی است. شکیبا باشید");
        break;
      default:
        toast.error(
          `Error ${error.response?.status}: ${error.response.statusText}`
        );
    }
  } else if (error.request) {
    toast.error("سامانه در حال بروزرسانی است. شکیبا باشید.");
  } else if (error.message) {
    toast.error("Error: " + error.message);
  } else if (error.code === "ECONNABORTED") {
    toast.error("تایم اوت.");
  } else if (error.code === "ERR_NETWORK") {
    toast.error("لطفا اتصال به اینترنت خود را بررسی نمایید.");
  } else {
    console.error("Global Error Handler:", error);
  }
};

// Axios Instance Configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL_APP_VERSION,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "en-US,en",
    Authorization: localStorage.getItem("access_token")
      ? `Bearer ${localStorage.getItem("access_token")}`
      : null,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

export const useAxiosInstance = () => {
  return useMemo(() => {
    return axios.create({
      baseURL: BASE_URL_APP_VERSION,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en",
        Authorization: localStorage.getItem("access_token")
          ? `Bearer ${localStorage.getItem("access_token")}`
          : null,
      },
      withCredentials: true,
      timeout: 60000,
    });
  }, [localStorage.getItem("access_token")]);
};

// API Endpoints Configuration
export const CREDITOR_CREDITOR_MANAGEMENT = "creditor/creditor-management/";

export const CREDITOR_DISABLE_USER = (creditor_user_uid) =>
  `/creditor/disable-creditor-user/${creditor_user_uid}/`;

export const CREDITOR_ENABLE_USER = (creditor_user_uid) =>
  `/creditor/enable-creditor-user/${creditor_user_uid}`;

export const CREDITOR_USERS = (creditor_uid) =>
  `/creditor/${creditor_uid}/users/`;

// Create other axios instances for specific configurations (example: file uploads)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL_APP_VERSION,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept-Language": "en-US,en",
    Authorization: localStorage.getItem("access_token")
      ? `Bearer ${localStorage.getItem("access_token")}`
      : null,
  },
  withCredentials: true,
  timeout: 600000,
});

export default axiosInstance;
