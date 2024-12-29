import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const Mammography = (fetchData) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: null, site: "", description: "" }],
    description: "",
    batch_uid: undefined,
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

  const addInputFields = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: null, site: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map sizes to involvements
    const involvements = formData.sizes.map((item) => ({
      site: item.site,
      size: item.size,
      // additionalProp3: item.description,
    }));

    const formattedData = {
      patient_uid: formData.patient_uid,
      date: formData.date,
      description: formData.description,
      batch_uid: formData.batch_uid,
      involvements,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/records/mammography/",
        formattedData
      );
      toast.success("ثبت شد");
    } catch (error) {
      toast.warning("خطایی رخ داده است");
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        {/* <Form.Label>تاریخ</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleFieldChange}
        /> */}15    

        <div className="d-flex flex-column">
          <label className="label" htmlFor="date">
            تاریخ
          </label>
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
        </div>
      </Form.Group>

      {formData.sizes.map((field, index) => (
        <Row key={index} className="my-3">
          <Col>
            <Form.Group>
              <Form.Label>Site</Form.Label>
              <Form.Control
                type="text"
                name="site"
                value={field.site}
                onChange={(e) => handleInputChange(index, e)}
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
                onChange={(e) => handleInputChange(index, e)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={field.description}
                onChange={(e) => handleInputChange(index, e)}
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button variant="secondary" onClick={addInputFields}>
        اضافه کردن
      </Button>

      {/* <Form.Group className="my-3">
        <Form.Label>Batch UID</Form.Label>
        <Form.Control
          type="text"
          name="batch_uid"
          value={formData.batch_uid}
          onChange={handleFieldChange}
        />
      </Form.Group> */}

      <Form.Group className="my-3">
        <Form.Label>توضیحات</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleFieldChange}
          placeholder="توضیحات مرتبط با آزمایش را وارد کنید"
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default Mammography;
