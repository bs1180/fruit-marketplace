import React from "react";

export const Section = ({ title, children }) => (
  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm leading-5 font-medium text-gray-500">{title}</dt>
    <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{children}</dd>
  </div>
);
