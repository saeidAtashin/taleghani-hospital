import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const SampleGraphy = ({ setShowAzmayeshPAge }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    title: "",
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      // size: formData.sizes.map((item) => parseFloat(item.size) || 0),
      // site: formData.sizes.map((item) => item.site),
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/records/other-graphy/",
        formattedData
      );
      toast.success("ثبت شد");
      setShowAzmayeshPAge("home");
    } catch (error) {
      toast.warning("خطایی رخ داده است");
      console.error(error);
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
          position="bottom-right" // Change this to control the position
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
