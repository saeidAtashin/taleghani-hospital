import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const SampleGraphy = ({ setShowAzmayeshPAge, uidScan }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    title: "",
    order_description: "",
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [put, setPut] = useState(false);

  useEffect(() => {
    // Fetch existing data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/records/other-graphy/${uidScan}/`
        );
        const { data } = response.data;
        if (data) {
          const persianDate = new Date(data.date)
            .toLocaleDateString("fa-IR")
            .replace(/\//g, "-");

          setFormData({
            patient_uid: data.uid,
            date: data.date,
            title: data.title,
            order_description: data.order_description,
            description: data.description || "",
          });
          setPut(true); // Enable PUT updates only after successful submission
          setSelectedDate(persianDate);
        }
      } catch (error) {
        setPut(false); // Enable PUT updates only after successful submission
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [uidScan]);

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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patient_uid, ...rest } = formData;

    const formattedDataInPost = {
      ...rest,
      patient_uid,
    };

    const formattedDataInPut = {
      ...rest,
    };
    if (put) {
      try {
        await axios.put(
          `https://cancerreg.ir/api/v1/records/other-graphy/${uidScan}/`,
          formattedDataInPut
        );
        toast.success("تغییرات ذخیره شد");
      } catch (error) {
        toast.warning("خطایی رخ داده است");
        // console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          "https://cancerreg.ir/api/v1/records/other-graphy/",
          formattedDataInPost
        );
        toast.success("ثبت شد");
        setShowAzmayeshPAge("home");
      } catch (error) {
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
          className=" p-2 border rounded "
          inputClass="w-full p-2 text-end w-100 border rounded"
          position="bottom-right"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="mt-4">عنوان</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleFieldChange}
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

export default SampleGraphy;
