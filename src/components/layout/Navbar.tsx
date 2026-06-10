"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { hasPermission } from "@/lib/auth/permissions";
import type { Role } from "@/types/roles";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/clips", label: "Clips" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/creators", label: "Creators" },
  { href: "/socials", label: "Socials" },
  { href: "/shop", label: "Shop" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const roles = (session?.user?.roles ?? []) as Role[];
  const canViewAdmin = hasPermission(roles, "canViewAdmin");
  const canViewCreatorDashboard = hasPermission(roles, "canViewCreatorDashboard");
  const links = [
    ...baseLinks,
    ...(canViewCreatorDashboard
      ? [{ href: "/creator", label: "Studio" }]
      : []),
    ...(canViewAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-base font-black uppercase tracking-[0.16em] text-foreground"
          onClick={() => setOpen(false)}
        >
          Golf N <span className="text-primary">Ganja</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-muted lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              active={pathname === link.href}
              href={link.href}
              label={link.label}
            />
          ))}
        </nav>

        <div className="hidden lg:block">
          <AuthButton />
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary lg:hidden"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-3 text-base font-bold transition ${
                  pathname === link.href
                    ? "bg-primary-soft text-primary"
                    : "text-foreground hover:bg-surface"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 px-3">
              <AuthButton onAction={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`transition hover:text-foreground ${
        active ? "text-foreground" : "text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
