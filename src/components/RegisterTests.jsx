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
        <div key={category.uid} className="mb-4 border p-2">
          <div className="mb-2">
            <input
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
            <span className="ml-2">{category.name}</span>
          </div>
          {category.sub_category.map((sub) => (
            <div key={sub.uid} className="ml-4">
              <input
                type="checkbox"
                checked={!!selected[sub.uid]}
                onChange={() => toggleSelect(sub.uid, [...sub.field])}
              />
              <span className="ml-2">{sub.name}</span>
            </div>
          ))}
          {category.field.map((field) => (
            <div key={field.uid} className="ml-4">
              <input
                type="checkbox"
                checked={!!selected[field.uid]}
                onChange={() => toggleSelect(field.uid)}
              />
              <span className="ml-2">{field.name}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SelectableList;
