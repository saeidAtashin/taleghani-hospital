import React, { useEffect, useState } from "react";
import apiRequest from "../api/apiService";
import { useParams } from "react-router-dom";

const GraphicRecord = () => {
  const [products, setProducts] = useState([]);
  const { uid } = useParams();

  console.log("uid", uid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/records/batch-graphic-records/${uid}`
        );
        const patients = response.data.data.results;
        setProducts(patients);
        console.log("patients", patients);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchData();
  }, []);

  return <div>GraphicRecord</div>;
};

export default GraphicRecord;
