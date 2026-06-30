import React from "react";
import { Link } from "react-router-dom";
import { useScrollOnRouteChange } from "../../hooks/useScrollOnRouteChange";
import "./StaticPage.css";

export default function StaticPage({
  eyebrow,
  title,
  description,
  sections = [],
  cta,
}) {
  useScrollOnRouteChange();

  return (
    <section className="static-page">
      <header className="static-page-hero">
        {eyebrow && <p className="static-page-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <div className="static-page-grid">
        {sections.map((section) => (
          <article key={section.title} className="static-page-card">
            <h2>{section.title}</h2>
            {Array.isArray(section.content) ? (
              <ul>
                {section.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section.content}</p>
            )}
          </article>
        ))}
      </div>

      {cta && (
        <div className="static-page-cta">
          <p>{cta.text}</p>
          <Link to={cta.to}>{cta.label}</Link>
        </div>
      )}
    </section>
  );
}