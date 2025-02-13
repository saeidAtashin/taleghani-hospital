import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import SonographyForm from "./SonographyForm";
import Mammography from "./Mammography";
import Mri from "./Mri";
import Ctscan from "./Ctscan";
import ScanHastei from "./ScanHastei";
import Petscan from "./Petscan";
import SampleGraphy from "./SampleGraphy";
import axios from "axios";
import { toast } from "react-toastify";

const PillsTabsTasvir = ({
  dataOfTable,
  allrow,
  setShowAzmayeshPAge,
  isFromParent = false,
}) => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Set active tab based on the clicked record type
    if (dataOfTable?.activeRecord) {
      setActiveTab(dataOfTable.activeRecord);
    } else if (dataOfTable?.records?.[0]?.record_type) {
      // Fallback to first record if no specific record was clicked
      setActiveTab(dataOfTable.records[0].record_type);
    } else {
      // If no records, default to first tab (sonography)
      setActiveTab("sonography");
    }
  }, [dataOfTable]);

  const getUidForTab = (tabEventKey) => {
    if (dataOfTable?.records) {
      const record = dataOfTable.records.find(
        (record) => record.record_type === tabEventKey
      );
      return record?.uid;
    }
    return dataOfTable?.uid;
  };

  const getTabBadgeColor = (tab) => {
    if (dataOfTable?.records) {
      const record = dataOfTable.records.find(
        (record) => record.record_type === tab.eventKey
      );
      if (record?.state === "IN_PROGRESS") {
        return "#ff9008"; // Orange
      }
      if (record?.state === "DONE") {
        return "#3ff369"; // Green
      }
    }
    return null;
  };

  const tabsInnerImage = [
    {
      eventKey: "sonography",
      title: "سونوگرافی",
      content: (
        <SonographyForm
          uidScan={getUidForTab("sonography")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "sonography" })}
        />
      ),
    },
    {
      eventKey: "mammography",
      title: "ماموگرافی",
      content: (
        <Mammography
          uidScan={getUidForTab("mammography")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "mammography" })}
        />
      ),
    },
    {
      eventKey: "mri",
      title: "MRI",
      content: (
        <Mri
          uidScan={getUidForTab("mri")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "mri" })}
        />
      ),
    },
    {
      eventKey: "ctscan",
      title: "CT-Scan",
      content: (
        <Ctscan
          uidScan={getUidForTab("ctscan")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "ctscan" })}
        />
      ),
    },
    {
      eventKey: "corescan",
      title: "اسکن هسته ای",
      content: (
        <ScanHastei
          uidScan={getUidForTab("corescan")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "corescan" })}
        />
      ),
    },
    {
      eventKey: "petscan",
      title: "PET-Scan",
      content: (
        <Petscan
          uidScan={getUidForTab("petscan")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "petscan" })}
        />
      ),
    },
    {
      eventKey: "othergraphy",
      title: "گرافی ساده",
      content: (
        <SampleGraphy
          uidScan={getUidForTab("othergraphy")}
          setShowAzmayeshPAge={setShowAzmayeshPAge}
          badgeColor={getTabBadgeColor({ eventKey: "othergraphy" })}
        />
      ),
    },
  ];

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  const hasMatchingRecord = (eventKey) => {
    return allrow?.records?.some((record) => record.record_type === eventKey);
  };

  const handleDelete = (recordType, uid) => {
    const deleteEndpoints = {
      sonography: "sonography",
      mammography: "mammography",
      mri: "mri",
      ctscan: "ctscan",
      corescan: "corescan",
      petscan: "petscan",
      othergraphy: "other-graphy",
    };

    const endpoint = deleteEndpoints[recordType];
    if (!endpoint) {
      toast.error("نوع رکورد نامعتبر است");
      return;
    }

    axios
      .delete(`https://cancerreg.ir/api/v1/records/${endpoint}/${uid}/`)
      .then(() => {
        toast.success("با موفقیت حذف شد");
        setShowAzmayeshPAge("home");
      })
      .catch(() => {
        toast.error("خطا در حذف");
      });
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Nav variant="pills">
        {tabsInnerImage?.map((tab) => {
          const badgeColor = getTabBadgeColor(tab);
          const isActive = activeTab === tab.eventKey;
          const recordUid = getUidForTab(tab.eventKey);

          return (
            <Nav.Item key={tab.eventKey} className="m-2 position-relative">
              <div className="d-flex align-items-center">
                <Nav.Link
                  className={`border ${isActive ? "active-tab" : ""}`}
                  eventKey={tab.eventKey}
                >
                  {tab.title}
                  {badgeColor && (
                    <span
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: badgeColor,
                      }}
                    ></span>
                  )}
                </Nav.Link>
                {recordUid && (
                  <i
                    className="pi pi-trash p-2 text-danger cursor-pointer"
                    style={{ fontSize: "0.875rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tab.eventKey, recordUid);
                    }}
                  />
                )}
              </div>
            </Nav.Item>
          );
        })}
      </Nav>
      <h4 className="my-4 mx-2">
        ثبت {tabsInnerImage.find((t) => t.eventKey === activeTab)?.title} جدید
      </h4>

      <Tab.Content className="mt-3">
        {tabsInnerImage.map((tab) => (
          <Tab.Pane eventKey={tab.eventKey} key={tab.eventKey}>
            {activeTab === tab.eventKey &&
              hasMatchingRecord(tab.eventKey) &&
              allrow.order_description && (
                <h6 className="mb-5">
                  توضیحات نسخه: {allrow.order_description}
                </h6>
              )}
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default PillsTabsTasvir;
