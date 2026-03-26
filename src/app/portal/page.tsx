import { PortalAccess } from "../../components/Portal/PortalAccess";

export const metadata = {
  title: "Secure Portal Access | Portfolio OS",
  description: "Enter your private access code to view project progress.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLoginPage() {
  return <PortalAccess />;
}
