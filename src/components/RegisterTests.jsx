import axios from "axios";
import React, { useEffect } from "react";

const RegisterTests = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );
        // const { results } = response.data;

        console.log("results", response?.data?.data?.result);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>RegisterTests</div>;
};

export default RegisterTests;
