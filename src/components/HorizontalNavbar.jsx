import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HorizontalNavbar.css";
import axios from "axios";

const HorizontalNavbar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputs, setInputs] = useState({});
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");

  const items = [
    { name: "جنسیت", endpoint: "gender" },
    { name: "وضعیت تاهل", endpoint: "marital-status" },
    { name: "شغل", endpoint: "job" },
    { name: "استان", endpoint: "province" },
    { name: "شهر", endpoint: "city" },
    { name: "سطح تحصیلات", endpoint: "education" },
    { name: "رشته تحصیلی", endpoint: "major-field" },
    { name: "تعداد فرزندان", endpoint: "num-of-children" },
    { name: "بیماری‌های زمینه‌ای", endpoint: "underlying-disease" },
    { name: "عادات", endpoint: "habit-disease" },
    { name: "سابقه خانوادگی", endpoint: "family-history" },
    { name: "جراحی‌ها", endpoint: "surgery" },
  ];

  const handleClick = async (item) => {
    setSelectedItem(item);

    // Fetch data for the selected item
    try {
      const response = await axios.get(
        `https://cancerreg.ir/api/v1/common/${item.endpoint}/`
      );
      setData(response.data.data.results);
    } catch (error) {
      console.error(`Error fetching data for ${item.name}:`, error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://cancerreg.ir/api/v1/common/${selectedItem.endpoint}/${id}`
        );
        // Refresh data after delete
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/common/${selectedItem.endpoint}/`
        );
        setData(response.data.data.results);
      } catch (error) {
        console.error(`Error deleting data for ${selectedItem.name}:`, error);
      }
    }
  };

  const handleAddInput = async () => {
    if (newItem.trim()) {
      try {
        await axios.post(
          `https://cancerreg.ir/api/v1/common/${selectedItem.endpoint}/`,
          {
            name: newItem,
          }
        );
        // Refresh data after adding new item
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/common/${selectedItem.endpoint}/`
        );
        setData(response.data.data.results);
        setNewItem(""); // Clear the input
      } catch (error) {
        console.error(`Error adding new item for ${selectedItem.name}:`, error);
      }
    }
  };

  return (
    <>
      <div className="cursor-pointer d-flex flex-column justify-content-around align-items-start gap-3 p-3">
        {items?.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className={`d-flex align-items-center justify-content-between menu-item w-100 ${
              selectedItem?.name === item.name ? "text-primary" : ""
            }`}
          >
            <span>{item.name}</span>
            <div className="dropdown-icon ms-2">
              <img src="/images/dropdown.svg" alt="dropdown" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div>
          {selectedItem && data.length > 0 && (
            <div className="badge-container mt-3">
              {data?.map((item) => (
                <span
                  key={item.id}
                  className="badge bg-primary me-2 d-flex align-items-center"
                >
                  {item.name}
                  <span
                    className="ms-2 text-danger cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  >
                    ✕
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          {selectedItem && (
            <div className="input-section mt-3">
              <h5>{selectedItem.name}</h5>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="form-control my-2"
                placeholder={`${selectedItem.name} را وارد نمایید`}
              />
              <button onClick={handleAddInput} className="btn btn-primary">
                Add Item
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HorizontalNavbar;
