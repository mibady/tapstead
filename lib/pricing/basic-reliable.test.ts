import {
  calculatePrice,
  HomeSize,
  TimeSlot,
  PricingError,
  PricingErrorType,
  PricingConfig,
  ServiceAddon
} from './basic-reliable';

describe('Pricing Calculation', () => {
  // Test standard pricing scenarios
  describe('Standard Pricing Scenarios', () => {
    test('should calculate correct price for small home with standard time slot', () => {
      const result = calculatePrice({
        homeSize: HomeSize.SMALL,
        timeSlot: TimeSlot.STANDARD,
      });

      expect(result.basePrice).toBe(100);
      expect(result.addonPrice).toBe(0);
      expect(result.timeSlotAdjustment).toBe(0);
      expect(result.totalPrice).toBe(100);
    });

    test('should calculate correct price for medium home with peak time slot', () => {
      const result = calculatePrice({
        homeSize: HomeSize.MEDIUM,
        timeSlot: TimeSlot.PEAK,
      });

      expect(result.basePrice).toBe(150);
      expect(result.addonPrice).toBe(0);
      expect(result.timeSlotAdjustment).toBe(37.5); // 150 * 0.25
      expect(result.totalPrice).toBe(187.5);
    });

    test('should calculate correct price for large home with off-peak time slot', () => {
      const result = calculatePrice({
        homeSize: HomeSize.LARGE,
        timeSlot: TimeSlot.OFF_PEAK,
      });

      expect(result.basePrice).toBe(200);
      expect(result.addonPrice).toBe(0);
      expect(result.timeSlotAdjustment).toBe(-30); // 200 * -0.15
      expect(result.totalPrice).toBe(170);
    });
  });

  // Test add-ons
  describe('Add-ons', () => {
    test('should correctly add prices for addons', () => {
      const addons: ServiceAddon[] = [
        { id: 'addon1', name: 'Deep Clean', price: 50 },
        { id: 'addon2', name: 'Window Cleaning', price: 30 },
      ];

      const result = calculatePrice({
        homeSize: HomeSize.SMALL,
        timeSlot: TimeSlot.STANDARD,
        addons,
      });

      expect(result.basePrice).toBe(100);
      expect(result.addonPrice).toBe(80);
      expect(result.timeSlotAdjustment).toBe(0);
      expect(result.totalPrice).toBe(180);
      expect(result.breakdown.addons).toHaveLength(2);
      expect(result.breakdown.addons[0].price).toBe(50);
      expect(result.breakdown.addons[1].price).toBe(30);
    });
  });

  // Test custom pricing configuration
  describe('Custom Pricing Configuration', () => {
    test('should use custom pricing configuration when provided', () => {
      const customConfig: PricingConfig = {
        basePricing: {
          [HomeSize.SMALL]: 120,
          [HomeSize.MEDIUM]: 180,
          [HomeSize.LARGE]: 240,
          [HomeSize.XLARGE]: 360,
        },
        timeSlotMultipliers: {
          [TimeSlot.STANDARD]: 1.0,
          [TimeSlot.PEAK]: 1.3,
          [TimeSlot.OFF_PEAK]: 0.8,
        },
      };

      const result = calculatePrice({
        homeSize: HomeSize.SMALL,
        timeSlot: TimeSlot.PEAK,
      }, customConfig);

      expect(result.basePrice).toBe(120);
      expect(result.timeSlotAdjustment).toBe(36); // 120 * 0.3
      expect(result.totalPrice).toBe(156);
    });
  });

  // Test input validation
  describe('Input Validation', () => {
    test('should throw error for invalid home size', () => {
      expect(() => {
        calculatePrice({
          // @ts-expect-error Testing invalid input
          homeSize: 'INVALID_SIZE',
          timeSlot: TimeSlot.STANDARD,
        });
      }).toThrow(PricingError);
    });

    test('should throw error for invalid time slot', () => {
      expect(() => {
        calculatePrice({
          homeSize: HomeSize.SMALL,
          // @ts-expect-error Testing invalid input
          timeSlot: 'INVALID_SLOT',
        });
      }).toThrow(PricingError);
    });

    test('should throw error for negative addon price', () => {
      const addons: ServiceAddon[] = [
        { id: 'addon1', name: 'Deep Clean', price: -50 },
      ];

      expect(() => {
        calculatePrice({
          homeSize: HomeSize.SMALL,
          timeSlot: TimeSlot.STANDARD,
          // @ts-expect-error Testing invalid input
          addons,
        });
      }).toThrow(PricingError);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should include error type and details in thrown error', () => {
      try {
        calculatePrice({
          // @ts-expect-error Testing invalid input
          homeSize: 'INVALID_SIZE',
          timeSlot: TimeSlot.STANDARD,
        });
        fail('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PricingError);
        if (error instanceof PricingError) {
          expect(error.type).toBe(PricingErrorType.INVALID_INPUT);
          expect(error.details).toBeDefined();
        }
      }
    });

    test('should handle and wrap unknown errors', () => {
      // Create a broken config to simulate unexpected errors
      const brokenConfig = {
        basePricing: {},
        timeSlotMultipliers: {},
      } as unknown as PricingConfig;

      try {
        calculatePrice({
          homeSize: HomeSize.SMALL,
          timeSlot: TimeSlot.STANDARD,
        }, brokenConfig);
        fail('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PricingError);
        if (error instanceof PricingError) {
          expect(error.type).toBe(PricingErrorType.INVALID_INPUT);
          expect(error.details).toBeDefined();
        }
      }
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    test('should handle extra large homes correctly', () => {
      const result = calculatePrice({
        homeSize: HomeSize.XLARGE,
        timeSlot: TimeSlot.STANDARD,
      });

      expect(result.basePrice).toBe(300);
      expect(result.totalPrice).toBe(300);
    });

    test('should handle empty addons array', () => {
      const result = calculatePrice({
        homeSize: HomeSize.SMALL,
        timeSlot: TimeSlot.STANDARD,
        addons: [],
      });

      expect(result.addonPrice).toBe(0);
      expect(result.breakdown.addons).toHaveLength(0);
    });
  });

  // Test price breakdown
  describe('Price Breakdown', () => {
    test('should provide detailed breakdown of pricing components', () => {
      const addons: ServiceAddon[] = [
        { id: 'addon1', name: 'Deep Clean', price: 50 },
      ];

      const result = calculatePrice({
        homeSize: HomeSize.MEDIUM,
        timeSlot: TimeSlot.PEAK,
        addons,
      });

      expect(result.breakdown).toEqual({
        basePriceDetails: {
          homeSize: HomeSize.MEDIUM,
          price: 150,
        },
        addons: [
          { id: 'addon1', name: 'Deep Clean', price: 50 },
        ],
        timeSlotDetails: {
          timeSlot: TimeSlot.PEAK,
          multiplier: 1.25,
          adjustment: 50, // (150 + 50) * 0.25
        },
      });
    });
  });
});
