import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import Step3Form from "./Step3Form";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

const PatientDiseaseMap = ({ setDiseaseType }) => {
  const [data, setData] = useState([]);
  const [diseaseDetails, setDiseaseDetails] = useState({});
  const [showAdd, setshowAdd] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const { uid } = useParams();
  const [editingDisease, setEditingDisease] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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

  const handleEditSubmit = async (formData, diseaseUid) => {
    try {
      const response = await axios.put(
        `https://cancerreg.ir/api/v1/patient/user-disease/${diseaseUid}/`,
        formData
      );
      if (response.status >= 200 && response.status < 400) {
        toast.success("اطلاعات با موفقیت بروزرسانی شد");
        setShowEditDialog(false);
        setEditingDisease(null);
        setrefresh(!refresh); // Refresh the list
      }
    } catch (error) {
      toast.error("خطا در بروزرسانی اطلاعات");
    }
  };

  const renderDetailItem = (label, value) => {
    if (!value) return null;
    return (
      <div className="col-12 md:col-6 lg:col-4 mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="font-bold text-primary">{label}:</span>
          <span>{value}</span>
        </div>
      </div>
    );
  };

  const renderItemsList = (items, title) => {
    if (!items?.length) return null;
    return (
      <div className="mt-4">
        <h5 className="text-primary mb-3">{title}</h5>
        <div className="grid">
          {items.map((item, index) => (
            <div key={index} className="col-12 md:col-6 lg:col-4 mb-3">
              <Card className="shadow rounded-2">
                <div className="d-flex flex-column gap-2 ">
                  {renderDetailItem("محل", item.site)}
                  {renderDetailItem("اندازه", item.size)}
                  {item.description && (
                    <div className="mt-2">
                      <span className="font-bold text-primary">توضیحات:</span>
                      <p className="mt-1 mb-0 text-justify">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
              header={
                <div className="d-flex justify-content-between align-items-center w-100 ">
                  <span>{`نوع بدخیمی: ${item.type} - آخرین تغییرات: ${
                    item?.updated_at
                      ? new DateObject({
                          date: item?.updated_at,
                          calendar: "gregorian",
                        })
                          .convert(persian)
                          .format("YYYY/MM/DD")
                      : ""
                  }`}</span>
                  <Button
                    label="ویرایش"
                    icon="pi pi-pencil"
                    className="p-button-text"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingDisease(item);
                      setShowEditDialog(true);
                    }}
                  />
                </div>
              }
            >
              <div className="p-3">
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Tag
                    className="rounded-2"
                    severity={item.type === "SOLID" ? "warning" : "info"}
                    value={`نوع: ${item.type}`}
                  />
                  <Tag
                    className="rounded-2"
                    severity="info"
                    value={`تشخیص: ${item.diagnosis}`}
                  />
                </div>

                {diseaseDetails[item.uid] ? (
                  <div>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      {diseaseDetails[item.uid]?.disease_data?.stage && (
                        <Tag
                          className="rounded-2"
                          severity="success"
                          value={`مرحله: ${
                            diseaseDetails[item.uid]?.disease_data?.stage
                          }`}
                        />
                      )}
                      {diseaseDetails[item.uid]?.disease_data?.b_symptoms && (
                        <Tag
                          severity="warning"
                          value={`B symptoms: ${
                            diseaseDetails[item.uid]?.disease_data?.b_symptoms
                          }`}
                        />
                      )}
                      {diseaseDetails[item.uid]?.disease_data?.spleen && (
                        <Tag
                          severity="info"
                          value={`Spleen: ${
                            diseaseDetails[item.uid]?.disease_data?.spleen
                          }`}
                        />
                      )}
                    </div>

                    <Divider />

                    {item.type === "SOLID" ? (
                      <>
                        {renderItemsList(
                          diseaseDetails[item.uid]?.disease_data
                            ?.primary_tumors,
                          "تومورهای اولیه"
                        )}
                        {renderItemsList(
                          diseaseDetails[item.uid]?.disease_data?.nearby_lymphs,
                          "غدد لنفاوی مجاور"
                        )}
                        {renderItemsList(
                          diseaseDetails[item.uid]?.disease_data?.metastasis,
                          "متاستاز"
                        )}
                      </>
                    ) : (
                      renderItemsList(
                        diseaseDetails[item.uid]?.disease_data?.lymph_nodes,
                        "LN involmentN"
                      )
                    )}
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center p-4">
                    {/* <i className="pi pi-spin pi-spinner me-2" /> */}
                    {/* <span>اطلاعات به درستی دریافت نشد...</span> */}
                  </div>
                )}
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <div className="text-center p-4">
          <i className="pi pi-info-circle text-primary mb-2 fs-4" />
          <p className="mb-0">اطلاعاتی ثبت نشده است.</p>
        </div>
      )}

      <Dialog
        visible={showEditDialog}
        onHide={() => {
          setShowEditDialog(false);
          setEditingDisease(null);
        }}
        header="ویرایش اطلاعات بیماری"
        style={{ width: "90vw", maxWidth: "960px" }}
        modal
      >
        {editingDisease && (
          <Step3Form
            patient_uid={uid}
            initialData={{
              type: editingDisease.type,
              diagnosis_uid: editingDisease.diagnosis,
              disease_data: diseaseDetails[editingDisease.uid]?.disease_data,
            }}
            onNext={(formData) =>
              handleEditSubmit(formData, editingDisease.uid)
            }
            isEditing={true}
          />
        )}
      </Dialog>

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
