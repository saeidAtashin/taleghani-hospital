import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog"; // Import PrimeReact Dialog
import { InputText } from "primereact/inputtext"; // Import PrimeReact InputText
import { Button } from "primereact/button"; // Import PrimeReact Button

export default function TabComponent() {
  const [activeIndex, setActiveIndex] = useState(3);
  const [items, setItems] = useState([
    {
      label: "اضافه کردن گروه جدید",
      icon: "pi pi-plus-circle",
      command: () => openModal(), // Call openModal function
    },
    { label: "Transactions", icon: "pi pi-cog" },
    { label: "Products", icon: "pi pi-cog" },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [ordering, setOrdering] = useState("");

  // Function to open the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to handle API submission
  const handleSubmit = async () => {
    try {
      // Example API call
      const response = await fetch("https://cancerreg.ir/api/v1/tests/mng-category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, ordering }),
      });

      const data = await response.json();

      // Add the response data to items
      setItems((prevItems) => [
        { label: data.label || name, icon: "pi pi-cog" }, // Use the response label or name
        ...prevItems,
      ]);

      // Close the modal and reset inputs
      closeModal();
      setName("");
      setOrdering("");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="w-75 mx-5">
      <div className="my-5" />
      <TabMenu
        className=""
        scrollable
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />

      {/* Modal for adding a new group */}
      <Dialog
        header="Add New Group"
        visible={isModalVisible}
        style={{ width: "30vw" }}
        onHide={closeModal}
      >
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="p-field">
          <label htmlFor="ordering">Ordering</label>
          <InputText
            id="ordering"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          />
        </div>
        <Button label="Submit" onClick={handleSubmit} />
      </Dialog>
    </div>
  );
}
