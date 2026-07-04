import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Bring your own library to the cloud">
      <RegisterForm />
    </AuthLayout>
  );
}
