import Card from "@/components/Card";
import Button from "@/components/Button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-bold mb-2">FairPay</h1>
        <p className="text-gray-600 mb-4">Pay only for what you use. Unused balance is automatically refunded.</p>
        <div className="flex gap-3">
          <Link to="/session"><Button>Start a Session</Button></Link>
          <Link to="/dashboard"><Button kind="ghost">Dashboard</Button></Link>
        </div>
      </Card>
    </div>
  );
}
