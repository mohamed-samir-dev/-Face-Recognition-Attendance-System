"use client";

import { Menu, X } from "lucide-react";
import {NavigationMenuProps}from "../../types"

export default function NavigationMenu({
  navigationItems,
  isMenuOpen,
  onToggleMenu,
}: NavigationMenuProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="text-[#555] hover:text-[#1A1A1A] font-medium cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggleMenu}
        className="md:hidden p-2 text-[#555] hover:text-[#1A1A1A]"
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-2">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                onToggleMenu();
              }}
              className="block w-full text-left px-4 py-2 text-[#555] hover:text-[#1A1A1A] hover:bg-gray-50 font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}