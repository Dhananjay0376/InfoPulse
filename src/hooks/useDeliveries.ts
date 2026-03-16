import { useCallback, useEffect, useState } from "react";

import { listDeliveries, type DeliveryPayload } from "../lib/api";

export function useDeliveries(token: string | null) {
  const [deliveries, setDeliveries] = useState<DeliveryPayload[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const refreshDeliveries = useCallback(async () => {
    if (!token) {
      setDeliveries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await listDeliveries(token);
      setDeliveries(response.deliveries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshDeliveries();
  }, [refreshDeliveries]);

  return {
    deliveries,
    loading,
    error,
    refreshDeliveries,
  };
}
