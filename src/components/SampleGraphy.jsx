import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SampleGraphy = () => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    title: "",
    description: "",
  });

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
      size: formData.sizes.map((item) => parseFloat(item.size) || 0),
      site: formData.sizes.map((item) => item.site),
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/records/other-graphy/",
        formattedData
      );
      alert("Data submitted successfully");
    } catch (error) {
      alert("Error submitting data");
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>تاریخ</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleFieldChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>عنوان</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => handleInputChange(index, e)}
          required
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
              required
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
