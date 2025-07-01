export interface PriceDetails {
  base: number;
  addOns: number;
  total: number;
  productId: string;
}

interface FrequencyPricing {
  '1-2': { price: number; productId: string };
  '3-4': { price: number; productId: string };
  '5+': { price: number; productId: string };
}

const PRICING = {
  oneTime: {
    '1-2': { price: 149, productId: 'prod_Sb12PLJ0A1LqCG' },
    '3-4': { price: 199, productId: 'prod_Sb13pjCHAoKvfH' },
    '5+': { price: 299, productId: 'prod_Sb14WX6Z00Lm03' }
  },
  weekly: {
    '1-2': { price: 99, productId: 'prod_Sb17TbF8GPiVup' },
    '3-4': { price: 149, productId: 'prod_Sb18qm2WYFPL54' },
    '5+': { price: 199, productId: 'prod_Sb19b4GQXy8ida' }
  },
  biWeekly: {
    '1-2': { price: 109, productId: 'prod_Sb1BUZ29cgzC7M' },
    '3-4': { price: 159, productId: 'prod_Sb1DsWl4LphBiK' },
    '5+': { price: 219, productId: 'prod_Sb1EWMyr1guvit' }
  },
  monthly: {
    '1-2': { price: 119, productId: 'prod_Sb1FkY1IlJNdUq' },
    '3-4': { price: 169, productId: 'prod_Sb1F7kMgxpCxkP' },
    '5+': { price: 239, productId: 'prod_Sb1GKzVhdUvnjt' }
  }
} as const;

const ADD_ONS = {
  deepClean: { price: 75, productId: 'prod_Sb1JGVxMBfKm81' },
  moveInOut: { price: 99, productId: 'prod_Sb1MrGld1Aytkk' }
} as const;

export type FrequencyType = keyof typeof PRICING;
export type BedroomType = keyof typeof PRICING.oneTime;
export type AddOnType = keyof typeof ADD_ONS;

export interface BookingDetails {
  frequency: FrequencyType;
  bedrooms: BedroomType;
  addOns: AddOnType[];
}

export function calculatePrice(details: BookingDetails): PriceDetails {
  const basePrice = PRICING[details.frequency][details.bedrooms];
  const addOnTotal = details.addOns.reduce((sum, addOn) => sum + ADD_ONS[addOn].price, 0);

  return {
    base: basePrice.price,
    addOns: addOnTotal,
    total: basePrice.price + addOnTotal,
    productId: basePrice.productId
  };
}

export function getAddOnProducts(addOns: AddOnType[]) {
  return addOns.map(addOn => ({
    productId: ADD_ONS[addOn].productId,
    price: ADD_ONS[addOn].price
  }));
}

export function getFrequencyLabel(frequency: FrequencyType) {
  switch (frequency) {
    case 'oneTime': return 'One-Time Service';
    case 'weekly': return 'Weekly Service (Save 33%)';
    case 'biWeekly': return 'Bi-Weekly Service (Save 27%)';
    case 'monthly': return 'Monthly Service (Save 20%)';
  }
}

export function getBedroomLabel(bedrooms: BedroomType) {
  switch (bedrooms) {
    case '1-2': return '1-2 Bedrooms (2-3 hrs)';
    case '3-4': return '3-4 Bedrooms (3-4 hrs)';
    case '5+': return '5+ Bedrooms (4-5 hrs)';
  }
}

export const PRICING_DETAILS = {
  frequencies: PRICING,
  addOns: ADD_ONS
};