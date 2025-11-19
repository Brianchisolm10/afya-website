import PasswordResetConfirmForm from "@/components/auth/PasswordResetConfirmForm";

interface ResetPasswordConfirmPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordConfirmPage({ params }: ResetPasswordConfirmPageProps) {
  return <PasswordResetConfirmForm token={params.token} />;
}
