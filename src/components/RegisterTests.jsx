import axios from "axios";
import React, { useEffect, useState } from "react";

const SelectableList = () => {
  const [selected, setSelected] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );

        setData(response?.data?.data?.result);
        console.log(
          "response?.data?.data?.result",
          response?.data?.data?.result
        );
      } catch (error) {}
    };

    fetchData();
  }, []);

  const toggleSelect = (uid, items = []) => {
    setSelected((prev) => {
      const newSelected = { ...prev };
      const isSelected = !!newSelected[uid];
      if (isSelected) {
        delete newSelected[uid];
        items.forEach((item) => delete newSelected[item.uid]);
      } else {
        newSelected[uid] = true;
        items.forEach((item) => (newSelected[item.uid] = true));
      }
      return newSelected;
    });
  };

  return (
    <div className="p-4">
      {data.map((category) => (
        <div key={category.uid} className="mb-4 border rounded p-2">
          <div className="d-flex mb-2 my-auto">
            <label className="ml-4 d-flex ">
              <input
                name={category.name}
                className="mx-2 h-auto my-auto"
                type="checkbox"
                checked={!!selected[category.uid]}
                onChange={() =>
                  toggleSelect(category.uid, [
                    ...category.field,
                    ...category.sub_category,
                    ...category.title,
                  ])
                }
              />
              {category.name} :
            </label>
          </div>
          <div className="border rounded p-4">
            {category?.sub_category.map((sub) => (
              <div key={sub.uid} className="ml-4 my-3 d-flex">
                <label className="ml-2 d-flex ">
                  <input
                    name={sub.name}
                    className="mx-2 h-auto my-auto"
                    type="checkbox"
                    checked={!!selected[sub.uid]}
                    onChange={() => toggleSelect(sub.uid, [...sub.field])}
                  />
                  {sub.name}
                </label>
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
                    onChange={() => toggleSelect(field.uid)}
                  />
                  {field.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectableList;
