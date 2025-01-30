import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";
import { debounce } from "lodash"; // Import debounce to prevent excessive API calls

const ScanHastei = ({ setShowAzmayeshPAge, uidScan }) => {
  const { uid } = useParams();
  const [formData, setFormData] = useState({
    patient_uid: uid,
    date: "",
    sizes: [{ size: "", site: "" }],
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [put, setPut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // To prevent auto-saving on initial load

  useEffect(() => {
    // Fetch existing data when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/records/corescan/${uidScan}/`
        );
        const { data } = response.data;
        console.log("data", data);

        if (data) {
          const persianDate = new Date(data.date)
            .toLocaleDateString("fa-IR")
            .replace(/\//g, "-");

          setFormData({
            patient_uid: data.patient.uid,
            date: data.date,
            sizes: data.involvements_list.length
              ? data.involvements_list
              : [{ size: "", site: "" }],
            description: data.description || "",
          });
          setPut(true); // Enable PUT updates only after successful submission
          setSelectedDate(persianDate);
          setIsLoaded(true);
        }
      } catch (error) {
        setPut(false); // Enable PUT updates only after successful submission
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [uidScan]);

  // Function to update API (debounced to avoid frequent calls)
  const updateData = debounce(async (updatedData) => {
    console.log("object");
  }, 1000);

  // Run PUT request only when 'put' is set to true
  useEffect(() => {
    if (isLoaded && put) {
      const involvements = formData.sizes.map((item) => ({
        site: item.site || undefined,
        size: item.size || undefined,
      }));

      const { sizes, ...rest } = formData;
      const formattedData = { ...rest, involvements };

      updateData(formattedData);
    }
  }, [formData, put]); // Only runs when `put` is true

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

  console.log("put", put);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);

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
      ...rest,
      involvements,
    };
    if (put) {
      try {
        await axios.put(
          `https://cancerreg.ir/api/v1/records/corescan/${uidScan}/`,
          formattedDataInPut
        );
        toast.success("تغییرات ذخیره شد");
      } catch (error) {
        toast.warning("خطایی رخ داده است");
        console.error(error);
      }
    } else
      try {
        await axios.post(
          "https://cancerreg.ir/api/v1/records/corescan/",
          formattedDataInPost
        );
        toast.success("ثبت شد");
        setLoadingBtn(false);
        setShowAzmayeshPAge("home");
      } catch (error) {
        toast.warning("خطایی رخ داده است");
        setLoadingBtn(false);
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
          className="p-2 border rounded"
          inputClass="w-full p-2 text-end w-100 border rounded"
          position="bottom-right"
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

export default ScanHastei;
