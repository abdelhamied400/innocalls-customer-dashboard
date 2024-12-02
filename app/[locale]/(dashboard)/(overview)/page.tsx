"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();

  return (
    <div className="page" id="dashboard">
      <h1>Dashboard</h1>
      <h1>{t("title")}</h1>
      <Button onClick={() => router.replace("/", { locale: "ar" })}>ar</Button>
      <Button onClick={() => router.replace("/", { locale: "en" })}>en</Button>
    </div>
  );
};

export default Dashboard;
