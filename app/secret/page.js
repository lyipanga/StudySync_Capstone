import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Secret() {
  const session = await auth();
  if (!session) return redirect("/login");

  return (
    <h1 className="text-2xl text-green-700">
      Welcome to the secret content!!!
    </h1>
  );
}
