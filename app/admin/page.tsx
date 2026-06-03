"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  created_at: string;
  hasQuestionnaire: boolean;
  contributionCount: number;
}

interface Contribution {
  id: string;
  owner_id: string;
  contributor_name: string;
  contributor_email: string;
  created_at: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin");
      const data = await response.json();

      if (data.users) {
        setUsers(data.users);
      }

      const { data: contributionData } = await supabase
        .from("contributions")
        .select("*")
        .order("created_at", { ascending: false });

      setContributions(contributionData || []);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const totalWithQuestionnaire = users.filter((u) => u.hasQuestionnaire).length;

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em> — Admin
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
        >
          Back to dashboard
        </button>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Overview</p>
        <h1 className="font-serif text-5xl font-light mb-12">
          Admin <em className="text-[#e8c87a]">dashboard</em>
        </h1>

        {loading && (
          <p className="text-[#f5ede0]/30 text-sm">Loading data...</p>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="border border-[#d4aa5a]/20 rounded-sm p-6">
                <div className="font-serif text-4xl text-[#e8c87a] mb-1">{totalUsers}</div>
                <div className="text-xs tracking-widest uppercase text-[#f5ede0]/40">Total users</div>
              </div>
              <div className="border border-[#d4aa5a]/20 rounded-sm p-6">
                <div className="font-serif text-4xl text-[#e8c87a] mb-1">{totalWithQuestionnaire}</div>
                <div className="text-xs tracking-widest uppercase text-[#f5ede0]/40">Completed questionnaire</div>
              </div>
              <div className="border border-[#d4aa5a]/20 rounded-sm p-6">
                <div className="font-serif text-4xl text-[#e8c87a] mb-1">{contributions.length}</div>
                <div className="text-xs tracking-widest uppercase text-[#f5ede0]/40">Family contributions</div>
              </div>
            </div>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Search users by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
              />
            </div>

            <div className="mb-12">
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">
                Users ({filteredUsers.length})
              </p>
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-[#f5ede0]/30">No users found.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                      className="border border-[#d4aa5a]/15 rounded-sm p-4 cursor-pointer hover:border-[#d4aa5a]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-[#f5ede0]">{user.email}</div>
                        <div className="text-xs text-[#f5ede0]/25">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className={`text-xs px-2 py-1 rounded-sm ${user.hasQuestionnaire ? "bg-[#d4aa5a]/20 text-[#d4aa5a]" : "bg-[#f5ede0]/5 text-[#f5ede0]/30"}`}>
                          {user.hasQuestionnaire ? "Questionnaire done" : "No questionnaire"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-sm ${user.contributionCount > 0 ? "bg-[#d4aa5a]/20 text-[#d4aa5a]" : "bg-[#f5ede0]/5 text-[#f5ede0]/30"}`}>
                          {user.contributionCount > 0 ? `${user.contributionCount} contributions` : "No contributions"}
                        </span>
                      </div>
                      {selectedUser?.id === user.id && (
                        <div className="mt-4 pt-4 border-t border-[#d4aa5a]/10">
                          <div className="text-xs text-[#f5ede0]/40 mb-2">User ID: {user.id}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-12">
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">
                Recent contributions
              </p>
              {contributions.length === 0 ? (
                <p className="text-sm text-[#f5ede0]/30">No contributions yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {contributions.slice(0, 10).map((c) => (
                    <div key={c.id} className="border border-[#d4aa5a]/15 rounded-sm p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-serif text-sm text-[#f5ede0]">{c.contributor_name}</div>
                        <div className="text-xs text-[#f5ede0]/25">
                          {new Date(c.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      {c.contributor_email && (
                        <div className="text-xs text-[#d4aa5a]/40">{c.contributor_email}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}