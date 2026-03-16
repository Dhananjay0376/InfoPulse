import { useCallback, useEffect, useState } from "react";

import {
  createTemplate,
  listTemplates,
  type TemplateInput,
  type TemplatePayload,
} from "../lib/api";

export function useTemplates(token: string | null) {
  const [templates, setTemplates] = useState<TemplatePayload[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const refreshTemplates = useCallback(async () => {
    if (!token) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await listTemplates(token);
      setTemplates(response.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshTemplates();
  }, [refreshTemplates]);

  const addTemplate = useCallback(async (input: TemplateInput) => {
    if (!token) return;
    const response = await createTemplate(token, input);
    setTemplates((prev) => [response.template, ...prev]);
    return response.template;
  }, [token]);

  return {
    templates,
    loading,
    error,
    refreshTemplates,
    addTemplate,
  };
}
