import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: questionnaires } = await supabaseAdmin
      .from("questionnaire")
      .select("user_id, created_at, answers");

    const { data: contributions } = await supabaseAdmin
      .from("contributions")
      .select("owner_id, contributor_name, contributor_email, created_at");

    const usersWithData = users.map((user) => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      hasQuestionnaire: questionnaires?.some((q) => q.user_id === user.id),
      contributionCount: contributions?.filter((c) => c.owner_id === user.id).length || 0,
    }));

    return NextResponse.json({ users: usersWithData });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}