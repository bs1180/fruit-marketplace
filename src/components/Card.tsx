import React from "react";

export const Card = ({ title, description, children }) => (
  <div className="w-full bg-white shadow-solid rounded-lg overflow-hidden">
    <div className="px-4 py-5 border-b-2 border-black">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">{description}</p>}
    </div>
    <>{children}</>
  </div>
);
