"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Tools", href: "/tools" },
  { label: "Shop", href: "/shop" },
  {
    label: "Impact",
    href: "/impact",
    dropdown: [
      { label: "Overview", href: "/impact" },
      { label: "Donations", href: "/impact/donate" },
      { label: "Sponsor-A-Client", href: "/impact/sponsor" },
      { label: "Gear Drive", href: "/impact/gear-drive" },
      { label: "Equipment", href: "/impact/equipment" },
      { label: "Foundations", href: "/impact/foundations" },
    ],
  },
  { label: "Login", href: "/login" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const handleDropdownEnter = (label: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 200); // 200ms delay before closing
    setCloseTimeout(timeout);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-afya-primary to-afya-secondary bg-clip-text text-transparent">
              AFYA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.href);
              
              if (item.dropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={item.href}
                      className={`text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-4 py-3 min-h-[44px] flex items-center ${
                        active
                          ? "text-afya-primary border-b-2 border-afya-primary"
                          : "text-gray-700 hover:text-afya-primary hover:border-b-2 hover:border-afya-primary/50"
                      }`}
                    >
                      {item.label}
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {openDropdown === item.label && (
                      <div 
                        className="absolute top-full left-0 pt-2 w-56 z-50"
                        onMouseEnter={() => handleDropdownEnter(item.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-3 min-h-[44px] text-sm text-gray-700 hover:bg-gray-100 hover:text-afya-primary transition-colors duration-200 flex items-center"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-4 py-3 min-h-[44px] flex items-center ${
                    active
                      ? "text-afya-primary border-b-2 border-afya-primary"
                      : "text-gray-700 hover:text-afya-primary hover:border-b-2 hover:border-afya-primary/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-afya-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-afya-primary transition-colors duration-200"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-6 w-6 transition-transform duration-200"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 space-y-2 animate-slideDown"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              
              if (item.dropdown) {
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary min-h-[44px] flex items-center justify-between ${
                        active
                          ? "bg-afya-primary/10 text-afya-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-afya-primary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-afya-primary rounded-md transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary min-h-[44px] flex items-center ${
                    active
                      ? "bg-afya-primary/10 text-afya-primary font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-afya-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
