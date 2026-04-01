export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo: string;
  members?: TeamMember[];
}

export interface Meeting {
  id: string;
  department: string;
  date: string;
  time: string;
  name: string;
  email: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
