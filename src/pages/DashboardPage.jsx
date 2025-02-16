import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS } from "chart.js";

// Register the plugin
ChartJS.register(ChartDataLabels);

const DashboardPage = () => {
  const dashboardData = [
    {
      icon: "/images/1.svg",
      title: "تعداد کل بیماران",
      mainNumber: "1,234",
      bottomLeft: { title: "بیماران با پروسه خاتمه یافته", number: "45" },
      bottomRight: { title: "بیماران با پروسه در جریان", number: "890" },
    },
    {
      icon: "/images/2.svg",
      title: "تعداد کل درمان‌ها",
      mainNumber: "5,678",
      bottomLeft: { title: "درمان خاتمه یافته", number: "123" },
      bottomRight: { title: "درمان‌ در جریان", number: "5,555" },
    },
    {
      icon: "/images/3.svg",
      title: "تعداد کل تصویربرداری‌ها",
      mainNumber: "3,456",
      bottomLeft: { title: "تصویربرداری انجام شده", number: "89" },
      bottomRight: { title: "تصویربرداری در حال انجام", number: "3,367" },
    },
    {
      icon: "/images/4.svg",
      title: "تعداد کل آزمایشات",
      mainNumber: "2,789",
      bottomLeft: { title: "آزمایش انجام شده", number: "456" },
      bottomRight: { title: "آزمایش در حال انجام", number: "2,333" },
    },
  ];

  const [chartData] = React.useState({
    labels: [
      "سرطان سینه",
      "سرطان ریه",
      "سرطان پوست",
      "سرطان روده",
      "سرطان معده",
      "سرطان معده",
      "سرطان معده",
      "سرطان معده",
      "سرطان معده",
    ],
    datasets: [
      {
        label: "تعداد بیماران",
        data: [45, 32, 28, 22, 15, 18, 22, 50, 20],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderRadius: 8,
        borderWidth: 2,
        barPercentage: 0.4,
        categoryPercentage: 0.7,
      },
    ],
  });

  const [chartOptions] = React.useState({
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "تعداد بیماران",
          font: {
            size: 16,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "نوع سرطان",
          font: {
            size: 16,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 24,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "نمودار پراکندگی سرطان‌ها",
        font: {
          size: 32,
          weight: "bold",
        },
        padding: {
          top: 20,
          bottom: 40,
        },
      },
      legend: {
        position: "bottom",
      },
      datalabels: {
        display: true,
        color: "#000000",
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 20,
        },
        formatter: (value) => value,
        offset: 10,
        align: "",
      },
    },
    layout: {
      padding: {
        top: 40,
      },
    },
  });

  return (
    <div className="container mt-5">
      <div className="row">
        {dashboardData.map((card, index) => (
          <div key={index} className="col-md-5 mb-4">
            <Card className="h-100 shadow-lg rounded-3">
              <div className="d-flex flex-column h-100">
                {/* Top Section */}
                <div className="d-flex justify-content-around align-items-center">
                  <img
                    src={card.icon}
                    alt="icon"
                    className={` fs-1 text-primary mb-2 bg-body-secondary p-3 rounded-3`}
                  ></img>
                  <div>
                    <div className="text-center mb-3 d-flex justify-content-center align-items-center">
                      <h5 className="mb-2">{card.title}</h5>
                    </div>
                    <div className="text-center mb-3 d-flex justify-content-center align-items-center gap-2">
                      <h3 className="text-primary mb-0">{card.mainNumber}</h3>{" "}
                      <h3 className=" mb-0">نفر</h3>
                    </div>
                  </div>
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

      {/* New chart section */}
      <div className="row mt-5">
        <div className="col-12">
          <Card className="shadow-lg rounded-3">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
