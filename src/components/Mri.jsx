import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Mri = () => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: "", site: "", description: "" }], // Added description
    description: "",
    signal: "",
    batch_uid: "",
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

  const addInputFields = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", site: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map sizes to involvements
    const involvements = formData.sizes.map((item) => ({
      additionalProp1: item.site,
      additionalProp2: item.size,
      additionalProp3: item.description,
    }));

    const formattedData = {
      patient_uid: formData.patient_uid,
      date: formData.date,
      description: formData.description,
      batch_uid: formData.batch_uid,
      signal: formData.signal,
      involvements,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/records/mri/",
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
        />
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
        Add More
      </Button>

      <Form.Group className="my-3">
        <Form.Label>Signal</Form.Label>
        <Form.Select
          aria-label="Default select example"
          name="signal"
          value={formData.signal}
          onChange={handleFieldChange}
        >
          <option value="">از زیر منو انتخاب کنید</option>
          <option value="Iso Intense">Iso Intense</option>
          <option value="Hypo Intense">Hypo Intense</option>
          <option value="Hyper Intense">Hyper Intense</option>
        </Form.Select>
      </Form.Group>

      {/* <Form.Group className="my-3">
        <Form.Label>Batch UID</Form.Label>
        <Form.Control
          type="text"
          name="batch_uid"
          value={formData.batch_uid}
          onChange={handleFieldChange}
        />
      </Form.Group> */}

      <Row>
        <Col>
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
        </Col>
      </Row>

      <Button type="submit" variant="primary">
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default Mri;
