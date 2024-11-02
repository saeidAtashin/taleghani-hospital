import axios from "axios";
import Swal from "sweetalert2";

const apiRequest = async (
  method,
  endpoint,
  data = null,
  baseURL = "https://cancerreg.ir/api/v1"
) => {
  try {
    const response = await axios({
      method,
      // url: `https://cancerreg.ir/api/v1/common/${endpoint}/`,
      url: `${baseURL}${endpoint}/`,
      data,
    });
    return response;
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    Swal.fire({
      title: "مشکلی پیش آمده است.",
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
    throw error;
  }
};

export default apiRequest;
