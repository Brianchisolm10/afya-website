import AccountSetupForm from "@/components/auth/AccountSetupForm";

interface SetupPageProps {
  params: {
    token: string;
  };
}

export default function SetupPage({ params }: SetupPageProps) {
  return <AccountSetupForm token={params.token} />;
}
