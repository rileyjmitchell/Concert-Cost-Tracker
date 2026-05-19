"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ListMusic, PlusCircle } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", short: "Home", icon: BarChart3 },
  { href: "/add", label: "Add Concert", short: "Add", icon: PlusCircle },
  { href: "/concerts", label: "My Concerts", short: "Shows", icon: ListMusic },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:flex gap-1 bg-base-200/60 rounded-full p-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`btn btn-sm gap-2 rounded-full border-0 ${
                active ? "btn-primary shadow-sm" : "btn-ghost"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <nav
        className="btm-nav md:hidden border-t border-base-300 bg-base-100/95 backdrop-blur z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {links.map(({ href, short, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={active ? "active text-primary font-medium" : "text-base-content/70"}
            >
              <Icon className="h-5 w-5" />
              <span className="btm-nav-label text-[10px] sm:text-xs">{short}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
