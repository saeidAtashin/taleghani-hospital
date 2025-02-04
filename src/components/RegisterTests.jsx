import axios from "axios";
import React, { useEffect, useState } from "react";

// const data = [
//   {
//     uid: "f6afd319-c285-43cb-85d8-2b6f7bca228e",
//     name: "Hematology",
//     field: [
//       {
//         name: "Partial Thromboplastin",
//         uid: "451e099c-c0af-42d8-b85b-8adaad59e5a1",
//       },
//       { name: "Time", uid: "1c6b7f39-a0e4-4f62-a301-6dcb98fd00f5" },
//       { name: "Prothrombin time", uid: "f92bd107-4bc9-4b71-b054-d2ed0a2713ed" },
//     ],
//     sub_category: [
//       {
//         name: "تومورمارکر",
//         uid: "a040de0d-f042-489a-a614-64849994911e",
//         field: [
//           { name: "CEA", uid: "f0a83d20-c4f9-4e0c-8d35-b724055897f2" },
//           { name: "CA125", uid: "003862f1-841a-475b-aa9f-dc0aa0fbcad2" },
//         ],
//       },
//     ],
//     title: [
//       {
//         name: "CBC",
//         field: [
//           { name: "WBC", uid: "3e0bb13a-6e14-42be-8793-aa59c1cfba72" },
//           { name: "RBC", uid: "174a63e8-9294-4b5a-81eb-6d2b4c6447fe" },
//         ],
//       },
//     ],
//   },
// ];

const SelectableList = () => {
  const [selected, setSelected] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://cancerreg.ir/api/v1/tests/category-details/`
        );
        // const { results } = response.data;

        setData(response?.data?.data?.result);
        console.log(
          "response?.data?.data?.result",
          response?.data?.data?.result
        );
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
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
