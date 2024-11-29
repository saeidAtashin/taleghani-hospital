import React, { useState, useEffect } from "react";
import axios from "axios";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

const DropdownTree = () => {
  const [treeData, setTreeData] = useState([]);

  const transformResponseToTree = (results) => {
    const tree = {};

    results.forEach((result) => {
      const { name, uid, title } = result;
      const { sub_category } = title;
      const { category } = sub_category;

      // Initialize category if it doesn't exist
      if (!tree[category.uid]) {
        tree[category.uid] = {
          label: category.name,
          value: category.uid,
          children: [],
        };
      }

      // Find or create the subcategory
      let subCategoryNode = tree[category.uid].children.find(
        (node) => node.value === sub_category.uid
      );
      if (!subCategoryNode) {
        subCategoryNode = {
          label: sub_category.name,
          value: sub_category.uid,
          children: [],
        };
        tree[category.uid].children.push(subCategoryNode);
      }

      // Find or create the title node
      let titleNode = subCategoryNode.children.find(
        (node) => node.value === title.uid
      );
      if (!titleNode) {
        titleNode = {
          label: title.name,
          value: title.uid,
          children: [],
        };
        subCategoryNode.children.push(titleNode);
      }

      // Add the field
      titleNode.children.push({
        label: name,
        value: uid,
      });
    });

    return Object.values(tree); // Convert object to array
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cancerreg.ir/api/v1/tests/mng-field/"
        );
        const results = response.data.data.results;

        // Transform and set the tree data
        const transformedData = transformResponseToTree(results);
        setTreeData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (currentNode, selectedNodes) => {};

  return (
    <div>
      <h2>Tree Dropdown</h2>
      <DropdownTreeSelect
        data={treeData}
        onChange={handleChange}
        placeholder="Select fields"
      />
    </div>
  );
};

export default DropdownTree;
