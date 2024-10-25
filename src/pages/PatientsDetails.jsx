import React from "react";
import ReusableTabs from "../ReusableForm/ReusableTabs";

const PatientsDetails = () => {
  const tabs = [
    {
      key: "اطلاعات هویتی",
      label: "اطلاعات هویتی",
      content: <div>اطلاعات هویتی </div>,
    },
    {
      key: "سوابق بیمار",
      label: "سوابق بیمار",
      content: <div>سوابق بیمار</div>,
    },
    {
      key: "اطلاعات بیماری",
      label: "اطلاعات بیماری",
      content: <div>اطلاعات بیماری</div>,
    },
    {
      key: "تصویربرداری",
      label: "تصویربرداری",
      content: <div>تصویربرداری</div>,
    },
    {
      key: "آزمایشات",
      label: "آزمایشات",
      content: <div>آزمایشات</div>,
    },
    {
      key: "درمان",
      label: "درمان",
      content: <div>درمان</div>,
    },
    {
      key: "follow up",
      label: "follow up",
      content: <div>follow up</div>,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-5">بیمار امیررضا موحدی - 0024534961</h2>
      <ReusableTabs tabs={tabs} defaultActiveKey="اطلاعات هویتی" />
    </div>
  );
};

export default PatientsDetails;
