import { motion } from "framer-motion";
import { Children, useEffect, useState } from "react";
import "../pages/DashboardPage.css";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

function DashboardLayout() {
  const { getItem, setItem } = useLocalStorage("isExpanded");
  const [isExpanded, setIsExpanded] = useState(
    getItem() !== undefined ? getItem() : true
  );
  useEffect(() => {
    setItem(isExpanded);
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <div className="wrapper ">
      <aside id="sidebar" className={isExpanded ? "expand" : ""}>
        <div className="d-flex align-items-center justify-content-center">
          <div className="sidebar-logo p-3">
            <h5 className="text-primary ">پزشک</h5>
            <h5 className="text-dark text-nowrap">دکتر حمید رضوانی</h5>
          </div>
          <button
            className="toggle-btn p-3 ehgith"
            type="button"
            onClick={handleToggle}
          >
            <i className="lni lni-grid-alt"></i>
          </button>
        </div>
        <ul className="sidebar-nav">
          <a
            className="sidebar-header p-4 cursor-pointer"
            style={{ cursor: "pointer" }}
            href="/dashboard"
          >
            داشبورد
          </a>

          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={toggleSubmenu}
              aria-expanded={isSubmenuOpen}
            >
              <i className="fst-normal d-flex align-items-center justify-content-between p-2">
                {/* <span>بیماران</span> */}
                بیماران
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled  ${
                isSubmenuOpen ? "show" : ""
              }`}
            >
              <li className="sidebar-item d-flex">
                <img src="/images/users.svg" alt="users" />
                <a href="/dashboard/patients-lists" className="sidebar-link">
                  لیست بیماران
                </a>
              </li>
              <li className="sidebar-item d-flex">
                <img src="/images/plus.svg" alt="users" />
                <a href="/dashboard/register-patient" className="sidebar-link">
                  افزودن بیمار جدید
                </a>
              </li>
            </ul>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={toggleSubmenu}
              aria-expanded={isSubmenuOpen}
            >
              <i
                className="fst-normal 
                fs-6 d-flex align-items-center justify-content-between p-2"
              >
                <div>
                  گزارش <span>گیری</span>
                </div>
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={toggleSubmenu}
              aria-expanded={isSubmenuOpen}
            >
              <i
                className="fst-normal 
                fs-6 d-flex align-items-center justify-content-between p-2"
              >
                <div>
                  <span>کاربران و </span>دسترسی‌ <span>ها</span>
                </div>
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={toggleSubmenu}
              aria-expanded={isSubmenuOpen}
            >
              <i
                className="fst-normal 
                fs-6 d-flex align-items-center justify-content-between p-2"
              >
                <div>
                  تعاریف <span>پایه</span>
                </div>
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a href="/" className="sidebar-link">
            <i className="lni lni-exit"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
