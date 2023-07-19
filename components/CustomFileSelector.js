// components/CustomFileSelector.tsx
import classNames from "classnames";
import React from "react";

const CustomFileSelector = (props) => {
  return (
    <input
      {...props}
      type='file'
      multiple
      className={classNames({
        // Modify the Button shape, spacing, and colors using the `file`: directive
        // button colors
        "file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100": true,
        "file:rounded-lg file:rounded-tr-none file:rounded-br-none": true,
        "file:px-4 file:py-2 file:mr-4 file:border-none": true,
        // overall input styling
        "hover:cursor-pointer border rounded-lg text-gray-400": true,
        "w-full": true,
      })}
    />
  );
};

export default CustomFileSelector;
