import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tree } from "react-d3-tree";

const TreeView = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    // Transform API response to hierarchical structure
    const transformResponseToTree = (results) => {
      const tree = {};

      results.forEach((result) => {
        const { name, uid, title } = result;
        const { sub_category } = title;
        const { category } = sub_category;

        // Check if the category exists in the tree
        if (!tree[category.uid]) {
          tree[category.uid] = {
            name: category.name,
            uid: category.uid,
            children: {},
          };
        }

        // Check if the sub_category exists under the category
        if (!tree[category.uid].children[sub_category.uid]) {
          tree[category.uid].children[sub_category.uid] = {
            name: sub_category.name,
            uid: sub_category.uid,
            children: {},
          };
        }

        // Check if the title exists under the sub_category
        if (
          !tree[category.uid].children[sub_category.uid].children[title.uid]
        ) {
          tree[category.uid].children[sub_category.uid].children[title.uid] = {
            name: title.name,
            uid: title.uid,
            children: [],
          };
        }

        // Add the field to the title
        tree[category.uid].children[sub_category.uid].children[
          title.uid
        ].children.push({
          name,
          uid,
        });
      });

      // Convert object to array for react-d3-tree compatibility
      const convertToTreeFormat = (node) => {
        return {
          name: node.name,
          children: Object.values(node.children || {}).map(convertToTreeFormat),
        };
      };

      return Object.values(tree).map(convertToTreeFormat);
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

  // Render the tree
  return (
    <div>
      {treeData ? (
        <div style={{ width: "100%", height: "500px" }}>
          <Tree draggable orientation="vertical" data={treeData} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TreeView;
