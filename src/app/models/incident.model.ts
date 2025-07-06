export interface Incident {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  createdAt: Date;
  openingTime: Date | null; 
  closingTime: Date | null; 
  assignedTo: string | null;
  status: string;
  resolution: string | null;
}