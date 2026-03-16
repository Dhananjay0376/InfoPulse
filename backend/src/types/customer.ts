export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  status: "active" | "inactive" | "blocked";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  emailOptIn: boolean;
}
