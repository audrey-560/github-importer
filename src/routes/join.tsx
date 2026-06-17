import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitSignup } from "@/lib/signups.functions";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the club — Girls Gotta Golf" },
      { name: "description", content: "Tell us about you so we can plan the right tee times, clinics, and socials. Takes under a minute." },
      { property: "og:title", content: "Join Girls Gotta Golf" },
      { property: "og:description", content: "A modern golf club for girls — beginner-friendly events, clinics, group play, and post-golf socials." },
    ],
  }),
  component: JoinPage,
});

const LEVELS = [
  "Never held a club",
  "Been to the range a few times",
  "I play casually",
  "I'm pretty good",
];

const INTERESTS = [
  "Play holes together",
  "Driving range",
  "Practice / clinics",
  "Just the social (drinks before/after)",
  "Meet other golf girls",
];

const AVAILABILITY = ["Weekday evenings", "Weekend mornings", "Weekend afternoons"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function JoinPage() {
  const submit = useServerFn(submitSignup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      await submit({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          golf_level: level,
          interests,
          availability,
          instagram: instagram.trim() || null,
        },
      });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again in a moment.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="join-page">
        <div className="join-done">
          <img src="/assets/stills/logo-green.png" alt="Girls Gotta Golf" className="join-mark" />
          <p className="done-line">You're on the list — see you on the green.</p>
          <Link to="/" className="back-link">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="join-page">
      <img src="/assets/stills/logo-green.png" alt="Girls Gotta Golf" className="join-mark" />
      <h1>Join the club</h1>
      <p className="join-sub">
        Tell us a little about you so we can plan the right tee times, clinics, and
        socials. Takes under a minute.
      </p>

      <form className="join-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="q" htmlFor="name">Your name</label>
          <input
            id="name"
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            required
          />
        </div>

        <div className="field">
          <label className="q" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="text-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </div>

        <div className="field">
          <label className="q">What's your golf level?</label>
          <div className="chips">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                className={`chip ${level === l ? "selected" : ""}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="q">
            What are you most excited to do?
            <span className="opt-help">pick any</span>
          </label>
          <div className="chips">
            {INTERESTS.map((i) => (
              <button
                type="button"
                key={i}
                className={`chip ${interests.includes(i) ? "selected" : ""}`}
                onClick={() => setInterests((cur) => toggle(cur, i))}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="q">
            When works for you?
            <span className="opt-help">pick any</span>
          </label>
          <div className="chips">
            {AVAILABILITY.map((a) => (
              <button
                type="button"
                key={a}
                className={`chip ${availability.includes(a) ? "selected" : ""}`}
                onClick={() => setAvailability((cur) => toggle(cur, a))}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="q" htmlFor="instagram">
            Instagram <span className="opt-help">optional</span>
          </label>
          <input
            id="instagram"
            className="text-input"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@yourhandle"
          />
        </div>

        {error && <p className="form-msg error">{error}</p>}

        <button className="submit-btn" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Signing you up…" : "Sign me up"}
        </button>
      </form>
    </div>
  );
}
