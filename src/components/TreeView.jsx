import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tree } from "react-d3-tree";

const TreeView = ({ items, activeIndex }) => {
  const [treeData, setTreeData] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
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

      // Wrap all nodes under a single root
      return {
        name: "Root", // Name of the single root node
        children: Object.values(tree).map(convertToTreeFormat),
      };
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-field/"
        );
        const results = response.data.data.results;

        console.log("response.data.data.results", response.data.data.results);
        // Transform the data
        const transformedData = transformResponseToTree(results);
        setTreeData(transformedData);
        setTranslate({
          x: window.innerWidth / 2,
          y: 100, // Adjust the vertical position here
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Render the tree

  console.log("treeData", treeData);
  return (
    <div>
      {treeData ? (
        <div style={{ width: "100%", height: "5000px" }}>
          <Tree
            draggable
            orientation="vertical"
            data={treeData}
            translate={translate} // Set the initial position of the tree
            zoomable={true}
            pathFunc="diagonal" // Adjust path style if needed
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TreeView;
