import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

const Ctscan = ({ setShowAzmayeshPAge, uidScan }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: "", site: "" }],
    description: "",
    density: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingBtn, setloadingBtn] = useState(false);
  const [put, setPut] = useState(false);

  useEffect(() => {
    // Fetch existing data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/records/ctscan/${uidScan}/`
        );
        const { data } = response.data;
        if (!date) return "-"; // or return null, or any default value

        if (data) {
          const persianDate = new Date(data.date)
            .toLocaleDateString("fa-IR")
            .replace(/\//g, "-");

          setFormData({
            patient_uid: data.patient.uid,
            date: data.date,
            density: data.density,
            sizes: data.involvements_list.length
              ? data.involvements_list
              : [{ size: "", site: "" }],
            description: data.description || "",
          });
          setPut(true);
          setSelectedDate(persianDate);
        }
      } catch (error) {
        setPut(false);
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
      sizes: [...formData.sizes, { size: "", site: "" }],
    });
  };

  const handleSubmit = async (e) => {
    setloadingBtn(true);
    e.preventDefault();

    const involvements = formData.sizes.map((item) => ({
      site: item.site ? item.site : undefined,
      size: item.size ? item.size : undefined,
    }));

    const { sizes, patient_uid, ...rest } = formData;

    const formattedDataInPost = {
      ...rest,
      patient_uid,
      involvements,
    };

    const formattedDataInPut = {
      patient_uid,
      ...rest,
      involvements,
    };
    if (uidScan) {
      try {
        await axios.put(
          `https://cancerreg.ir/api/v1/records/ctscan/${uidScan}/`,
          formattedDataInPut
        );
        toast.success("تغییرات ذخیره شد");
        setloadingBtn(false);

        setShowAzmayeshPAge("home");
      } catch (error) {
        setloadingBtn(false);

        toast.warning("خطایی رخ داده است");
      }
    } else {
      try {
        const response = await axios.post(
          "https://cancerreg.ir/api/v1/records/ctscan/",
          formattedDataInPost
        );
        setloadingBtn(false);
        toast.success("ثبت شد");
        setShowAzmayeshPAge("home");
      } catch (error) {
        setloadingBtn(false);
        toast.warning("خطایی رخ داده است.");
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
            position="bottom-right"
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
      <Form.Group className="my-3">
        <Form.Label>Density</Form.Label>
        <Form.Select
          aria-label="Default select example"
          name="density" // Add the name attribute
          value={formData.density} // Bind the value to formData.density
          onChange={handleFieldChange} // Handle the change
        >
          <option value="">از زیر منو انتخاب کنید</option>
          <option value="Iso Dense">Iso Dense</option>
          <option value="Hypo Dense">Hypo Dense</option>
          <option value="Hyper Dense">Hyper Dense</option>
        </Form.Select>
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
      <Button type="submit" variant="primary" disabled={loadingBtn}>
        تایید و ثبت نتایج
      </Button>
    </Form>
  );
};

export default Ctscan;
