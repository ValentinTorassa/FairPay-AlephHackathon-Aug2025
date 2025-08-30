import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/context/Web3Context";
import { parseEther } from "ethers";
import { useSepoliaGuard } from "@/hooks/useSepoliaGuard";

export default function Session() {
  const { account } = useWeb3();
  const { ok } = useSepoliaGuard();
  const contract = useContract();

  const [deposit, setDeposit] = useState("0.01");
  const [unitPrice, setUnitPrice] = useState("0.000001");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    try {
      setLoading(true);
      const c = await contract.withSigner();
      const tx = await c.startSession(parseEther(deposit), parseEther(unitPrice), { value: parseEther(deposit) });
      await tx.wait();
      alert("Session started!");
    } finally {
      setLoading(false);
    }
  };

  const close = async () => {
    try {
      setLoading(true);
      const c = await contract.withSigner();
      const tx = await c.closeSession();
      await tx.wait();
      alert("Session closed and refund processed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Start a Session</h2>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Deposit (ETH)</label>
            <Input value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Unit Price (ETH/unit)</label>
            <Input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button onClick={start} disabled={!account || !ok || loading}>Start</Button>
            <Button kind="ghost" onClick={close} disabled={!account || !ok || loading}>Close</Button>
          </div>
        </div>
        {!ok && <p className="text-sm text-red-600 mt-2">Switch to Sepolia in MetaMask to proceed.</p>}
      </Card>
    </div>
  );
}
