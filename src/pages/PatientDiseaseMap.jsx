import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import Step3Form from "./Step3Form";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

const PatientDiseaseMap = () => {
  const [data, setData] = useState([]);
  const [showAdd, setshowAdd] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const { uid } = useParams();

  useEffect(() => {
    fetch(`https://cancerreg.ir/api/v1/patient/patient-disease/${uid}/`)
      .then((response) => response.json())
      .then((data) => setData(data?.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, [refresh]);

  return (
    <div className="p-4">
      {!showAdd && (
        <Button
          label="افزودن"
          className="rounded mb-3"
          onClick={() => {
            setshowAdd(true);
          }}
        />
      )}
      {showAdd && (
        <Button
          label="لغو"
          className="rounded mb-3"
          onClick={() => {
            setshowAdd(false);
          }}
        />
      )}
      {data?.length > 0 ? (
        <Accordion>
          {data?.map((item) => (
            <AccordionTab
              key={item.uid}
              header={`نوع بدخیمی: ${item.type} - آخرین تغییرات: ${
                item?.updated_at
                  ? new DateObject({
                      date: item?.updated_at,
                      calendar: "gregorian",
                    })
                      .convert(persian)
                      .format("YYYY/MM/DD")
                  : ""
              }`}
            >
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

      <div>
        {showAdd && (
          <Step3Form
            patient_uid={uid}
            onNext={() => {
              setshowAdd(false);
              setrefresh(!refresh);
            }}
          />
        )}
      </div>
      {/* Placeholder map, update lat/lng as needed */}
      <p>{/* <strong>Type:</strong> {item.type} */}</p>
    </div>
  );
};

export default PatientDiseaseMap;
