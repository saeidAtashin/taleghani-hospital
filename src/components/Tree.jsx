import React from "react";

// Recursive Tree Component
const TreeNode = ({ node }) => {
  if (!node) return null;

  return (
    <ul>
      <li>
        <strong>{node.name}</strong>
        {/* Render Subcategories */}
        {node.sub_categories && (
          <ul>
            {Object.values(node.sub_categories).map((subCategory) => (
              <TreeNode key={subCategory.uid} node={subCategory} />
            ))}
          </ul>
        )}
        {/* Render Titles */}
        {node.titles && (
          <ul>
            {Object.values(node.titles).map((title) => (
              <TreeNode key={title.uid} node={title} />
            ))}
          </ul>
        )}
        {/* Render Fields */}
        {node.fields && (
          <ul>
            {node.fields.map((field) => (
              <li key={field.uid}>{field.name}</li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
};

const Tree = ({ data }) => {
  return (
    <div>
      {Object.values(data).map((category) => (
        <TreeNode key={category.uid} node={category} />
      ))}
    </div>
  );
};

export default Tree;
