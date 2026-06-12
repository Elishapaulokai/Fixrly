import MetaData from "@/components/Meta/MetaData";
import dynamic from "next/dynamic";

const AuthPage = dynamic(
  () => import("@/components/PagesComponents/Auth/AuthPage"),
  { ssr: false }
);

export default function RegisterPage() {
  return (
    <>
      <MetaData
        title={`Register - ${process.env.NEXT_PUBLIC_APP_NAME || "Fixrly"}`}
        description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
        pageName="/register"
        robots="noindex, nofollow"
      />
      <AuthPage initialMode="register" />
    </>
  );
}
