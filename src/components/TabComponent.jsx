import React, { useEffect, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import Swal from "sweetalert2";
import TabsComponents from "./TabsComponents";
import { toast } from "react-toastify";
import DragAndDropOrdering from "./DragAndDropOrdering";
import TreeView from "./TreeView";

export default function TabComponent() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState([
    {
      label: "گروه جدید",
      // icon: "pi pi-plus-circle",
      command: () => openModal(),
    },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [ordering, setOrdering] = useState(0);
  const [selectedItemUid, setSelectedItemUid] = useState(null);
  const [refreshSub, setRefreshSub] = useState(false);
  const [refreshTitle, setRefreshTitle] = useState(false);
  const [categories, setCategories] = useState({});
  const [showWhatGet, setShowWhatGet] = useState({});
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [fields, setFields] = useState({});

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/category/"
        );

        const fetchedItems = response?.data?.data?.result?.map((item) => ({
          label: item?.name,
          uid: item?.uid,
          template: (
            <div key={item?.uid}>
              {item.name}{" "}
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
            // icon: "pi pi-plus-circle",
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
    setOrdering(0);
    setSelectedItemUid(null);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setModalVisible(true);
    setName(item.name);
    setOrdering(item.ordering || 0);
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

  const handleSaveChanges = async (name, ordering) => {
    try {
      const categoryUid = items[activeIndex]?.uid; // Adjust based on TabMenu index offset

      if (!categoryUid) {
        toast.error("مجددا گروه مورد نظر را انتخاب نمایید.");
        return;
      }

      const response = await axios.post(
        `https://cancerreg.ir/api/v1/tests/mng-sub-category/`,
        {
          category_uid: categoryUid,
          name,
          ordering,
        }
      );

      setRefreshSub(!refreshSub);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleSaveChangesSub = async (name, ordering, selectedCategory) => {
    try {
      // if (!selectedCategory) {
      //   toast.error("لطفاً یک زیرگروه انتخاب کنید.");
      //   return;
      // }
      const categoryUid = items[activeIndex]?.uid; // Adjust based on TabMenu index offset

      if (!categoryUid) {
        toast.error("مجددا گروه مورد نظر را انتخاب نمایید.");
        return;
      }

      const response = await axios.post(
        `https://cancerreg.ir/api/v1/tests/mng-title/`,
        {
          category_uid: selectedCategory
            ? undefined
            : items[activeIndex]?.uid
            ? items[activeIndex]?.uid
            : undefined,
          sub_category_uid: selectedCategory ? selectedCategory : undefined,
          name,
          ordering,
        }
      );
      setRefreshTitle(!refreshTitle);
      toast.success("تغییرات با موفقیت ذخیره شد.");
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-sub-category/"
        );

        const results = response.data.data.result;

        console.log("response.data.data.result", response.data.data.result);

        // Group by category_uid
        const grouped = results?.reduce((acc, item) => {
          const categoryUid = item?.category?.uid;
          if (!acc[categoryUid]) {
            acc[categoryUid] = {
              categoryName: item?.category?.name,
              items: [],
            };
          }
          acc[categoryUid].items.push(item);
          return acc;
        }, {});

        setCategories(grouped);

        console.log("grouped", grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshSub]);

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;
  //   const { source, destination } = result;
  //   const updatedCategories = { ...categories };
  //   const sourceCategory = updatedCategories[source.droppableId];
  //   const destinationCategory = updatedCategories[destination.droppableId];
  //   const [movedItem] = sourceCategory.items.splice(source.index, 1);
  //   destinationCategory.items.splice(destination.index, 0, movedItem);
  //   setCategories(updatedCategories);
  // };

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-field/"
        );
        const results = response?.data?.data?.result;
        //   "multipule_value": false, this added to api send
        // Group by category_uid
        const grouped = results?.reduce((acc, item) => {
          const categoryUid = item?.title?.sub_category?.category?.uid;
          if (!acc[categoryUid]) {
            acc[categoryUid] = {
              categoryName: item?.title?.sub_category?.category?.name,
              items: [],
            };
          }
          acc[categoryUid].items.push(item);
          return acc;
        }, {});

        setFields(grouped);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    fetchFields();
  }, [refreshSub, refreshTitle]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-title/?page=1&page_size=50"
        );
        const results = response.data.data.result;

        setTitles(results);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };

    fetchTitles();
  }, [refreshTitle]);

  useEffect(() => {
    if (titles?.length > 0 && activeIndex) {
      const activeUid = items[activeIndex]?.uid;

      const filtered = titles.filter(
        (title) => title?.sub_category?.category?.uid === activeUid
      );
      setFilteredTitles(filtered);
    }
  }, [titles, activeIndex, items]);

  const convertFilteredTitlesToCategories = (filteredTitles) => {
    return filteredTitles?.reduce((acc, title) => {
      const categoryUid = title?.sub_category?.category?.uid;

      // If the category UID doesn't exist, initialize it
      if (!acc[categoryUid]) {
        acc[categoryUid] = {
          categoryName: title?.sub_category?.category?.name,
          items: [],
        };
      }

      // Push the title into the appropriate category's items array
      acc[categoryUid].items.push({
        name: title.name,
        uid: title.uid,
        ordering: title.ordering,
        category: {
          name: title.sub_category.category.name,
          uid: title.sub_category.category.uid,
          ordering: title.sub_category.category.ordering,
        },
      });

      return acc;
    }, {});
  };

  const handleSaveChangestitle = async (
    name,
    type,
    ordering,
    selectedTitle,
    selectedSubCategory,
    checked
  ) => {
    console.log("checked", checked);
    try {
      let payload = {
        name,
        type,
        ordering,
        titled: checked,
      };

      const categoryUid = items[activeIndex]?.uid; // Adjust based on TabMenu index offset

      // Determine which key to include in the payload
      if (selectedTitle) {
        payload.title_uid = selectedTitle;
      } else if (selectedSubCategory) {
        payload.sub_category_uid = selectedSubCategory;
      } else if (categoryUid) {
        payload.category_uid = categoryUid;
      } else {
        toast.error("لطفاً یک گروه، زیرگروه یا عنوان را انتخاب کنید.");
        return;
      }

      const response = await axios.post(
        `https://cancerreg.ir/api/v1/tests/mng-field/`,
        payload
      );

      setRefreshSub(!refreshSub);
      toast.success("تغییرات با موفقیت ذخیره شد.");
    } catch (error) {
      toast.error("خطایی در ارسال داده‌ها رخ داد.");
    }
  };

  return (
    <div className="w-75 mx-5">
      <div className="my-5" />
      <TabMenu
        scrollable
        model={items?.map((item) => ({
          label: item?.template || item?.label,
          // icon: item.icon,
          command: item.command,
        }))}
        activeIndex={activeIndex === 0 ? 1 : activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
      <TabsComponents
        onSaveChanges={handleSaveChanges}
        onSaveChangesSub={handleSaveChangesSub}
        categories={categories}
        items={items}
        activeIndex={activeIndex}
        showWhatGet={showWhatGet}
        setShowWhatGet={setShowWhatGet}
        onSaveChangestitle={handleSaveChangestitle}
        titles={titles}
      />
      {showWhatGet === "showSub" ? (
        <DragAndDropOrdering
          sub={items[activeIndex]?.uid}
          categories={convertFilteredTitlesToCategories(filteredTitles)} // Pass the filteredTitles
          // handleDragEnd={handleDragEnd}
          refreshSub={refreshTitle}
          setRefreshSub={setRefreshTitle}
          url="tests/mng-title"
        />
      ) : showWhatGet === "showTitle" ? (
        <DragAndDropOrdering
          url="tests/mng-field"
          sub={items[activeIndex]?.uid}
          categories={fields}
          // handleDragEnd={handleDragEnd}
          refreshSub={refreshSub}
          setRefreshSub={setRefreshSub}
        />
      ) : showWhatGet === "new" ? (
        <>{/* <TreeView /> */}</>
      ) : (
        <DragAndDropOrdering
          items={items}
          activeIndex={activeIndex}
          url="tests/mng-sub-category"
          sub={items[activeIndex]?.uid}
          categories={categories}
          // handleDragEnd={handleDragEnd}
          refreshSub={refreshSub}
          setRefreshSub={setRefreshSub}
        />
      )}

      <Dialog
        header={isEditMode ? "Edit Group" : "اضافه کردن گروه جدید"}
        visible={isModalVisible}
        style={{ width: "30vw" }}
        onHide={closeModal}
      >
        <div className="d-flex flex-column">
          <div className="p-field d-flex flex-column mb-4">
            <label htmlFor="name">نام گروه</label>
            <InputText
              id="name"
              placeholder="نام گروه را وارد نمایید"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="p-field d-flex flex-column mb-4">
            <label htmlFor="ordering">ترتیب</label>
            <InputText
              id="ordering"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row-reverse gap-2">
            <Button
              className="align-left rounded-3"
              label="اضافه کردن"
              onClick={handleSubmit}
            />
            <Button
              className="align-left rounded-3 bg-white text-dark border"
              label="لغو"
              onClick={closeModal}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
