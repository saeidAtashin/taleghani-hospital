import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tree } from "react-d3-tree";

const TreeView = () => {
  const [treeData, setTreeData] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Transform API response to hierarchical structure
    const transformResponseToTree = (results) => {
      const tree = {};

      results.forEach((result) => {
        const { name, uid, title } = result;
        const { sub_category } = title || {};
        const { category } = sub_category || {};

        if (!category || !sub_category || !title) {
          return; // Skip incomplete data
        }

        if (!tree[category.uid]) {
          tree[category.uid] = {
            name: category.name || "Unnamed Category",
            children: {},
          };
        }

        if (!tree[category.uid].children[sub_category.uid]) {
          tree[category.uid].children[sub_category.uid] = {
            name: sub_category.name || "Unnamed Subcategory",
            children: {},
          };
        }

        if (
          !tree[category.uid].children[sub_category.uid].children[title.uid]
        ) {
          tree[category.uid].children[sub_category.uid].children[title.uid] = {
            name: title.name || "Unnamed Title",
            children: [],
          };
        }

        tree[category.uid].children[sub_category.uid].children[
          title.uid
        ].children.push({
          name: name || "Unnamed Field",
          uid,
        });
      });

      const convertToTreeFormat = (node) => ({
        name: node.name,
        children: Object.values(node.children || {}).map(convertToTreeFormat),
      });

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
            zoom={20}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TreeView;
