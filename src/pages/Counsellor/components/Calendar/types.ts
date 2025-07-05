export interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
  client?: {
    name: string;
    duration: number;
  };
}

export interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface UnavailableDate {
  id: string;
  date: string;
  reason?: string;
  isFullDay: boolean;
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface CalendarDay {
  date: Date;
  sessions: Session[];
  unavailableSlots: any[];
  isToday: boolean;
  isPastDay: boolean;
  isUnavailable: boolean;
  unavailableDetails?: UnavailableDate;
}

export interface HistoricalDate {
  date: Date;
  sessions: Session[];
  unavailableSlots: any[];
  unavailableDetails?: UnavailableDate;
}
