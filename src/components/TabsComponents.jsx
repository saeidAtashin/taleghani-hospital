import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const TabsComponents = () => {
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
          <div className="panel-content">
            <h2>Any content 1</h2>
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
