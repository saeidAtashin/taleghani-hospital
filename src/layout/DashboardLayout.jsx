import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

function DashboardLayout() {
  const { getItem, setItem } = useLocalStorage("isExpanded");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(
    window.innerWidth < 768 ? false : getItem() !== undefined ? getItem() : true
  );

  // Separate resize handler from localStorage effect
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      if (isMobile) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Remove getItem dependency

  // Separate localStorage effect for desktop only
  useEffect(() => {
    if (!isMobileView && isExpanded !== undefined) {
      setItem(isExpanded);
    }
  }, [isExpanded, isMobileView, setItem]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
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
        <div className="d-flex align-items-center justify-content-center position-relative">
          <div className="sidebar-logo p-3">
            {isExpanded ? (
              <>
                <h5 className="text-primary">پزشک</h5>
                <h5 className="text-dark text-nowrap">دکتر حمید رضوانی</h5>
              </>
            ) : (
              <h5 className="text-primary">دکتر رضوانی</h5>
            )}
          </div>
          <button
            className="toggle-btn p-3"
            type="button"
            onClick={handleToggle}
          >
            <i className="lni lni-grid-alt"></i>
          </button>
        </div>
        <ul className={`sidebar-nav ${!isExpanded ? "text-center" : ""}`}>
          <a
            className={`sidebar-header cursor-pointer ${
              !isExpanded ? "justify-content-center" : ""
            }`}
            style={{ cursor: "pointer" }}
            href="/dashboard"
          >
            داشبورد
          </a>

          {/* Patients Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link has-dropdown ${
                !isExpanded ? "justify-content-center" : ""
              }`}
              onClick={() => toggleSubmenu("patients")}
              aria-expanded={activeSubmenu === "patients"}
            >
              <i
                className={`fst-normal d-flex align-items-center ${
                  !isExpanded
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
              >
                {isExpanded ? "بیماران" : "بیماران"}
                {isExpanded && (
                  <span>
                    <img src="/images/dropdown.svg" alt="dd" />
                  </span>
                )}
              </i>
            </a>
            {/* Inner list for بیماران (Patients) */}
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "patients" ? "show" : "d-none"
              } ${!isExpanded ? "text-center" : ""}`}
            >
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/patients-lists"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img className="" src="/images/users.svg" alt="users" />
                  {isExpanded && <span>لیست بیماران</span>}
                </a>
              </li>
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/register-patient"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img src="/images/plus.svg" alt="users" />
                  {isExpanded && <span>افزودن بیمار جدید</span>}
                </a>
              </li>
            </ul>
          </li>

          {/* Reports Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link has-dropdown ${
                !isExpanded ? "justify-content-center" : ""
              }`}
              onClick={() => toggleSubmenu("reports")}
              aria-expanded={activeSubmenu === "reports"}
            >
              <i
                className={`fst-normal d-flex align-items-center ${
                  !isExpanded
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
              >
                {isExpanded ? "گزارش" : "گزارش"}
                {isExpanded && (
                  <span>
                    <img src="/images/dropdown.svg" alt="dd" />
                  </span>
                )}
              </i>
            </a>
            <ul
              className={`  ${activeSubmenu === "reports" ? "show" : "d-none"}`}
            >
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/reports"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img src="/images/users.svg" alt="report" />
                  {isExpanded && <span> مشاهده گزارشات</span>}
                </a>
              </li>
            </ul>
          </li>

          {/* Users Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link has-dropdown ${
                !isExpanded ? "justify-content-center" : ""
              }`}
              onClick={() => toggleSubmenu("users")}
              aria-expanded={activeSubmenu === "users"}
            >
              <i
                className={`fst-normal d-flex align-items-center ${
                  !isExpanded
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
              >
                {isExpanded ? "کاربران و دسترسی‌ها" : "کاربران"}
                {isExpanded && (
                  <span>
                    <img src="/images/dropdown.svg" alt="dd" />
                  </span>
                )}
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "users" ? "show" : "d-none"
              } ${!isExpanded ? "text-center" : ""}`}
            >
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/user-management"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img src="/images/users.svg" alt="user" />
                  {isExpanded && <span>مدیریت کاربران</span>}
                </a>
              </li>
            </ul>
          </li>

          {/* Definitions Menu */}
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link has-dropdown ${
                !isExpanded ? "justify-content-center" : ""
              }`}
              onClick={() => toggleSubmenu("definitions")}
              aria-expanded={activeSubmenu === "definitions"}
            >
              <i
                className={`fst-normal d-flex align-items-center ${
                  !isExpanded
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
              >
                {isExpanded ? (
                  <>
                    <div>
                      تعاریف <span>پایه</span>
                    </div>
                  </>
                ) : (
                  <div>تعاریف</div>
                )}
                {isExpanded && (
                  <span className="flex">
                    <img src="/images/dropdown.svg" alt="dd" className="" />
                  </span>
                )}
              </i>
            </a>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "definitions" ? "show" : "d-none"
              } ${!isExpanded ? "text-center" : ""}`}
            >
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/basic-patient-definitions"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img src="/images/users.svg" alt="definitions" />
                  {isExpanded && <span>اطلاعات ثبت نام بیمار</span>}
                </a>
              </li>
            </ul>
            <ul
              className={`sidebar-dropdown list-unstyled ${
                activeSubmenu === "definitions" ? "show" : "d-none"
              } ${!isExpanded ? "text-center" : ""}`}
            >
              <li className="sidebar-item minheight d-flex">
                <a
                  href="/dashboard/basic-test-definitions"
                  className={`sidebar-link w-100 d-flex gap-3 ${
                    !isExpanded ? "justify-content-center" : ""
                  }`}
                >
                  <img src="/images/test.svg" alt="definitions" />
                  {isExpanded && <span>اطلاعات آزمایشات</span>}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a
            href="/"
            className={`sidebar-link d-flex ${
              !isExpanded ? "justify-content-center" : "justify-content-around"
            }`}
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
