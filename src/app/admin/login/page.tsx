import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <form action={login} className="w-full max-w-sm border border-line p-8">
        <h1 className="display text-2xl">Admin</h1>
        {from ? <input type="hidden" name="from" value={from} /> : null}
        <label className="eyebrow mt-8 mb-2 block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full border border-line bg-bg px-3 py-2 text-sm focus:border-ink focus:outline-none"
        />
        {error ? <p className="mt-3 text-sm text-accent">Wrong password.</p> : null}
        <button
          type="submit"
          className="mt-6 w-full cursor-pointer bg-ink py-2.5 text-sm text-bg transition-opacity hover:opacity-85"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
