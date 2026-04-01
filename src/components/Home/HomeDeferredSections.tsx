"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n/config";

type BlogPost = {
  slug: string;
  _creationTime: number;
  readTime: string;
  title: string;
  excerpt: string;
};

const About = dynamic(
  () => import("@/components/About/About").then((m) => m.About),
  { ssr: false },
);
const ProcessSection = dynamic(
  () => import("@/components/ProcessSection/ProcessSection").then((m) => m.ProcessSection),
  { ssr: false },
);
const BlogPreview = dynamic(
  () => import("@/components/Blog/BlogPreview").then((m) => m.BlogPreview),
  { ssr: false },
);
const Contact = dynamic(
  () => import("@/components/Contact/Contact").then((m) => m.Contact),
  { ssr: false },
);
const FinalCTA = dynamic(
  () => import("@/components/FinalCTA/FinalCTA").then((m) => m.FinalCTA),
  { ssr: false },
);

type HomeDeferredSectionsProps = {
  locale: Locale;
  posts: BlogPost[];
};

function DeferredBlock({
  children,
  minHeight,
}: {
  children: React.ReactNode;
  minHeight: number;
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const target = anchorRef.current;
    if (!target) return;

    let idleId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(target);

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(() => setMounted(true), { timeout: 2200 });
    }

    return () => {
      observer.disconnect();
      if (idleId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
    };
  }, [mounted]);

  return (
    <div
      ref={anchorRef}
      style={{ contentVisibility: "auto", containIntrinsicSize: `${minHeight}px`, minHeight }}
    >
      {mounted ? children : null}
    </div>
  );
}

export default function HomeDeferredSections({ locale, posts }: HomeDeferredSectionsProps) {
  return (
    <>
      <DeferredBlock minHeight={1400}>
        <About />
      </DeferredBlock>
      <DeferredBlock minHeight={900}>
        <ProcessSection locale={locale} />
      </DeferredBlock>
      <DeferredBlock minHeight={1200}>
        <BlogPreview locale={locale} posts={posts} />
      </DeferredBlock>
      <DeferredBlock minHeight={1600}>
        <Contact />
      </DeferredBlock>
      <DeferredBlock minHeight={420}>
        <FinalCTA locale={locale} />
      </DeferredBlock>
    </>
  );
}
