export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded-xl p-6 shadow-sm">{children}</div>;
}
