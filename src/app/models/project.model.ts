export interface Project {
  id: number;
  name: string;
  description?: string | null;
  topic: string;
  owner: number;        
  members: number[];   
}