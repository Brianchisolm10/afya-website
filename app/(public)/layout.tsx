"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button, BackButton } from "@/components/ui";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Only show back button on intake-related pages
  const showBackButton = pathname?.startsWith('/intake') || pathname?.startsWith('/get-started');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-afya-primary to-afya-secondary bg-clip-text text-transparent">AFYA</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-afya-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-2 py-1"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-afya-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-2 py-1"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-gray-700 hover:text-afya-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-2 py-1"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-afya-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-afya-primary rounded px-2 py-1"
              >
                Contact
              </Link>
              <Link href="/get-started" passHref legacyBehavior>
                <Button as="a" variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-afya-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-afya-primary"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
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
            <div className="md:hidden py-4 space-y-2 animate-slideDown" role="navigation" aria-label="Mobile navigation">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/get-started"
                className="block px-4 py-2 bg-afya-primary text-white rounded-md hover:bg-afya-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-afya-primary focus:ring-offset-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Back Button - Shows only on intake and get-started pages */}
      {showBackButton && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <BackButton />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-afya-dark text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* About AFYA */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-white">AFYA</h3>
              <p className="text-gray-300 text-sm mb-4">
                Movement for everyone. Personalized health and fitness guidance
                to help you achieve your goals.
              </p>
              <div className="flex space-x-3">
                {/* Social Media Icons - Placeholder */}
                <a href="#" className="text-gray-400 hover:text-afya-primary transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-afya-primary transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-afya-primary transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services & Programs */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Services & Programs</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Personal Training
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Nutrition Coaching
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Wellness Packets
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Group Classes
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Online Coaching
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-afya-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Blog & Tips
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-afya-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account & Support */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Account & Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-afya-primary hover:text-afya-primary-light transition-colors font-semibold">
                    Client Login
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-afya-primary transition-colors">
                    My Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/get-started" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-afya-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support AFYA */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Support AFYA</h3>
              <p className="text-gray-300 text-sm mb-4">
                Help us make movement accessible to everyone in our community.
              </p>
              <Link href="/donate" passHref legacyBehavior>
                <Button
                  as="a"
                  variant="secondary"
                  size="sm"
                  className="w-full mb-3 bg-afya-secondary hover:bg-afya-secondary-dark"
                >
                  Donate Now
                </Button>
              </Link>
              <div className="text-xs text-gray-400 space-y-1">
                <p>📧 afya@theafya.org</p>
                <p>📍 Maryland, United States</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} AFYA - Movement for Everyone. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
