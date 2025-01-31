import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useParams } from "react-router-dom";

const PatientDiseaseMap = () => {
  const [data, setData] = useState([]);
  const { uid } = useParams();

  useEffect(() => {
    fetch(`https://cancerreg.ir/api/v1/patient/patient-disease/${uid}/`)
      .then((response) => response.json())
      .then((data) => setData(data?.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log("data datadatadata ", data);
  return (
    <div className="p-4">
      {data?.length > 0 ? (
        <Accordion>
          {data?.map((item) => (
            <AccordionTab key={item.uid} header={`نوع بدخیمی: ${item.type}`}>
              <p>
                <strong>تشخیص:</strong> {item.diagnosis}
              </p>
              <p>
                <strong>Patient:</strong> {item.patient}
              </p>
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <p>Loading...</p>
      )}

      {/* Placeholder map, update lat/lng as needed */}
      <p>{/* <strong>Type:</strong> {item.type} */}</p>
    </div>
  );
};

export default PatientDiseaseMap;
