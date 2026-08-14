"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "technology", label: "Technology" },
  { id: "applications", label: "Treatment applications" },
  { id: "features", label: "Key features" },
  { id: "included", label: "What's included" },
  { id: "specifications", label: "Specifications" },
];

export function ProductSectionNav() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.25, 0.5, 0.75] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="product-section-nav" aria-label="Product information">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={activeSection === id ? "active" : undefined}
          aria-current={activeSection === id ? "location" : undefined}
        >
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
