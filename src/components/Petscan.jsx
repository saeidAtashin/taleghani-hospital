import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const Petscan = ({ setShowAzmayeshPAge, uidScan }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    suv_max: "",
    sizes: [{ size: "", site: "" }],
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [put, setPut] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/records/petscan/${uidScan}/`
        );
        const { data } = response.data;
        if (data) {
          const persianDate = new Date(data.date)
            .toLocaleDateString("fa-IR")
            .replace(/\//g, "-");

          setFormData({
            patient_uid: data.patient.uid,
            date: data.date,
            suv_max: data.suv_max,
            sizes: data.involvements_list.length
              ? data.involvements_list
              : [{ size: "", site: "" }],
            description: data.description || "",
          });
          setSelectedDate(persianDate);
          setloadingBtn(true);
          setPut(true); // Enable PUT updates only after successful submission
        }
      } catch (error) {
        // setPut(false);
        // console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [uid]);

  const handleDateChange = (date) => {
    if (date) {
      const gregorianDate = date.convert("gregorian").toDate();
      const formattedDate = gregorianDate.toISOString().split("T")[0];
      setSelectedDate(date);
      setFormData({ ...formData, date: formattedDate });
    } else {
      setSelectedDate(null);
      setFormData({ ...formData, date: "" });
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const sizes = [...formData.sizes];
    sizes[index][name] = value;
    setFormData({ ...formData, sizes });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addInputFields = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", site: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloadingBtn(true);

    const involvements = formData?.sizes?.map((item) => ({
      site: item.site ? item.site : undefined,
      size: item.size ? item.size : undefined,
    }));

    const { sizes, patient_uid, ...rest } = formData;
    const formattedDataForPut = { ...rest, involvements };
    const formattedDataForPost = { ...rest, patient_uid, involvements };

    if (put) {
      try {
        const response = await axios.put(
          `https://cancerreg.ir/api/v1/records/petscan/${uidScan}/`,
          formattedDataForPut
        );
        setloadingBtn(false);
        toast.success("اطلاعات به‌روزرسانی شد");
        setShowAzmayeshPAge("home");
      } catch (error) {
        setloadingBtn(false);
        toast.warning("خطایی رخ داده است");
        // console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          `https://cancerreg.ir/api/v1/records/petscan/`,
          formattedDataForPost
        );
        setloadingBtn(false);
        toast.success("اطلاعات به‌روزرسانی شد");
        setShowAzmayeshPAge("home");
      } catch (error) {
        setloadingBtn(false);
        toast.warning("خطایی رخ داده است");
        // console.error(error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="d-flex flex-column">
        <Form.Label>تاریخ</Form.Label>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تاریخ را انتخاب کنید"
          className="p-2 border rounded"
          inputClass="w-full p-2 text-end w-100 border rounded"
          position="bottom-right"
        />
      </Form.Group>

      {formData?.sizes?.map((field, index) => (
        <Row key={index} className="my-3">
          <Col>
            <Form.Group>
              <Form.Label>Site</Form.Label>
              <Form.Control
                type="text"
                name="site"
                value={field.site}
                className="text-right"
                onChange={(e) => handleInputChange(index, e)}
                placeholder="مکان را وارد کنید"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="number"
                name="size"
                value={field.size}
                className="text-right"
                onChange={(e) => handleInputChange(index, e)}
                placeholder="اندازه را وارد کنید"
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button variant="secondary" onClick={addInputFields}>
        اضافه کردن
      </Button>

      <Form.Group className="my-4">
        <Form.Label>SUV max</Form.Label>
        <Form.Control
          type="text"
          name="suv_max"
          value={formData.suv_max}
          onChange={handleFieldChange}
          placeholder="مقدار SUV max را وارد نمایید"
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="my-3">
            <Form.Label>توضیحات</Form.Label>
            <Form.Control
              type="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleFieldChange}
              placeholder="توضیحات مرتبط با آزمایش را وارد کنید"
            />
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="primary">
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default Petscan;
