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
                    onChange={() => toggleSelect(sub.uid, [...sub.field])}
                  />
                  {sub.name} : 
                </label>

                <div className="mr-3 d-flex my-3 w-100 ">
                  <span className="border  px-4 pt-3 mb-3 rounded d-flex my-auto flex-wrap w-100">
                    {sub?.field?.length > 0 &&
                      sub?.field?.map((t) => (
                        <div className="mb-3 d-flex my-auto h-auto mx-4">
                          <label className="ml-2 d-flex my-auto h-auto">
                            <input
                              name={t.name}
                              className="mx-2 h-auto my-auto"
                              type="checkbox"
                              checked={!!selected[t.uid]}
                              onChange={() => toggleSelect(t.uid)}
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
                    onChange={() => toggleSelect(field.uid)}
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
                      onChange={() => toggleSelect(tit.name)}
                    />
                    {tit.name} :
                  </label>
                  <div className="mr-3 d-flex my-3 w-100 ">
                    <span className="border  px-4 pt-3 mb-3 rounded d-flex my-auto flex-wrap w-100">
                      {tit?.field?.length > 0 &&
                        tit?.field?.map((t) => (
                          <div className="mb-3 d-flex my-auto h-auto mx-4">
                            <label className="ml-2 d-flex my-auto h-auto">
                              <input
                                name={t.name}
                                className="mx-2 h-auto my-auto"
                                type="checkbox"
                                checked={!!selected[t.uid]}
                                onChange={() => toggleSelect(t.uid)}
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
    </div>
  );
};

export default SelectableList;
