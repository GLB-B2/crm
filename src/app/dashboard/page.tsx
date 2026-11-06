import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-base font-semibold">b2solutions CRM</h1>
          <p className="text-xs text-neutral-500">
            Angemeldet als {session?.user?.name} ({(session?.user as { role?: string })?.role})
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm text-neutral-600 hover:text-neutral-900">
            Abmelden
          </button>
        </form>
      </header>

      <main className="p-6">
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            Grundgerüst steht. Leads, Projekte, Kontakte und die übrigen Module
            folgen in den nächsten Prompts aus dem Plan.
          </p>
        </div>
      </main>
    </div>
  );
}
