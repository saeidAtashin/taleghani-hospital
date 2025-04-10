import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SelectableList = ({ setShowAzmayeshPAge }) => {
  const [selected, setSelected] = useState({});
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const patient_uid = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );
        setData(response?.data?.data?.result);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelect = (uid, items = [], parentUid = null) => {
    setSelected((prev) => {
      const newSelected = { ...prev };
      const isSelected = !!newSelected[uid];

      if (isSelected) {
        delete newSelected[uid];
        items.forEach((item) => delete newSelected[item.uid]);
      } else {
        newSelected[uid] = true;
        items.forEach((item) => (newSelected[item.uid] = true));
        if (parentUid) {
          newSelected[parentUid] = true;
        }
      }

      return newSelected;
    });
  };

  const handleSubmit = async () => {
    const selectedCategories = data
      .filter((category) => selected[category.uid])
      .map((category) => ({
        uid: category.uid,
        sub_categories:
          category.sub_category
            .filter((sub) => selected[sub.uid])
            .map((sub) => sub.uid) || [],
        fields: [
          ...(category.field
            .filter((field) => selected[field.uid])
            .map((field) => field.uid) || []),
          ...(category.title
            .filter((tit) => selected[tit.name])
            .flatMap((tit) =>
              tit.field.filter((t) => selected[t.uid]).map((t) => t.uid)
            ) || []),
        ],
      }));

    const payload = {
      patient_uid: patient_uid?.uid,
      description: "description",
      categories: selectedCategories,
    };

    try {
      const response = await axios.post(
        "https://cancerreg.ir/api/v1/tests/order-test/",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("ثبت شد");
      setShowAzmayeshPAge("home");
    } catch (error) {
      toast.warning("مشکلی پیش آمده است.");
    }
  };

  return (
    <div className="p-4 pb-5 position-relative" style={{ minHeight: "100vh" }}>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {data.map((category) => (
            <div key={category.uid} className="mb-4 border rounded p-4 shadow">
              <div className="d-flex mb-2 my-auto">
                <label className="ml-4 d-flex h2">
                  <input
                    name={category.name}
                    className="mx-2 h-auto my-auto"
                    type="checkbox"
                    checked={!!selected[category.uid]}
                    onChange={() =>
                      toggleSelect(category.uid, [
                        ...category?.field,
                        ...category?.title,
                        ...category?.sub_category?.flatMap((sub) => [
                          sub,
                          ...sub.field,
                        ]),
                        ...category?.title?.flatMap((title) => [
                          title,
                          ...title.field,
                        ]),
                      ])
                    }
                  />
                  {category.name} :
                </label>
              </div>
              <div className="border rounded p-4">
                {category?.sub_category.map((sub) => (
                  <div key={sub.uid} className="ml-4 my-3 d-flex">
                    <label className="ml-2 d-flex my-auto h-auto w-25 h4">
                      <input
                        name={sub.name}
                        className="mx-2 h-auto my-auto "
                        type="checkbox"
                        checked={!!selected[sub.uid]}
                        onChange={() =>
                          toggleSelect(sub.uid, [...sub.field], category.uid)
                        }
                      />
                      {sub.name} :
                    </label>

                    <div className="mr-3 d-flex my-3 w-100 ">
                      <span className="border px-4 pt-3 mb-3 rounded d-flex my-auto flex-wrap w-100">
                        {sub?.field?.length > 0 &&
                          sub?.field?.map((t) => (
                            <div className="mb-3 d-flex my-auto h-auto mx-4">
                              <label className="ml-2 d-flex my-auto h-auto">
                                <input
                                  name={t.name}
                                  className="mx-2 h-auto my-auto"
                                  type="checkbox"
                                  checked={!!selected[t.uid]}
                                  onChange={() =>
                                    toggleSelect(t.uid, [], category.uid)
                                  }
                                />
                                {t.name}
                              </label>
                            </div>
                          ))}
                      </span>
                    </div>
                  </div>
                ))}
                {category.field.map((field) => (
                  <div key={field.uid} className="ml-4 my-3 d-flex">
                    <label className="ml-2 d-flex ">
                      <input
                        name={field.name}
                        className="mx-2 h-auto my-auto"
                        type="checkbox"
                        checked={!!selected[field.uid]}
                        onChange={() =>
                          toggleSelect(field.uid, [], category.uid)
                        }
                      />
                      {field.name}
                    </label>
                  </div>
                ))}

                <div className={true ? "d-flex flex-column" : ""}>
                  {category?.title?.map((tit) => (
                    <div key={tit?.name} className="ml-4 my-3 d-flex">
                      <label className="ml-2 d-flex my-auto h-auto w-25 h4">
                        <input
                          name={tit.name}
                          className="mx-2 h-auto my-auto "
                          type="checkbox"
                          checked={!!selected[tit.name]}
                          onChange={() =>
                            toggleSelect(tit.name, [...tit.field], category.uid)
                          }
                        />
                        {tit.name} :
                      </label>
                      <div className="mr-3 d-flex my-3 w-100 ">
                        <span className="border px-4 pt-3 mb-3 rounded d-flex my-auto flex-wrap w-100">
                          {tit?.field?.length > 0 &&
                            tit?.field?.map((t) => (
                              <div className="mb-3 d-flex my-auto h-auto mx-4">
                                <label className="ml-2 d-flex my-auto h-auto">
                                  <input
                                    name={t.name}
                                    className="mx-2 h-auto my-auto"
                                    type="checkbox"
                                    checked={!!selected[t.uid]}
                                    onChange={() =>
                                      toggleSelect(t.uid, [], category.uid)
                                    }
                                  />
                                  {t.name}
                                </label>
                              </div>
                            ))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div
            className="position-fixed bottom-0 start-0 w-100 p-3 bg-white d-flex justify-content-center"
            style={{ zIndex: 1000 }}
          >
            <button
              className="p-2 text-white rounded bg-primary w-25"
              onClick={handleSubmit}
            >
              تایید و ثبت دستور تصویربرداری ها
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectableList;
