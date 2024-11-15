import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Mammography = () => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: "", site: "" }],
    description: "",
    // batch_uid: "",
    // birads: "",
    // echogenicity: "",
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
      sizes: [...formData.sizes, { size: "", site: "" }],
    });
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
        "https://cancerreg.ir/api/v1/records/mammography/",
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

      {formData.sizes.map((field, index) => (
        <Row key={index} className="my-3">
          <Col>
            <Form.Group>
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="number"
                name="size"
                value={field.size}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Site</Form.Label>
              <Form.Control
                type="text"
                name="site"
                value={field.site}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button variant="secondary" onClick={addInputFields}>
        Add More
      </Button>

      {/* <Form.Group>
        <Form.Label>Batch UID</Form.Label>
        <Form.Control
          type="text"
          name="batch_uid"
          value={formData.batch_uid}
          onChange={handleFieldChange}
          required
        />
      </Form.Group> */}

      {/* <Row className="my-3">
        <Col>
          <Form.Group>
            <Form.Label>BIRADS</Form.Label>
            <Form.Control
              type="text"
              name="birads"
              value={formData.birads}
              onChange={handleFieldChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Echo Genicity</Form.Label>
            <Form.Control
              type="text"
              name="echogenicity"
              value={formData.echogenicity}
              onChange={handleFieldChange}
              required
            />
          </Form.Group>
        </Col>
      </Row> */}

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

export default Mammography;
