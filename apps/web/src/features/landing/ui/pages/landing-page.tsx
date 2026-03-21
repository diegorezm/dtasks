import { LandingCTA } from "../components/landing-cta";
import { LandingFeatures } from "../components/landing-features";
import { LandingHero } from "../components/landing-hero";

export const LandingPage = () => {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </>
  );
};
