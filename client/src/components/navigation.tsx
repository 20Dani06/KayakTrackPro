import { Link, useLocation } from "wouter";
import { Waves } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/sessions", label: "Sessions" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Waves className="text-ocean-blue text-2xl" />
            <h1 className="text-xl font-bold text-gray-900">PaddleTracker</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`pb-4 transition-colors ${
                  location === item.href
                    ? "text-ocean-blue font-medium border-b-2 border-ocean-blue"
                    : "text-gray-600 hover:text-ocean-blue"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
