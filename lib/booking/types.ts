export type FrequencyType = 'oneTime' | 'weekly' | 'biWeekly' | 'monthly'
export type BedroomType = '1-2' | '3-4' | '5+'
export type CleaningType = 'standard' | 'deep' | 'moveInOut';

export interface BookingData {
  frequency: FrequencyType;
  bedrooms: BedroomType;
  cleaningType: CleaningType;
  date: Date;
  time: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
  };
}