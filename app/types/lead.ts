export type Lead = {
  id: string;
  name: string;
  phone: string;
  source?: string;
  status?: string;
  travel_date?: string;
  days?: number;
  nights?: number;
  location?: string;   // ✅ optional everywhere
  adults?: number;
  kids?: number;
  budget?: number;
  notes?: string;
  next_followup?: string;
  assigned_to?: string;
  created: string;
};
