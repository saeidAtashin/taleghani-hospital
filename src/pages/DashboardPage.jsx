import React, { useState } from "react";
import "./DashboardPage.css";
import "../script";
const DashboardPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <div className="">
   dashboard
    </div>
  );
};

export default DashboardPage;
