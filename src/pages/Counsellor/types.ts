import { Language } from './constants';

export interface CounsellorProfile {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  joinDate: string;
  specializations: string[];
  languages: Language[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  totalClients: number;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
  credentials: Credential[];
  achievements: Achievement[];
}

export interface Credential {
  id: number;
  title: string;
  institution: string;
  year: number;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt?: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt?: string;
}

export interface StatusConfig {
  color: string;
  text: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
}
