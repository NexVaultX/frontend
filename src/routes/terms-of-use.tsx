import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/legal-page";

const TermsOfUsePage = () => (
  <LegalPage
    title="Terms of Use"
    updated="Placeholder — not yet finalized"
    intro={
      <>
        <strong className="text-foreground">
          This page is a placeholder and must be reviewed before production.
        </strong>{" "}
        These Terms of Use set out the rules for using the NexVaultX platform as
        a user.
      </>
    }
    sections={[
      {
        heading: "Your Responsibilities",
        body: (
          <ul className="list-disc space-y-1 pl-5">
            <li>Keep your account credentials secure.</li>
            <li>Provide accurate information when creating an account.</li>
            <li>Respect the rights of other users and content creators.</li>
            <li>Comply with all applicable laws when using the platform.</li>
          </ul>
        ),
      },
      {
        heading: "Prohibited Conduct",
        body: (
          <ul className="list-disc space-y-1 pl-5">
            <li>Attempting to disrupt or overload the service.</li>
            <li>
              Accessing areas of the platform you are not authorized to use.
            </li>
            <li>Uploading malicious, unlawful, or infringing content.</li>
            <li>Impersonating other users or misrepresenting your identity.</li>
          </ul>
        ),
      },
      {
        heading: "Community Content",
        body: (
          <p>
            Content on the platform is provided by the community. NexVaultX does
            not endorse and is not responsible for user-submitted content.
          </p>
        ),
      },
      {
        heading: "Account Termination",
        body: (
          <p>
            We may suspend or terminate accounts that violate these Terms of
            Use. You can delete your account at any time from the settings page.
          </p>
        ),
      },
      {
        heading: "Contact",
        body: <p>Questions about these Terms of Use can be sent to [Email].</p>,
      },
    ]}
  />
);

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [{ title: "Terms of Use — NexVaultX" }],
  }),
  component: TermsOfUsePage,
});
