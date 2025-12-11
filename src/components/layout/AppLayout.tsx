import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../utils/classNames";
import Avatar from "../ui/Avatar";
import Dropdown, { DropdownItem, DropdownDivider } from "../ui/Dropdown";

const navigation = [
  { label: "Courses", path: "/", icon: "📚" },
  { label: "My Progress", path: "/progress", icon: "📊", disabled: true },
];

// Breadcrumb mapping
const breadcrumbMap: Record<string, string[]> = {
  "/": ["Home", "Courses"],
  "/courses": ["Home", "Courses"],
  "/progress": ["Home", "My Progress"],
};

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    if (location.pathname.startsWith("/courses/")) {
      return ["Home", "Courses", "Course Detail"];
    }
    return breadcrumbMap[location.pathname] || ["Home"];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  C
                </div>
                <div className="hidden sm:block">
                  <p className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    CodeLearn
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Learning Platform</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) =>
                  item.disabled ? (
                    <div
                      key={item.path}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="ml-1 px-2 py-0.5 text-xs bg-slate-100 rounded-full">Soon</span>
                    </div>
                  ) : (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                          isActive
                            ? "bg-primary-100 text-primary-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )
                      }
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  )
                )}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Shortcut - Desktop */}
              <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
                <kbd className="hidden xl:inline-block px-2 py-0.5 text-xs font-semibold bg-white rounded border border-slate-300">⌘K</kbd>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white"></span>
              </button>

              {/* User Menu */}
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar name="Apprenant" status="online" size="md" />
                    <svg className="hidden sm:block w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                }
                align="right"
              >
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-bold text-slate-900">Apprenant #1</p>
                  <p className="text-xs text-slate-500">apprenant@codelearn.com</p>
                </div>
                <DropdownItem
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                >
                  Settings
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                  danger
                >
                  Sign out
                </DropdownItem>
              </Dropdown>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white py-3 animate-slide-down">
            <nav className="px-4 space-y-1">
              {navigation.map((item) =>
                item.disabled ? (
                  <div
                    key={item.path}
                    className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-400"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">Soon</span>
                  </div>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-primary-100 text-primary-700"
                          : "text-slate-600 hover:bg-slate-100"
                      )
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                )
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white/50 border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 py-3 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span
                  className={cn(
                    "font-medium",
                    index === breadcrumbs.length - 1
                      ? "text-primary-600"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Alternative for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40">
        <nav className="flex items-center justify-around px-2 py-3">
          {navigation.slice(0, 3).map((item) =>
            item.disabled ? (
              <div
                key={item.path}
                className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                    isActive
                      ? "text-primary-600"
                      : "text-slate-600"
                  )
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>
    </div>
  );
};
