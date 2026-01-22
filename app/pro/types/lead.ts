export interface Lead {
  id: string;
  status: string;
  created: string;
  assigned_to: string;
  next_followup?: string | null;
}
