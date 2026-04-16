import { useCallback, useEffect, useState } from "react";
import { addFinds, getWalletFinds } from "@/db";

export function useWallet() {
  const [finds, setFinds] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const value = await getWalletFinds();
    setFinds(value);
    setLoading(false);
  }, []);

  const earn = useCallback(async (amount: number) => {
    const updated = await addFinds(amount);
    setFinds(updated);
    return updated;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { finds, loading, refresh, earn };
}
