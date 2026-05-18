import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link 
            to={createPageUrl("Home")}
            className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-2 py-1"
            aria-label="Home"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium px-2 py-1" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="text-gray-600 hover:text-purple-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-2 py-1"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}