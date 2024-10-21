import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

  // State to track which submenu is active
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Function to toggle submenu open or close
  const toggleSubmenu = (submenu) => {
    // Toggle the submenu, close others
    setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
  };

  return (
    <div className="wrapper screen-height ">
      <aside
        id="sidebar"
        className={isExpanded ? "expand shadow-sm h-full" : "shadow-sm"}
      >
        <div className="d-flex align-items-center justify-content-center">
          <div className="sidebar-logo p-3">
            <h5 className="text-primary">پزشک</h5>
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

          {/* Patients Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={() => toggleSubmenu("patients")}
              aria-expanded={activeSubmenu === "patients"}
            >
              <i className="fst-normal d-flex align-items-center justify-content-between p-2">
                بیماران
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
            {/* Inner list for بیماران (Patients) */}
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "patients" ? "show" : "d-none"
              }`}
            >
              <li className="sidebar-item minheight d-flex">
                <a href="/dashboard/patients-lists" className="sidebar-link">
                  <img className="" src="/images/users.svg" alt="users" />
                  <span>لیست بیماران</span>
                </a>
              </li>
              <li className="sidebar-item d-flex">
                <a href="/dashboard/register-patient" className="sidebar-link">
                  <img src="/images/plus.svg" alt="users" />
                  <span>افزودن بیمار جدید</span>{" "}
                </a>
              </li>
            </ul>
          </li>

          {/* Reports Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={() => toggleSubmenu("reports")}
              aria-expanded={activeSubmenu === "reports"}
            >
              <i className="fst-normal d-flex align-items-center justify-content-between p-2">
                گزارش گیری
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "reports" ? "show" : "d-none"
              }`}
            >
              <li className="sidebar-item d-flex">
                <a href="/dashboard/reports" className="sidebar-link">
                  <img src="/images/users.svg" alt="report" />
                  <span> مشاهده گزارشات</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Users Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={() => toggleSubmenu("users")}
              aria-expanded={activeSubmenu === "users"}
            >
              <i className="fst-normal d-flex align-items-center justify-content-between p-2">
                کاربران <span className="">و دسترسی‌ها</span>
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "users" ? "show" : "d-none"
              }`}
            >
              <li className="sidebar-item d-flex">
                <a href="/dashboard/user-management" className="sidebar-link">
                  <img src="/images/users.svg" alt="user" />
                  <span>مدیریت کاربران</span>{" "}
                </a>
              </li>
            </ul>
          </li>

          {/* Definitions Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link has-dropdown"
              onClick={() => toggleSubmenu("definitions")}
              aria-expanded={activeSubmenu === "definitions"}
            >
              <i className="fst-normal d-flex align-items-center justify-content-between p-2">
                تعاریف پایه
                <span>
                  <img src="/images/dropdown.svg" alt="dd" />
                </span>
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "definitions" ? "show" : "d-none"
              }`}
            >
              <li className="sidebar-item d-flex">
                <a href="/dashboard/basic-definitions" className="sidebar-link">
                  <img src="/images/users.svg" alt="definitions" />
                  <span>مدیریت تعاریف</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a
            href="/"
            className={`sidebar-link d-flex items-center justify-content-around`}
          >
            <span className={`${isExpanded ? "d-block" : "d-none"}`}>
              Logout
            </span>
            <i className="lni lni-exit"></i>
          </a>
        </div>
      </aside>
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
