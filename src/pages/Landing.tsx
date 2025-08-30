// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { DEMO_MODE, SINGLE_WALLET_ADDRESS, CONTRACT_ADDRESS, ETHERSCAN_BASE } from "../constants/config";
import fairPayLogo from "../assets/FairPay.png";

export function Landing() {
  const { isAuthed } = useWeb3();
  const isSingle = DEMO_MODE === "single";
  const hasContract = Boolean(CONTRACT_ADDRESS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 text-gray-900 dark:text-gray-100">
      {/* Mode banner */}
      <div className="w-full border-b border-amber-200/60 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-900/20">
        <div className="mx-auto max-w-6xl px-4 py-2 text-[13px] leading-relaxed text-amber-800 dark:text-amber-200">
          {isSingle ? (
            <>
              <strong>Demo mode: Single.</strong> On-chain actions are executed by a <em>static backend wallet</em>.
              MetaMask is shown for UX/login only{SINGLE_WALLET_ADDRESS ? (
                <> — static wallet: <code className="px-1 bg-amber-100/60 dark:bg-amber-900/30 rounded">{SINGLE_WALLET_ADDRESS}</code></>
              ) : null}
              .
            </>
          ) : (
            <>
              <strong>Demo mode: Direct.</strong> This demo interacts directly with the Sepolia smart contract using your MetaMask signer.
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 pt-16 pb-10 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            {/* Logo mark */}
            <div className="inline-flex items-center gap-3">
              <img 
                src={fairPayLogo} 
                alt="FairPay Logo" 
                className="h-14 w-14 rounded-2xl shadow-lg ring-1 ring-white/20"
              />
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                FairPay
              </h1>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl">
              Deposit ETH, pay only for what you consume, and get <span className="font-semibold">automatic refunds</span> for the unused balance. Transparent, verifiable, and built for LATAM.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthed ? (
                <>
                  <Link
                    to="/session"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Open Session
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Sign in with MetaMask
                  </Link>
                  <a
                    href={hasContract ? `${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}` : "https://sepolia.etherscan.io"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    View on Etherscan
                  </a>
                </>
              )}
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 dark:border-gray-700 dark:bg-gray-800">
                ✅ Open source
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 dark:border-gray-700 dark:bg-gray-800">
                🔍 Verifiable on chain
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 dark:border-gray-700 dark:bg-gray-800">
                🌎 Built for LATAM
              </span>
            </div>
          </div>

          {/* Right illustration / preview */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-cyan-500/10 blur-3xl rounded-3xl"></div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-800/60">
              {/* pseudo preview of session panel */}
              <div className="grid gap-3 sm:grid-cols-3">
                {["Consumed Units", "Accrued Spend", "Expected Refund"].map((label, i) => (
                  <div key={label} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {i === 0 ? "128" : i === 1 ? "0.0034 ETH" : "0.0066 ETH"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium">Start Session</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2">
                      <input className="flex-1 max-w-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Deposit" defaultValue="0.01" />
                      <input className="flex-1 max-w-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Unit Price" defaultValue="0.000001" />
                    </div>
                    <button className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition-colors">
                      Start Session
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium">Usage Controls</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">Auto</button>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">Random</button>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">Add</button>
                    <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">Stop</button>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-700">
                <p className="font-medium">Recent Transactions</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center justify-between">
                    <span className="text-blue-600 underline dark:text-blue-400">0x12ab…9f31</span>
                    <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300">Mined</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-blue-600 underline dark:text-blue-400">0x77cd…c2a0</span>
                    <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">Pending</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Connect wallet", d: "Login with MetaMask on Sepolia." , i: "🦊" },
            { t: "Start session", d: "Deposit ETH and set a unit price.", i: "⚙️" },
            { t: "Use & track", d: "See units, spend and refund live.", i: "📈" },
            { t: "Close & refund", d: "Unused ETH is automatically refunded.", i: "🧾" },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="text-2xl">{s.i}</div>
              <p className="mt-3 font-medium">{s.t}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold">Why FairPay</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Transparent by design", d: "Every transaction is verifiable on Etherscan.", i: "🔍" },
            { t: "Open & auditable", d: "Open-source code and simple contracts.", i: "🧩" },
            { t: "Privacy-first", d: "No custodial keys in the frontend.", i: "🛡️" },
            { t: "LATAM-focused", d: "Designed for real use cases in LATAM.", i: "🌎" },
            { t: "Great DX/UX", d: "Clean UI, dark mode, and fast Vite build.", i: "✨" },
            { t: "Flexible modes", d: "Single-wallet (backend) or direct MetaMask.", i: "🧭" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="text-2xl">{f.i}</div>
              <p className="mt-3 font-medium">{f.t}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xl font-semibold">Ready to try FairPay?</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Spin up a session in seconds and see refunds in action.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={isAuthed ? "/session" : "/login"}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:opacity-90"
              >
                {isAuthed ? "Open Session" : "Sign in with MetaMask"}
              </Link>
              {hasContract && (
                <a
                  href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Contract on Etherscan
                </a>
              )}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FairPay • Built for Aleph ’25 Hackathon
        </p>
      </footer>
    </div>
  );
}

export default Landing;
