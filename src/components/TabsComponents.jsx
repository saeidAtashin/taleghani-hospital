import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const TabsComponents = ({
  onSaveChanges,
  onSaveChangesSub,
  categories,
  items,
  activeIndex,
  setShowWhatGet,
  onSaveChangestitle,
  titles,
}) => {
  const [name, setName] = useState("");
  const [nameSub, setNameSub] = useState("");
  const [ordering, setOrdering] = useState(0);
  const [orderingSub, setOrderingSub] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(""); // For the select input
  const [selectedtitle, setSelectedtitle] = useState(""); // For the select input
  const [nametitle, setNametitle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [orderingtitle, setOrderingtitle] = useState(0);

  console.log("categories", categories);
  console.log("items", items);
  console.log("titles", titles);

  return (
    <div className="w-100 shadow-lg">
      <Tabs>
        <TabList>
          <Tab onClick={() => setShowWhatGet("")}>
            <p>زیرگروه‌ها</p>
          </Tab>
          <Tab onClick={() => setShowWhatGet("showSub")}>
            <p>عنوان</p>
          </Tab>
          <Tab onClick={() => setShowWhatGet("showTitle")}>
            <p>نام آزمایش</p>
          </Tab>
          <Tab>
            <p>آیتم‌ها</p>
          </Tab>
        </TabList>

        <TabPanel>
          <div className="panel-content h-100 d-flex align-items-start justify-content-start border p-4">
            <div className="d-flex flex-column align-items-start justify-content-between h-100 w-100">
              <div className="d-flex gap-2">
                <Button
                  className="align-left rounded-3"
                  label="ذخیره تغییرات"
                  onClick={() => {
                    if (!selectedCategory) {
                      alert("لطفاً یک دسته‌بندی انتخاب کنید.");
                      return;
                    }
                    onSaveChanges(name, ordering, selectedCategory);
                    setName("");
                  }}
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                  onClick={() => setName("")}
                />
              </div>
              <div className="p-field d-flex flex-column mb-4 w-100">
                <InputText
                  className="rounded-2"
                  placeholder="زیرگروه"
                  autoComplete="false"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="p-field d-flex flex-column mb-4 d-none">
                <label htmlFor="ordering">ترتیب</label>
                <InputText
                  id="ordering"
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content h-100 d-flex align-items-start justify-content-start border p-4">
            <div className="d-flex flex-column align-items-start justify-content-between h-100 w-100">
              <div className="d-flex gap-2">
                <Button
                  className="align-left rounded-3"
                  label="ذخیره تغییرات"
                  onClick={() => {
                    onSaveChangesSub(nameSub, orderingSub, selectedCategory);
                    setNameSub("");
                    setSelectedCategory(""); // Reset the selected category after submission
                  }}
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                />
              </div>
              <div className="p-field d-flex align-items-end gap-2 mb-4 w-100">
                <InputText
                  className="rounded-2 w-50 "
                  placeholder="عنوان"
                  autoComplete="false"
                  id="nameSub"
                  value={nameSub}
                  onChange={(e) => setNameSub(e.target.value)}
                />
                <div className="p-field d-flex flex-column w-50">
                  <label htmlFor="categorySelect">انتخاب دسته‌بندی</label>
                  <select
                    id="categorySelect"
                    className="form-select rounded-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">یک دسته‌بندی انتخاب کنید</option>

                    {Object.entries(categories).map(([uid, category]) => {
                      if (uid === items[activeIndex]?.uid) {
                        return (
                          <React.Fragment key={uid}>
                            {category?.items?.map((item, index) => (
                              <option
                                key={item.uid || index} // Use a unique identifier for items
                                value={item.uid} // Assuming item.uid uniquely identifies the item
                              >
                                {item.name}
                                {/* (Subcategory) */}
                              </option>
                            ))}
                          </React.Fragment>
                        );
                      }
                      return null; // Don't render categories that don't match the active index
                    })}
                  </select>
                </div>
              </div>
              <div className="p-field d-flex flex-column mb-4 d-none">
                <label htmlFor="orderingSub">ترتیب</label>
                <InputText
                  id="orderingSub"
                  value={orderingSub}
                  onChange={(e) => setOrderingSub(e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content h-100 d-flex align-items-start justify-content-start border p-4">
            <div className="d-flex flex-column align-items-start justify-content-between h-100 w-100">
              <div className="d-flex gap-2">
                <Button
                  className="align-left rounded-3"
                  label="ذخیره تغییرات"
                  onClick={() => {
                    onSaveChangestitle(nametitle, orderingtitle, selectedtitle);
                    setNametitle("");
                    setSelectedtitle(""); // Reset the selected category after titlemission
                  }}
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                />
              </div>
              <div className="p-field d-flex align-items-end gap-2 mb-4 w-100">
                <InputText
                  className="rounded-2 w-50 "
                  placeholder="نام آزمایش"
                  autoComplete="false"
                  id="nametitle"
                  value={nametitle}
                  onChange={(e) => setNametitle(e.target.value)}
                />
                <div className="p-field d-flex flex-column w-50">
                  <label htmlFor="typeSelect">انتخاب نوع</label>
                  <select
                    id="typeSelect"
                    className="form-select rounded-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">انتخاب نوع</option>
                    <option value="CHAR">CHAR</option>
                    <option value="INT">INT</option>
                    <option value="FLOAT">FLOAT</option>
                    <option value="DATE">DATE</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="p-field d-flex flex-column w-50">
                  <label htmlFor="categorySelect">انتخاب عنوان</label>
                  <select
                    id="categorySelect"
                    className="form-select rounded-2"
                    value={selectedtitle}
                    onChange={(e) => setSelectedtitle(e.target.value)}
                  >
                    <option value="">عنوان مربوطه</option>

                    {titles
                      .filter(
                        (title) =>
                          title?.sub_category?.category?.uid ===
                          items[activeIndex]?.uid
                      )
                      .map((filteredTitle) => (
                        <option
                          key={filteredTitle.uid}
                          value={filteredTitle.uid}
                        >
                          {filteredTitle.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="p-field d-flex flex-column mb-4 d-none">
                <label htmlFor="orderingtitle">ترتیب</label>
                <InputText
                  id="orderingtitle"
                  value={orderingtitle}
                  onChange={(e) => setOrderingtitle(e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <h2>Any content 4</h2>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabsComponents;
