import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/legal-page";

const ImpressumPage = () => (
  <LegalPage
    title="Impressum"
    updated="Placeholder — not yet finalized"
    intro={
      <>
        <strong className="text-foreground">
          This page is a placeholder and must be completed with real operator
          details before production.
        </strong>{" "}
        Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).
      </>
    }
    sections={[
      {
        heading: "Diensteanbieter",
        body: (
          <ul className="list-disc space-y-1 pl-5">
            <li>Name: [Name des Betreibers]</li>
            <li>Anschrift: [Straße, Hausnummer, PLZ, Ort]</li>
            <li>E-Mail: [E-Mail-Adresse]</li>
          </ul>
        ),
      },
      {
        heading: "Vertreten durch",
        body: <p>[Name der vertretungsberechtigten Person(en)]</p>,
      },
      {
        heading: "Verantwortlich für den Inhalt",
        body: (
          <p>
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: [Name,
            Anschrift].
          </p>
        ),
      },
      {
        heading: "Haftung für Inhalte",
        body: (
          <p>
            Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
        ),
      },
      {
        heading: "Haftung für Links",
        body: (
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten
            Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich.
          </p>
        ),
      },
      {
        heading: "Urheberrecht",
        body: (
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge
            Dritter sind als solche gekennzeichnet.
          </p>
        ),
      },
    ]}
  />
);

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Impressum — NexVaultX" }],
  }),
  component: ImpressumPage,
});
