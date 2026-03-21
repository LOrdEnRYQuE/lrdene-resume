"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftLinks = [
    { name: "Services", href: "/services" },
    { name: "Demos", href: "/demos" },
    { name: "Projects", href: "/projects" },
  ];

  const rightLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.navContainer} container`}>
        <div className={styles.leftNav}>
          {leftLinks.map((link) => (
            <Link key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </Link>
          ))}
        </div>
        
        <Link href="/" className={styles.logo}>
          <Image 
            src="/assets/LOGO.png" 
            alt="LOrdEnRYQuE Logo" 
            width={120} 
            height={52} 
            className={styles.logoImage} 
            priority
          />
        </Link>
        
        <div className={styles.rightNav}>
          {rightLinks.map((link) => (
            <Link key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </Link>
          ))}
          <button className={styles.cta}>
            Start a Project
          </button>
        </div>
      </div>
    </nav>
  );
};
