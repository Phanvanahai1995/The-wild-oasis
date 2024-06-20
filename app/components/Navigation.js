"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const path = usePathname();

  return (
    <ul>
      <li>
        <Link href="/" className={path === "/" ? "active" : undefined}>
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/cabins"
          className={path === "/cabins" ? "active" : undefined}
        >
          Cabins
        </Link>
      </li>

      <li>
        <Link
          href="/about"
          className={path === "/about" ? "active" : undefined}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          href="/account"
          className={path === "/account" ? "active" : undefined}
        >
          Your Account
        </Link>
      </li>
    </ul>
  );
}

export default Navigation;
