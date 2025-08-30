export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`px-3 py-2 rounded-lg border w-full ${props.className || ""}`} />;
}
