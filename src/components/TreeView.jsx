import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree from "./Tree";

const TreeView = () => {
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    const transformResponseToTree = (results) => {
      const tree = {};

      results.forEach((result) => {
        const { name, uid, title } = result;
        const { sub_category } = title;
        const { category } = sub_category;

        // Initialize category if it doesn't exist
        if (!tree[category.uid]) {
          tree[category.uid] = {
            name: category.name,
            uid: category.uid,
            sub_categories: {},
          };
        }

        // Initialize the sub_category if it doesn't exist
        if (!tree[category.uid].sub_categories[sub_category.uid]) {
          tree[category.uid].sub_categories[sub_category.uid] = {
            name: sub_category.name,
            uid: sub_category.uid,
            titles: {},
          };
        }

        // Initialize the title if it doesn't exist
        if (
          !tree[category.uid].sub_categories[sub_category.uid].titles[title.uid]
        ) {
          tree[category.uid].sub_categories[sub_category.uid].titles[
            title.uid
          ] = {
            name: title.name,
            uid: title.uid,
            fields: [],
          };
        }

        // Add the field to the title
        tree[category.uid].sub_categories[sub_category.uid].titles[
          title.uid
        ].fields.push({
          name,
          uid,
        });
      });

      return tree;
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-field/"
        );
        const results = response.data.data.results;

        // Transform the data
        const transformedData = transformResponseToTree(results);
        setTreeData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Tree View</h2>
      <Tree data={treeData} />
    </div>
  );
};

export default TreeView;
