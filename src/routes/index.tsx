import { createFileRoute, Link } from "@tanstack/react-router";
import GolfJourney from "@/components/GolfJourney";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Girls Gotta Golf — A golf club for girls" },
      { name: "description", content: "A golf club for girls in Toronto — beginner-friendly events, clinics, group play, and post-golf socials." },
      { property: "og:title", content: "Girls Gotta Golf" },
      { property: "og:description", content: "A modern third place for women — active, social, stylish, grounded in real connections." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <GolfJourney />

      <section className="story">
        <p className="kicker">Why this exists</p>
        <h2>A golf club for girls.</h2>
        <p className="founder">
          “I started golfing in 2022 and could never find girlfriends to golf with —
          so I started this. No big plan yet. If we get a group of girls going,
          we'll make it happen.”
        </p>

        <p className="reassure">Never golfed? Perfect.</p>

        <ul className="expect-grid">
          <li>Beginner-friendly events</li>
          <li>Practice sessions &amp; clinics</li>
          <li>Group play on real courses</li>
          <li>Post-golf drinks &amp; socials</li>
        </ul>

        <Link to="/join" className="cta-join">
          Join the community
        </Link>

        <footer>
          <img src="/assets/stills/logo-green.png" alt="" className="foot-mark" />
          <p>© 2026 Girls Gotta Golf · Toronto</p>
        </footer>
      </section>
    </>
  );
}
