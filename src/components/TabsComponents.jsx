import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const TabsComponents = () => {
  const [name, setName] = useState("");
  const [ordering, setOrdering] = useState(0);

  return (
    <div className="w-100 shadow-lg">
      <Tabs>
        <TabList>
          <Tab>
            <p>زیرگروه‌ها</p>
          </Tab>
          <Tab>
            <p>عنوان</p>
          </Tab>
          <Tab>
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
                />
                <Button
                  className="align-left rounded-3 bg-white text-dark border"
                  label="لغو"
                />
              </div>
              <div className="p-field d-flex flex-column mb-4 w-100">
                <InputText
                  className="rounded-2"
                  placeholder="زیرگروه "
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
          <div className="panel-content">
            <h2>Any content 2</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <h2>Any content 3</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <h2>Any content 4</h2>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <h2>Any content 5</h2>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabsComponents;
