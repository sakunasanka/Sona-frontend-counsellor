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
  isAvailable?: boolean; // Add this property to indicate if this is an available slot within an unavailable day
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
  isClickable: boolean; // New property to track if the day is within the clickable window
  unavailableDetails?: UnavailableDate;
}

export interface HistoricalDate {
  date: Date;
  sessions: Session[];
  unavailableSlots: any[];
  unavailableDetails?: UnavailableDate;
}

export interface UnavailabilityRule {
  id: string;
  type: 'weekly' | 'monthly' | 'specific';
  day?: number; // 0-6 for weekly (Sunday-Saturday), 1-31 for monthly
  dates?: string[]; // ISO date strings for specific dates
  timeRange?: {
    start: string;
    end: string;
  };
  isFullDay: boolean;
}
