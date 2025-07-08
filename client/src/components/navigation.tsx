import { Link, useLocation } from "wouter";
import Logo from "./logo";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/sessions", label: "Sessions" },
    { href: "/analytics", label: "Analytics" },
    { href: "/fitness", label: "Fitness Stats" },
    { href: "/diary", label: "Diary" },
    { href: "/calendar", label: "Calendar" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
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
