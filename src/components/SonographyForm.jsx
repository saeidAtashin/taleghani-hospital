import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const SonographyForm = () => {
  const { uid } = useParams();

  // Define initial state constants
  const initialFormData = {
    patient_uid: uid,
    date: "",
    sizes: [{ size: 0, site: "", description: "" }],
    description: "",
    batch_uid: undefined,
    birads: "",
    echogenicity: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingBtn, setloadingBtn] = useState(false);

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
      sizes: [...formData.sizes, { size: 0, site: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    setloadingBtn(true);
    e.preventDefault();

    // Map sizes to the required involvements format
    const involvements = formData.sizes.map((item) => ({
      site: item.site,
      size: item.size,
      // You can include description if needed
      // description: item.description,
    }));

    const formattedData = {
      patient_uid: formData.patient_uid,
      date: formData.date,
      description: formData.description,
      batch_uid: formData.batch_uid,
      birads: formData.birads,
      echogenicity: formData.echogenicity,
      involvements,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/records/sonography/",
        formattedData
      );
      toast.success("ثبت شد");

      // Reset form data and selected date
      setloadingBtn(false);

      setFormData(initialFormData);
      setSelectedDate(null);
    } catch (error) {
      setloadingBtn(false);

      toast.warning("خطایی رخ داده است.");
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
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
            className="p-2 border rounded"
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
                className="text-right"
                onChange={(e) => handleInputChange(index, e)}
                placeholder="مکان را وارد کنید" // Optional: Add a placeholder
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
                placeholder="اندازه را وارد کنید" // Optional: Add a placeholder
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button variant="secondary" onClick={addInputFields}>
        اضافه کردن
      </Button>

      <Row className="my-3">
        <Col>
          <Form.Group>
            <Form.Label>BIRADS</Form.Label>
            <Form.Control
              as="select"
              name="birads"
              value={formData.birads}
              onChange={handleFieldChange}
            >
              <option value="">Select BIRADS</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Echo Genicity</Form.Label>
            <Form.Control
              as="select"
              name="echogenicity"
              value={formData.echogenicity}
              onChange={handleFieldChange}
            >
              <option value="">Select Echo Genicity</option>
              <option value="ISO">ISO</option>
              <option value="HYPO">HYPO</option>
              <option value="HYPER">HYPER</option>
              <option value="Mixed">Mixed</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

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

      <Button type="submit" variant="primary" disabled={loadingBtn}>
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default SonographyForm;
