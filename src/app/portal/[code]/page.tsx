import { PortalDashboard } from "../../../components/Portal/PortalDashboard";

interface PageProps {
  params: Promise<{ code: string }>;
}

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  return {
    title: `Project Portal: ${code} | Portfolio OS`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PortalDetailsPage({ params }: PageProps) {
  const { code } = await params;
  return <PortalDashboard code={code} />;
}
