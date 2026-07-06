// Host Tools API types

export interface User {
  userID: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface NearbyAmenity {
  type: 'Airport' | 'Ferry' | 'Shopping' | 'Railway' | 'Beach';
  distance: number; // meters
}

export interface BedroomBed {
  type: string;
  count: number;
}

export interface Bedroom {
  beds: BedroomBed[];
}

export interface Policy {
  internetPolicy?: {
    accessInternet?: boolean;
    kindOfInternet?: string;
    availableInternet?: string;
    chargeInternet?: boolean;
  };
  parkingPolicy?: {
    accessParking?: boolean;
    locatedParking?: string;
    privateParking?: boolean;
    chargeParking?: boolean;
    timeCostParking?: string;
    necessaryReservationParking?: boolean;
  };
  petPolicy?: {
    allowedPets?: boolean;
    chargePets?: boolean;
  };
  childrenAllowed?: boolean;
  smokingAllowed?: boolean;
}

export interface Channel {
  id?: string;
}

export interface DirectChannel {
  id: string;
  url: string;
}

export interface Listing {
  _id: string;
  userID: string;
  name: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  zipcode?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  space?: number;
  spaceUnit?: 'SQ_M' | 'SQ_FT';
  maxGuests?: number;
  minNights?: number;
  basePrice?: number;
  minPrice?: number | null;
  checkInTime?: number;
  checkOutTime?: number;
  thumbnailUrl?: string;
  images?: string[];
  propertyType?: string;
  notes?: Record<string, string>;
  neighborhoodOverview?: Record<string, string>;
  about?: Record<string, string>;
  keyCollection?: {
    type?: string;
    checkInMethod?: string;
    additionalInfo?: Record<string, string>;
  };
  policy?: Policy;
  attributesWithQuantity?: Array<{ name: string; quantity?: number }>;
  nearbyAmenities?: NearbyAmenity[];
  bedroomConfiguration?: Bedroom[];
  channels?: {
    Airbnb?: Channel;
    Booking?: Channel;
    VRBO?: Channel;
    Houfy?: Channel;
    ChannelConnector?: Channel;
    direct?: DirectChannel[];
  };
  messagingEnabled?: boolean;
  syncAvailability?: boolean;
  syncPricing?: boolean;
  weeklyDiscount?: number | null;
  monthlyDiscount?: number | null;
  nonRefundableDiscount?: number | null;
  priceSource?: 'Amount' | 'VRBO' | 'Houfy' | 'API' | 'Listing';
  priceSourceListingID?: string | null;
  bookingWindow?: number;
  linkedRoomID?: string | null;
  calendars?: Array<{ iCalURL: string }>;
  upsellURL?: string | null;
}

export interface CalendarDayPrice {
  price?: number;
  minNights?: number;
  blockCheckin?: boolean;
  blockCheckout?: boolean;
}

export interface CalendarDay {
  Airbnb?: CalendarDayPrice;
  VRBO?: CalendarDayPrice;
  Booking?: CalendarDayPrice;
  Houfy?: CalendarDayPrice;
  other?: CalendarDayPrice;
}

export interface Calendar {
  userID: string;
  listingID: string;
  currency: string;
  prices: Record<string, CalendarDay>; // date -> platforms
}

export interface GuestCounts {
  adults: number;
  children?: number;
  infants?: number;
  pets?: number;
}

export interface Rate {
  amount: number;
  name: string;
  paidToHost?: boolean;
  paidBy?: string;
  type?: 'price' | 'fee' | 'tax' | 'deposit';
}

export interface Post {
  _id: string;
  message: string;
  isGuest: boolean;
  sentTimestamp?: string;
  attachments?: string[];
}

export interface Reservation {
  _id: string;
  userID: string;
  listingID?: string;
  startDate?: string;
  endDate?: string;
  confirmationDate?: string;
  inquiryDate?: string;
  pendingDate?: string;
  cancelledDate?: string;
  status: 'accepted' | 'pending' | 'cancelled' | 'inquiry';
  nights?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  source?: string;
  confirmationCode?: string;
  guests?: GuestCounts;
  hostPayout?: number;
  guestPrice?: number;
  currency?: string;
  checkInTime?: number;
  checkOutTime?: number;
  lockCode?: string;
  notes?: string;
  guideBookURL?: string | null;
  verificationURL?: string | null;
  verificationStatus?: string | null;
  incidentURL?: string | null;
  rates?: Rate[];
  posts?: Post[];
}

export interface Review {
  channel: string;
  rating: number;
  confirmationCode: string;
  comments: string;
  createdAt: string;
}

export interface PricingQuoteLineItem {
  label: string;
  amount: number;
  type: 'price' | 'fee' | 'tax' | 'deposit';
}

export interface PricingQuote {
  listingID: string;
  currency: string;
  reservation: {
    startDate: string;
    endDate: string;
    nights: number;
    guests: GuestCounts;
  };
  basePrice: number;
  total: number;
  lineItems: PricingQuoteLineItem[];
}

export interface ListingGroup {
  _id: string;
  name: string;
  ownerImportLink: string | null;
}

export interface PriceEntry {
  date: string;
  price?: number;
  minNights?: number;
  blockCheckin?: boolean;
  blockCheckout?: boolean;
}

export interface ApiError {
  message: string;
}
