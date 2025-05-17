import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import TestOptionForm from "./TestOptionForm";
import { toast } from "react-toastify";
import { InputSwitch } from "primereact/inputswitch";

const TabsComponents = ({
  onSaveChanges,
  onSaveChangesSub,
  categories,
  items,
  activeIndex,
  setShowWhatGet,
  onSaveChangestitle,
  titles,
  fields,
  setFields,
}) => {
  const [name, setName] = useState("");
  const [nameSub, setNameSub] = useState("");
  const [ordering, setOrdering] = useState(undefined);
  const [orderingSub, setOrderingSub] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory2, setSelectedCategory2] = useState("");
  const [selectedtitle, setSelectedtitle] = useState("");
  const [nametitle, setNametitle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [orderingtitle, setOrderingtitle] = useState(0);
  const [checked, setChecked] = useState(false);
  const [hide, sethide] = useState(false);

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
          <Tab onClick={() => setShowWhatGet("new")}>
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
              <div className=" d-flex  align-items-center mb-4 w-100 gap-2">
                <InputText
                  className="rounded-2 w-50"
                  placeholder="زیرگروه"
                  autoComplete="false"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="d-flex flex-column">
                  <InputText
                    className="rounded-2 w-100"
                    id="ordering"
                    placeholder="ترتیب"
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                  />
                </div>
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
                  }}
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                />
              </div>
              <div className="w-100">
                <div>
                  <p>
                    در صورت عدم انتخاب زیرگروه، عنوان به{" "}
                    <span className="text-info">
                      {items &&
                        items?.[activeIndex] &&
                        items?.[activeIndex].label}
                    </span>{" "}
                    وصل خواهد شد
                  </p>
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
                    <select
                      id="categorySelect"
                      className="form-select rounded-2"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">زیرگروه مربوطه</option>

                      {Object &&
                        Object?.entries(categories) &&
                        Object?.entries(categories)?.map(([uid, category]) => {
                          if (uid === items[activeIndex]?.uid) {
                            return (
                              <React.Fragment key={uid}>
                                {category?.items?.map((item, index) => (
                                  <option
                                    key={item?.uid || index}
                                    value={item?.uid}
                                  >
                                    {item?.name}
                                  </option>
                                ))}
                              </React.Fragment>
                            );
                          }
                          return null;
                        })}
                    </select>
                  </div>
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
                    if (!selectedType) {
                      toast.warning("لطفاً نوع فیلد آزمایش را انتخاب کنید");
                      return;
                    }

                    onSaveChangestitle(
                      nametitle,
                      selectedType,
                      orderingtitle,
                      selectedtitle,
                      selectedCategory2,
                      checked,
                      hide
                    );
                    setNametitle("");
                  }}
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                />
              </div>
              <div className="p-field d-flex flex-wrap align-items-start gap-4 my-4 w-100">
                <InputText
                  className="rounded-2 w-50 "
                  placeholder="نام آزمایش"
                  autoComplete="false"
                  id="nametitle"
                  value={nametitle}
                  onChange={(e) => setNametitle(e.target.value)}
                />
                <div className="p-field d-flex flex-column w-50">
                  <select
                    id="typeSelect"
                    className="form-select rounded-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">نوع فیلد آزمایش</option>
                    <option value="CHAR">متنی</option>
                    <option value="FLOAT">عددی</option>
                    <option value="PERCENTAGE">درصدی</option>
                  </select>
                </div>
                <div className="p-field d-flex flex-column w-50">
                  <select
                    id="categorySelect"
                    className="form-select rounded-2"
                    value={selectedtitle}
                    onChange={(e) => setSelectedtitle(e.target.value)}
                  >
                    <option value="">عنوان مربوطه</option>

                    {titles
                      ?.filter(
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
                <div className="p-field d-flex flex-column w-50">
                  <select
                    id="categorySelect"
                    className="form-select rounded-2"
                    value={selectedCategory2}
                    onChange={(e) => setSelectedCategory2(e.target.value)}
                  >
                    <option value="">زیرگروه مربوطه</option>

                    {Object.entries(categories).map(([uid, category]) => {
                      if (uid === items[activeIndex]?.uid) {
                        return (
                          <React.Fragment key={uid}>
                            {category?.items?.map((item, index) => (
                              <option
                                key={item?.uid || index}
                                value={item?.uid}
                              >
                                {item?.name}
                              </option>
                            ))}
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
                <div className="">
                  <InputText
                    id="orderingtitle"
                    placeholder="ترتیب"
                    className="rounded-2"
                    onChange={(e) => setOrderingtitle(e.target.value)}
                  />
                </div>
                <div className="">
                  <label htmlFor="title">تایتل</label>
                  <InputSwitch
                    className="custom-switch"
                    id="title"
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.value);
                    }}
                  />
                </div>
                <div className="">
                  <label htmlFor="hidetitle">مخفی</label>
                  <InputSwitch
                    id="hidetitle"
                    checked={hide}
                    onChange={(e) => {
                      sethide(e.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <TestOptionForm
              selectedCategory={items?.[activeIndex]?.uid}
              fields={fields}
              setFields={setFields}
            />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabsComponents;
