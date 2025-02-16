import React from "react";
import { Card } from "primereact/card";

const DashboardPage = () => {
  // Sample data - replace with your actual data
  const dashboardData = [
    {
      icon: "pi pi-users",
      title: "تعداد کل بیماران",
      mainNumber: "1,234",
      bottomLeft: { title: "بیماران با پروسه خاتمه یافته", number: "45" },
      bottomRight: { title: "بیماران با پروسه در جریان", number: "890" },
    },
    {
      icon: "pi pi-file",
      title: "تعداد کل درمان‌ها",
      mainNumber: "5,678",
      bottomLeft: { title: "درمان خاتمه یافته", number: "123" },
      bottomRight: { title: "درمان‌ در جریان", number: "5,555" },
    },
    {
      icon: "pi pi-images",
      title: "تعداد کل تصویربرداری‌ها",
      mainNumber: "3,456",
      bottomLeft: { title: "تصویربرداری انجام شده", number: "89" },
      bottomRight: { title: "تصویربرداری در حال انجام", number: "3,367" },
    },
    {
      icon: "pi pi-heart",
      title: "تعداد کل آزمایشات",
      mainNumber: "2,789",
      bottomLeft: { title: "در حال درمان", number: "456" },
      bottomRight: { title: "تکمیل شده", number: "2,333" },
    },
  ];

  return (
    <div className="container mt-5 ">
      <div className="row">
        {dashboardData.map((card, index) => (
          <div key={index} className="col-md-5 mb-4">
            <Card className="h-100 shadow-lg rounded-3">
              <div className="d-flex flex-column h-100">
                {/* Top Section */}
                <div className="text-center mb-3 d-flex justify-content-center align-items-center">
                  <i className={`${card.icon} fs-1 text-primary mb-2`}></i>
                  <h5 className="mb-2">{card.title}</h5>
                </div>
                <div className="text-center mb-3 d-flex justify-content-center align-items-center gap-2">
                  <h3 className="text-primary mb-0">{card.mainNumber}</h3>{" "}
                  <h3 className=" mb-0">نفر</h3>
                </div>
                {/* Divider */}
                <hr className="my-3" />
                {/* Bottom Section */}
                <div className="d-flex justify-content-between mt-auto ">
                  <div className="text-end mx-auto">
                    <div className="text-muted small ">
                      {card.bottomRight.title}
                    </div>
                    <div className="fw-bold text-center text-primary">
                      {card.bottomRight.number}
                    </div>
                  </div>
                  <div className="vr mx-2"></div>
                  <div className="text-end mx-auto">
                    <div className="text-muted small ">
                      {card.bottomLeft.title}
                    </div>
                    <div className="fw-bold text-center text-primary">
                      {card.bottomLeft.number}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
