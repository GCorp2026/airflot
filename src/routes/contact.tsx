import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell, Footer } from "@/components/chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — New Form" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const note = String(data.get("note") || "").trim();
    if (name.length < 2) {
      setError("Add your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn’t look right.");
      return;
    }
    if (note.length < 8) {
      setError("Tell us a little more.");
      return;
    }
    setError("");
    const href = `mailto:info@newformcap.com?subject=${encodeURIComponent(`Note from ${name}`)}&body=${encodeURIComponent(`${note}\n\n— ${name}\n${email}`)}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <SiteShell initialTheme="light">
      <main className="subpage sub-light" data-theme="light">
        <div className="contact-grid">
          <header className="sub-hero">
            <p className="eyebrow">Get in touch</p>
            <h1>Tell us what you’re building.</h1>
            <p className="lede">
              We invest at the earliest stages, where blockchain, financial markets, and data meet.
              Or write directly to{" "}
              <a href="mailto:info@newformcap.com">info@newformcap.com</a>.
            </p>
          </header>
          {sent ? (
            <div className="sent" role="status">
              <h2>Your mail app should be open.</h2>
              <p>
                If it isn’t, send the note to info@newformcap.com. We read everything that lands
                there.
              </p>
            </div>
          ) : (
            <form className="cform" onSubmit={onSubmit} noValidate>
              <label>
                Name
                <input className="field" name="name" autoComplete="name" required />
              </label>
              <label>
                Email
                <input className="field" name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                Note
                <textarea className="field area" name="note" rows={4} required />
              </label>
              {error ? <p className="form-error">{error}</p> : null}
              <button className="btn" type="submit">
                Get in Touch
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </SiteShell>
  );
}
