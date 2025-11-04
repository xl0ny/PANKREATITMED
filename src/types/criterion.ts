export interface Criterion {
  id: number;
  code: string;
  name: string;
  description: string;
  duration: string;
  home_visit: boolean;
  image_url: string | null;
  status: string;
  unit: string;
  ref_low: number | null;
  ref_high: number | null;
}