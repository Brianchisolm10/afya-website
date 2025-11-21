"use client";

import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  onOpen: () => void;
  onHover?: () => void;
}

export default function ToolCard({
  id,
  title,
  description,
  icon,
  gradient,
  onOpen,
  onHover,
}: ToolCardProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[icon] as LucideIcon;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover-optimized will-change-transform"
      data-tool-id={id}
      onMouseEnter={onHover}
    >
      {/* Gradient background that appears on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Card content */}
      <div className="relative p-4 sm:p-6 flex flex-col h-full min-h-[220px] sm:min-h-[240px] md:min-h-[260px]">
        {/* Icon */}
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md will-change-transform`}
        >
          {IconComponent && (
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" aria-hidden="true" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-afya-primary group-hover:to-afya-secondary transition-all duration-300 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 flex-grow leading-relaxed">
          {description}
        </p>

        {/* CTA Button - Touch-friendly */}
        <button
          onClick={onOpen}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r ${gradient} hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base will-change-transform`}
          aria-label={`Open ${title} tool`}
        >
          Open Tool
        </button>
      </div>
    </div>
  );
}
