import {
  IconBell,
  IconBolt,
  IconCompass,
  IconDeviceGamepad2,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { FeatureSection } from "@/components/feature-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { NewsSection } from "@/components/news-section";

const PLAYER_FEATURES = [
  {
    icon: IconBolt,
    title: "Fast Search",
    description:
      "Find exactly what you need in milliseconds with powerful filters and instant results.",
  },
  {
    icon: IconBell,
    title: "Follow Projects",
    description:
      "Stay up to date with the projects you love. Get notified on every new release.",
  },
  {
    icon: IconDeviceGamepad2,
    title: "Launcher Integration",
    description:
      "Install and update mods directly from your launcher with one-click setup.",
  },
];

const CREATOR_FEATURES = [
  {
    icon: IconCompass,
    title: "Discovery",
    description:
      "Get your projects in front of millions of players with smart recommendations.",
  },
  {
    icon: IconUsers,
    title: "Team Management",
    description:
      "Collaborate with your team, manage roles, and publish together seamlessly.",
  },
  {
    icon: IconWallet,
    title: "Monetization",
    description:
      "Earn from your work with transparent, creator-friendly monetization options.",
  },
];

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <FeaturedProjects />
      <FeatureSection
        id="for-players"
        headingId="for-players-heading"
        title="For Players"
        description="Everything you need to discover, install, and enjoy the best Minecraft content."
        features={PLAYER_FEATURES}
      />
      <FeatureSection
        id="for-creators"
        headingId="for-creators-heading"
        title="For Creators"
        description="Powerful tools to publish, grow, and monetize your Minecraft projects."
        features={CREATOR_FEATURES}
      />
      <NewsSection />
    </main>
    <Footer />
  </>
);

export const Route = createFileRoute("/")({ component: HomePage });
