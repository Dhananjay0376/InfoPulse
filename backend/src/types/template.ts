export interface EmailTemplateRecord {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
