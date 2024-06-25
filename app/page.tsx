import { supabaseServerClient } from "@/utils/supabase/server";

export default async function Home() {
  const { data } = await  supabaseServerClient.auth.getSession()
  console.log("🚀 ~ Home ~ data:", data)
  const {
    data: user,
  } = await supabaseServerClient.auth.getUser()
  console.log("🚀 ~ Home ~ user:", user)
  return (
    <div>Home</div>
  );
}
