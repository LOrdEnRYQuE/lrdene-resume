import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { buildVCard } from "@/lib/smartHub/contactCard";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicCode: string }> },
) {
  const { publicCode } = await params;
  const card = await fetchQuery(api.smartHub.getPublicContactCard, { publicCode });

  if (!card || card.profile.status === "configuration_required") {
    return new Response("Contact card is not configured", { status: 404 });
  }

  try {
    await fetchMutation(api.smartHub.recordPublicInteraction, {
      publicCode,
      type: "vcard_download",
    });
  } catch {
    // A metrics failure must not prevent the customer from saving the contact.
  }

  const body = buildVCard(card.profile);
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      "content-disposition": `attachment; filename="lordenryque-contact-${publicCode}.vcf"`,
      "cache-control": "no-store",
    },
  });
}
