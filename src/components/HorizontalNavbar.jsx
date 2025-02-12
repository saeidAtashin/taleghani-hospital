import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HorizontalNavbar.css";
import apiRequest from "../api/apiService";
import Swal from "sweetalert2";

const HorizontalNavbar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  const items = [
    { name: "جنسیت", endpoint: "/common/gender/" },
    { name: "وضعیت تاهل", endpoint: "/common/marital-status/" },
    { name: "شغل", endpoint: "/common/job/" },
    { name: "استان", endpoint: "/common/province/" },
    { name: "شهر", endpoint: "/common/city/" },
    { name: "سطح تحصیلات", endpoint: "/common/education/" },
    { name: "رشته تحصیلی", endpoint: "/common/major-field/" },
    { name: "تعداد فرزندان", endpoint: "/common/num-of-children/" },
    { name: "بیماری‌های زمینه‌ای", endpoint: "/common/underlying-disease/" },
    { name: "عادات", endpoint: "/common/habit-disease/" },
    { name: "سابقه خانوادگی", endpoint: "/common/family-history/" },
    { name: "جراحی‌ها", endpoint: "/common/surgery/" },
    { name: "تشخیص", endpoint: "/common/diagnosis/" },
    { name: "پروتکل", endpoint: "/common/protocol/" },
    { name: "ارزیابی درمان", endpoint: "/common/treatment-evaluation/" },
  ];

  const handleClick = async (item) => {
    setSelectedItem(item);
    setLoading(true);

    try {
      const response = await apiRequest("get", item.endpoint);
      if (item.name === "استان") {
        setProvinces(response.data.data.results);
      }
      setData(response.data.data.results);
    } catch (error) {}
    setLoading(false);
  };

  const handleAddInput = async () => {
    if (newItem.trim()) {
      setLoading(true);

      try {
        if (selectedItem.name === "شهر" && !selectedProvince) {
          Swal.fire({
            title: "لطفاً ابتدا یکی از استان‌ها را انتخاب کنید.",
            icon: "warning",
            showConfirmButton: true,
          });
          setLoading(false);
          return;
        }

        const payload =
          selectedItem.name === "شهر"
            ? { name: newItem, province_id: selectedProvince }
            : { name: newItem };

        await apiRequest("post", selectedItem.endpoint, payload);
        const response = await apiRequest("get", selectedItem.endpoint);
        setData(response.data.data.results);
        setNewItem("");
      } catch (error) {}
      setLoading(false);
    }
  };

  const comonDefFetch = async (id) => {
    setLoading(true);
    try {
      await apiRequest("delete", `${selectedItem.endpoint}${id}/`);
      const response = await apiRequest("get", selectedItem.endpoint);
      setData(response.data.data.results);
      Swal.fire({
        title: "عملیات با موفقیت انجام شد.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {}
    setLoading(false);
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: `آیا از حذف ${item?.name} اطمینان دارید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "لغو",
    }).then((result) => {
      if (result.isConfirmed) {
        comonDefFetch(item?.id);
      }
    });
  };

  return (
    <div className="horizontal-navbar-container w-100">
      <div className="menu-sidebar">
        {items?.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className={`menu-item shadow mt-4 me-4 mb-4 ${
              selectedItem?.name === item.name ? "active" : ""
            }`}
          >
            <span>{item.name}</span>
            <div className="dropdown-icon">
              <img src="/images/dropdown.svg" alt="dropdown" />
            </div>
          </div>
        ))}
      </div>

      <div className="content-area pt-4 shadow">
        {selectedItem && selectedItem.name === "شهر" && (
          <div className="mb-4">
            <label className="form-label" htmlFor="provinceSelect">
              انتخاب استان:
            </label>
            <select
              id="provinceSelect"
              className="form-select"
              onChange={(e) => setSelectedProvince(e.target.value)}
              value={selectedProvince || ""}
            >
              <option value="">انتخاب کنید</option>
              {provinces.map((province, index) => (
                <option key={index} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedItem && (
          <div className="input-section">
            <h5 className="mb-3">{selectedItem.name}</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="form-control"
                placeholder={`${selectedItem.name} را وارد نمایید`}
              />
              <button
                onClick={handleAddInput}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "افزودن"
                )}
              </button>
            </div>

            {data.length > 0 && (
              <div className="badge-container">
                {data?.map((item, index) => (
                  <span key={index} className="badge">
                    {item.name}
                    <span
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalNavbar;
