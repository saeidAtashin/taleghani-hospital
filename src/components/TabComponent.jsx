import React, { useState } from "react";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";

export default function TabComponent() {
  const [activeIndex, setActiveIndex] = useState(3);
  const items = [
    { label: "Dashboard", icon: "pi  pi-cog" },
    { label: "Transactions", icon: "pi  pi-cog" },
    { label: "Products", icon: "pi  pi-cog" },
  ];

  return (
    <div className="w-75 mx-5">
      <Button
        onClick={() => setActiveIndex(0)}
        className="p-button-outlined mb-5"
        label="Activate 1st"
      />
      <TabMenu
        className=""
        scrolable
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
    </div>
  );
}
