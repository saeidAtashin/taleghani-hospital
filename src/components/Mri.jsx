import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const Mri = ({ setShowAzmayeshPAge, uidScan }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: "", site: "", description: "" }], // Added description
    description: "",
    signal: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [put, setPut] = useState(false);

  useEffect(() => {
    // Fetch existing data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/records/mri/${uidScan}/`
        );
        const { data } = response.data;

        if (data) {
          const persianDate = new Date(data.date)
            .toLocaleDateString("fa-IR")
            .replace(/\//g, "-");

          setFormData({
            patient_uid: data.patient.uid,
            date: data.date,
            signal: data.signal,
            sizes: data.involvements_list.length
              ? data.involvements_list
              : [{ size: "", site: "" }],
            description: data.description || "",
          });
          setPut(true); // Enable PUT updates only after successful submission
          setSelectedDate(persianDate);
          // setIsLoaded(true);
        }
      } catch (error) {
        setPut(false); // Enable PUT updates only after successful submission
        console.error("Error fetching data:", error);
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
    setloadingBtn(true);

    const involvements = formData.sizes.map((item) => ({
      site: item.site,
      size: item.size,
      description: item.description,
    }));

    const formattedData = {
      patient_uid: formData.patient_uid,
      date: formData.date,
      description: formData.description,
      batch_uid: formData.batch_uid,
      signal: formData.signal,
      involvements,
    };

    const formattedDataInPut = {
      date: formData.date,
      description: formData.description,
      batch_uid: formData.batch_uid,
      signal: formData.signal,
      involvements,
    };

    if (put) {
      try {
        await axios.put(
          `https://cancerreg.ir/api/v1/records/mri/${uidScan}/`,
          formattedDataInPut
        );
        toast.success("تغییرات ذخیره شد");
      } catch (error) {
        toast.warning("خطایی رخ داده است");
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          "https://cancerreg.ir/api/v1/records/mri/",
          formattedData
        );
        setloadingBtn(false);
        toast.success("ثبت شد");
        setShowAzmayeshPAge("home");
      } catch (error) {
        setloadingBtn(false);
        toast.warning("خطایی رخ داده است.");
        console.error(error);
      }
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

      <Button type="submit" variant="primary" disabled={loadingBtn}>
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default Mri;
