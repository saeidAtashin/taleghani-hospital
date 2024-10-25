import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HorizontalNavbar.css"; // Optional: create a separate CSS file if needed

const HorizontalNavbar = () => {
  const items = [
    "جنسیت",
    "وضعیت تاهل",
    "شغل",
    "استان",
    "شهر",
    "سطح تحصیلات",
    "رشته تحصیلی",
    "تعداد فرزندان",
    "بیماری‌های زمینه‌ای",
    "عادات",
    "سابقه خانوادگی",
    "جراحی‌ها",
  ];

  return (
    <div className="d-flex flex-column justify-content-around align-items-start gap-3 p-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between menu-item w-100"
        >
          <span>{item}</span>
          <div className="dropdown-icon ms-2">
            <img src="/images/dropdown.svg" alt="dropdown" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalNavbar;
