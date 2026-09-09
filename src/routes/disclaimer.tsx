import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/legal-page";

const DisclaimerPage = () => (
  <LegalPage
    title="Disclaimer"
    updated="Placeholder — not yet finalized"
    intro={
      <>
        <strong className="text-foreground">
          This page is a placeholder and must be reviewed before production.
        </strong>{" "}
        This disclaimer governs your use of the NexVaultX platform.
      </>
    }
    sections={[
      {
        heading: "No Warranty",
        body: (
          <p>
            The platform and its content are provided &ldquo;as is&rdquo;
            without warranties of any kind, express or implied, including
            accuracy, availability, or fitness for a particular purpose.
          </p>
        ),
      },
      {
        heading: "No Liability",
        body: (
          <p>
            To the maximum extent permitted by law, NexVaultX and its
            contributors shall not be liable for any damages arising from the
            use of, or inability to use, the platform.
          </p>
        ),
      },
      {
        heading: "External Links",
        body: (
          <p>
            The platform may link to external websites. We have no control over,
            and assume no responsibility for, the content or practices of any
            third-party sites.
          </p>
        ),
      },
      {
        heading: "Not Affiliated with Mojang or Microsoft",
        body: (
          <p>
            NexVaultX is an independent, community-driven project. It is not
            affiliated with, endorsed by, or sponsored by Mojang Studios or
            Microsoft. &ldquo;Minecraft&rdquo; is a trademark of Mojang
            Synergies AB.
          </p>
        ),
      },
      {
        heading: "Content Accuracy",
        body: (
          <p>
            Content on the platform is user-submitted and may be inaccurate,
            outdated, or incomplete. Verify information before relying on it.
          </p>
        ),
      },
    ]}
  />
);

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [{ title: "Disclaimer — NexVaultX" }],
  }),
  component: DisclaimerPage,
});
