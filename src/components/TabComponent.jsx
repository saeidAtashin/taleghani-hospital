import React, { useEffect, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import Swal from "sweetalert2";
import TabsComponents from "./TabsComponents";

export default function TabComponent() {
  const [activeIndex, setActiveIndex] = useState(3);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState([
    {
      label: "گروه جدید",
      icon: "pi pi-plus-circle",
      command: () => openModal(),
    },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [ordering, setOrdering] = useState("");
  const [selectedItemUid, setSelectedItemUid] = useState(null);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/category/"
        );

        const fetchedItems = response?.data?.data?.results.map((item) => ({
          label: item.name,
          icon: "pi pi-cog",
          uid: item.uid,
          template: (
            <div>
              {item.name} {" "}
              <i
                className="pi pi-pencil"
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => openEditModal(item)}
              />
              <i
                className="pi pi-trash"
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => handleDelete(item.uid)}
              />
            </div>
          ),
        }));

        setItems([
          {
            label: "گروه جدید",
            icon: "pi pi-plus-circle",
            command: () => openModal(),
          },
          ...fetchedItems,
        ]);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryList();
  }, [refresh]);

  const openModal = () => {
    setIsEditMode(false);
    setModalVisible(true);
    setName("");
    setOrdering("");
    setSelectedItemUid(null);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setModalVisible(true);
    setName(item.name);
    setOrdering(item.ordering || "");
    setSelectedItemUid(item.uid);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedItemUid) {
        await axios.put(
          `https://cancerreg.ir/api/v1/tests/mng-category/${selectedItemUid}`,
          { name, ordering }
        );
      } else {
        await axios.post("https://cancerreg.ir/api/v1/tests/mng-category/", {
          name,
          ordering,
        });
      }
      closeModal();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = (uid) => {
    Swal.fire({
      title: "از حذف اطمینان دارید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "حذف",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://cancerreg.ir/api/v1/tests/mng-category/${uid}`
          );
          Swal.fire("حذف شد", "این مورد با موفقیت حذف شد", "success");
          setRefresh(!refresh);
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire("Error!", "Failed to delete the item.", "error");
        }
      }
    });
  };

  return (
    <div className="w-75 mx-5">
      <div className="my-5" />
      <TabMenu
        className=""
        scrollable
        model={items.map((item) => ({
          label: item.template || item.label,
          icon: item.icon,
          command: item.command,
        }))}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />

      {activeIndex === 1 ? (
        <>
          <TabsComponents />
        </>
      ) : (
        <div>test2</div>
      )}

      <Dialog
        header={isEditMode ? "Edit Group" : "Add New Group"}
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
