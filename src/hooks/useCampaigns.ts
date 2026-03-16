import { useCallback, useEffect, useState } from "react";

import {
  createCampaign,
  launchCampaign as launchCampaignRequest,
  listCampaigns,
  type CampaignInput,
  type CampaignPayload,
} from "../lib/api";

export function useCampaigns(token: string | null) {
  const [campaigns, setCampaigns] = useState<CampaignPayload[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const refreshCampaigns = useCallback(async () => {
    if (!token) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await listCampaigns(token);
      setCampaigns(response.campaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshCampaigns();
  }, [refreshCampaigns]);

  const addCampaign = useCallback(async (input: CampaignInput) => {
    if (!token) return;
    const response = await createCampaign(token, input);
    setCampaigns((prev) => [response.campaign, ...prev]);
    return response.campaign;
  }, [token]);

  const launchCampaign = useCallback(async (campaignId: string) => {
    if (!token) return;
    const response = await launchCampaignRequest(token, campaignId);
    setCampaigns((prev) => prev.map((campaign) => (
      campaign.id === campaignId ? response.campaign : campaign
    )));
    return response.campaign;
  }, [token]);

  return {
    campaigns,
    loading,
    error,
    refreshCampaigns,
    addCampaign,
    launchCampaign,
  };
}
