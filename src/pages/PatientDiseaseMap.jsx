import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import Step3Form from "./Step3Form";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

const PatientDiseaseMap = ({ setDiseaseType }) => {
  const [data, setData] = useState([]);
  const [diseaseDetails, setDiseaseDetails] = useState({});
  const [showAdd, setshowAdd] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const { uid } = useParams();

  useEffect(() => {
    fetch(`https://cancerreg.ir/api/v1/patient/patient-disease/${uid}/`)
      .then((response) => response.json())
      .then((data) => {
        setData(data?.results || []);
        if (data?.results?.[0]?.type) {
          setDiseaseType(data.results[0].type);
        }
      })
      .catch();
  }, [refresh, uid, setDiseaseType]);

  useEffect(() => {
    if (data.length === 0) return;

    const fetchDetails = async () => {
      const details = {};
      await Promise.all(
        data.map(async (item) => {
          try {
            const response = await fetch(
              `https://cancerreg.ir/api/v1/patient/user-disease/${item.uid}/`
            );
            const result = await response.json();
            details[item.uid] = result?.data || null;
          } catch (error) {
            console.error(`Error fetching details for ${item.uid}:`, error);
          }
        })
      );
      setDiseaseDetails(details);
    };

    fetchDetails();
  }, [data]);

  return (
    <div className="p-4">
      {!showAdd && (
        <Button
          label="افزودن"
          className="rounded mb-3"
          onClick={() => setshowAdd(true)}
        />
      )}
      {showAdd && (
        <Button
          label="لغو"
          className="rounded mb-3"
          onClick={() => setshowAdd(false)}
        />
      )}

      {data.length > 0 ? (
        <Accordion>
          {data.map((item) => (
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

              {diseaseDetails[item.uid] ? (
                <>
                  <h4>جزئیات بیماری</h4>
                  <p>
                    <strong>مرحله:</strong>{" "}
                    {diseaseDetails[item.uid]?.disease_data?.stage}
                  </p>

                  <h5>تومورهای اولیه:</h5>
                  {diseaseDetails[item.uid]?.disease_data?.primary_tumors?.map(
                    (tumor, index) => (
                      <p key={index}>
                        <strong>محل:</strong> {tumor.site},{" "}
                        <strong>اندازه:</strong> {tumor.size},{" "}
                        <strong>توضیح:</strong> {tumor.description}
                      </p>
                    )
                  )}

                  <h5>غدد لنفاوی مجاور:</h5>
                  {diseaseDetails[item.uid]?.disease_data?.nearby_lymphs?.map(
                    (lymph, index) => (
                      <p key={index}>
                        <strong>محل:</strong> {lymph.site},{" "}
                        <strong>اندازه:</strong> {lymph.size},{" "}
                        <strong>توضیح:</strong> {lymph.description}
                      </p>
                    )
                  )}

                  <h5>متاستاز:</h5>
                  {diseaseDetails[item.uid]?.disease_data?.metastasis?.map(
                    (metastasis, index) => (
                      <p key={index}>
                        <strong>محل:</strong> {metastasis.site},{" "}
                        <strong>اندازه:</strong> {metastasis.size},{" "}
                        <strong>توضیح:</strong> {metastasis.description}
                      </p>
                    )
                  )}
                </>
              ) : (
                <p>در حال بارگذاری جزئیات بیماری...</p>
              )}
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <p>اطلاعاتی ثبت نشده است.</p>
      )}

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
  );
};

export default PatientDiseaseMap;
