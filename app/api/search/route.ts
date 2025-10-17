import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");

  if (!zip) {
    return NextResponse.json({ error: "ZIP code missing" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("zip_lookup")
    .select("*")
    .eq("zip_code", zip);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ message: "ZIP not found" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
