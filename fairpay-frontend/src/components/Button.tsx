export default function Button({ children, onClick, disabled, kind = "primary" }:
  { children: React.ReactNode; onClick?: () => void; disabled?: boolean; kind?: "primary"|"ghost" }) {
  const base = "px-4 py-2 rounded-lg text-sm transition border";
  const styles = kind === "primary"
    ? "bg-primary-500 text-white border-primary-500 hover:opacity-90 disabled:opacity-50"
    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
