import { useCallback, useEffect, useState } from "react";

import {
  getCampaignDeliveries,
  type CampaignDeliverySummary,
  type DeliveryPayload,
} from "../lib/api";

export function useCampaignInsights(token: string | null, campaignId: string | null) {
  const [summary, setSummary] = useState<CampaignDeliverySummary>({});
  const [deliveries, setDeliveries] = useState<DeliveryPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInsights = useCallback(async () => {
    if (!token || !campaignId) {
      setSummary({});
      setDeliveries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCampaignDeliveries(token, campaignId);
      setSummary(response.summary);
      setDeliveries(response.deliveries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign insights");
    } finally {
      setLoading(false);
    }
  }, [token, campaignId]);

  useEffect(() => {
    void refreshInsights();
  }, [refreshInsights]);

  return {
    summary,
    deliveries,
    loading,
    error,
    refreshInsights,
  };
}
