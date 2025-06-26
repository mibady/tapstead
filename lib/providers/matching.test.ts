import {
  findAndRankProviders,
  Provider,
  BookingRequest,
  MatchingOptions,
  SkillLevel,
  ProviderMatchingError,
  ProviderMatchingErrorType,
} from './matching';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase client
const mockSupabase = {
  rpc: jest.fn(),
} as unknown as SupabaseClient;

describe('Provider Matching with findAndRankProviders', () => {
  // Sample providers for testing
  const sampleProviders: Provider[] = [
    {
      id: 'provider1',
      name: 'John Doe',
      rating: 4.5,
      completedJobs: 120,
      capabilities: [
        { serviceId: 'cleaning', skillLevel: SkillLevel.EXPERT },
        { serviceId: 'gardening', skillLevel: SkillLevel.INTERMEDIATE },
      ],
      availability: [
        {
          date: new Date('2025-06-23T00:00:00'),
          startTime: '08:00',
          endTime: '17:00',
        },
        {
          date: new Date('2025-06-24T00:00:00'),
          startTime: '09:00',
          endTime: '18:00',
        },
      ],
      maxTravelDistance: 20,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    {
      id: 'provider2',
      name: 'Jane Smith',
      rating: 5.0,
      completedJobs: 50,
      capabilities: [
        { serviceId: 'cleaning', skillLevel: SkillLevel.INTERMEDIATE },
        { serviceId: 'plumbing', skillLevel: SkillLevel.EXPERT },
      ],
      availability: [
        {
          date: new Date('2025-06-23T00:00:00'),
          startTime: '10:00',
          endTime: '19:00',
        },
      ],
      maxTravelDistance: 15,
      location: {
        latitude: 37.7833,
        longitude: -122.4167,
      },
    },
    {
      id: 'provider3',
      name: 'Bob Johnson',
      rating: 3.8,
      completedJobs: 200,
      capabilities: [
        { serviceId: 'cleaning', skillLevel: SkillLevel.BEGINNER },
        { serviceId: 'electrical', skillLevel: SkillLevel.EXPERT },
      ],
      availability: [
        {
          date: new Date('2025-06-23T00:00:00'),
          startTime: '09:00',
          endTime: '16:00',
        },
      ],
      maxTravelDistance: 30,
      location: {
        latitude: 37.8044,
        longitude: -122.2711,
      },
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    (mockSupabase.rpc as jest.Mock).mockClear();
  });

  // Test standard matching scenarios
  describe('Standard Matching Scenarios', () => {
    test('should find and rank matching providers for a valid request', async () => {
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: {
          startTime: '10:00',
          endTime: '14:00',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      // Mock the RPC call to return providers with a distance
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: sampleProviders.map(p => ({ ...p, distance_meters: 100 })),
        error: null,
      });

      const matches = await findAndRankProviders(mockSupabase, request);

      expect(matches.length).toBeGreaterThan(0);
      // Provider 2 should be first due to higher rating and availability
      expect(matches[0].provider.id).toBe('provider2');
      expect(matches[0].matchScore).toBeGreaterThan(0);
      expect(matches[0].scores).toBeDefined();
    });
  });

  // Test filtering and options
  describe('Filtering and Options', () => {
    test('should filter providers based on required skill level', async () => {
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: {
          startTime: '10:00',
          endTime: '14:00',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      const options: MatchingOptions = {
        requiredSkillLevel: SkillLevel.EXPERT,
      };

      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: sampleProviders.map(p => ({ ...p, distance_meters: 100 })),
        error: null,
      });

      const matches = await findAndRankProviders(mockSupabase, request, options);

      expect(matches.length).toBe(1);
      expect(matches[0].provider.id).toBe('provider1');
    });

    test('should return an empty array if no providers match filters', async () => {
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: { startTime: '10:00', endTime: '14:00' },
        location: { latitude: 37.7749, longitude: -122.4194 },
      };

      const options: MatchingOptions = {
        minRating: 5.1, // No provider has a rating this high
      };

      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: sampleProviders.map(p => ({ ...p, distance_meters: 100 })),
        error: null,
      });

      const matches = await findAndRankProviders(mockSupabase, request, options);
      expect(matches).toEqual([]);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should throw error for an invalid booking request schema', async () => {
      const invalidRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: {
          startTime: 'invalid-time', // Invalid time format
          endTime: '14:00',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      await expect(findAndRankProviders(mockSupabase, invalidRequest as any))
        .rejects.toThrow(
          new ProviderMatchingError('Invalid booking request.', ProviderMatchingErrorType.INVALID_INPUT)
        );
    });

    test('should throw a matching error when the RPC call fails', async () => {
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: { startTime: '10:00', endTime: '14:00' },
        location: { latitude: 37.7749, longitude: -122.4194 },
      };

      const dbError = new Error('DB connection failed');
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({ data: null, error: dbError });

      await expect(findAndRankProviders(mockSupabase, request)).rejects.toThrow(
        new ProviderMatchingError(`Database error: ${dbError.message}`, ProviderMatchingErrorType.MATCHING_ERROR)
      );
    });

    test('should throw a specific error when no providers are found in the radius', async () => {
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: { startTime: '10:00', endTime: '14:00' },
        location: { latitude: 37.7749, longitude: -122.4194 },
      };

      // Mock the RPC call to return an empty array
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({ data: [], error: null });

      await expect(findAndRankProviders(mockSupabase, request)).rejects.toThrow(
        new ProviderMatchingError('No providers found in the given radius.', ProviderMatchingErrorType.NO_PROVIDERS_AVAILABLE)
      );
    });
  });
});
