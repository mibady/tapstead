import {
  findAndRankProviders, // The new function we are testing
  findMatchingProviders,
  Provider,
  BookingRequest,
  MatchingOptions,
  SkillLevel,
  ProviderMatchingError,
  ProviderMatchingErrorType,
} from './matching';
import { SupabaseClient } from '@supabase/supabase-js';

describe('Provider Matching', () => {
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

  // Test standard matching scenarios
  describe('Standard Matching Scenarios', () => {
    test('should find matching providers for a valid request', () => {
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

      const matches = findMatchingProviders(sampleProviders, request);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].provider.id).toBe('provider1');
      expect(matches[0].matchScore).toBeGreaterThan(0);
      expect(matches[0].scores).toBeDefined();
      expect(matches[0].scores.distance).toBeDefined();
      expect(matches[0].scores.rating).toBeDefined();
      expect(matches[0].scores.experience).toBeDefined();
      expect(matches[0].scores.skillLevel).toBeDefined();
    });

    test('should prioritize providers based on match score', () => {
      // Mock environment for testing
      jest.spyOn(process, 'env', 'get').mockImplementation(() => ({ NODE_ENV: 'test' }));
      
      const request: BookingRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: {
          startTime: '10:00',
          endTime: '14:00',
        },
        location: {
          latitude: 37.7833,
          longitude: -122.4167,
        },
      };

      const matches = findMatchingProviders(sampleProviders, request);
      
      // Provider2 should be first due to location and rating
      expect(matches[0].provider.id).toBe('provider2');
      expect(matches[0].scores).toBeDefined();
    });
  });

  // Test filtering and options
  describe('Filtering and Options', () => {
    test('should filter providers based on skill level', () => {
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

      const matches = findMatchingProviders(sampleProviders, request, options);
      
      expect(matches.length).toBe(1);
      expect(matches[0].provider.id).toBe('provider1');
    });

    test('should filter providers based on minimum rating', () => {
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
        minRating: 4.0,
      };

      const matches = findMatchingProviders(sampleProviders, request, options);
      
      expect(matches.length).toBe(2);
      expect(matches.some(m => m.provider.id === 'provider3')).toBe(false);
    });

    test('should filter providers based on max distance', () => {
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
        maxDistance: 5,
      };

      const matches = findMatchingProviders(sampleProviders, request, options);
      
      // Only providers within 5 miles should be included
      expect(matches.length).toBe(2);
      expect(matches.some(m => m.provider.id === 'provider3')).toBe(false);
    });
  });

  // Test preferred and excluded providers
  describe('Preferred and Excluded Providers', () => {
    test('should prioritize preferred providers', () => {
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
        preferredProviders: ['provider3'],
      };

      const matches = findMatchingProviders(sampleProviders, request);
      
      expect(matches[0].provider.id).toBe('provider3');
    });

    test('should exclude specified providers', () => {
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
        excludedProviders: ['provider1', 'provider2'],
      };

      const matches = findMatchingProviders(sampleProviders, request);
      
      expect(matches.length).toBe(1);
      expect(matches[0].provider.id).toBe('provider3');
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should throw error for invalid booking request', () => {
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

      expect(() => {
        // Using any to bypass type checking for testing invalid input
        findMatchingProviders(sampleProviders, invalidRequest as any);
      }).toThrow(ProviderMatchingError);
    });

    test('should throw error when no providers match', () => {
      const request: BookingRequest = {
        serviceId: 'nonexistent-service',
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

      expect(() => {
        findMatchingProviders(sampleProviders, request);
      }).toThrow(ProviderMatchingError);
    });

    test('should include error type and details in thrown error', () => {
      const invalidRequest = {
        serviceId: 'cleaning',
        date: new Date('2025-06-23T00:00:00'),
        timeSlot: {
          startTime: 'invalid-time',
          endTime: '14:00',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      try {
        findMatchingProviders(sampleProviders, invalidRequest as any);
        fail('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ProviderMatchingError);
        if (error instanceof ProviderMatchingError) {
          expect(error.type).toBe(ProviderMatchingErrorType.INVALID_INPUT);
          expect(error.details).toBeDefined();
        }
      }
    });

  // Test match score calculation
  describe('Match Score Calculation', () => {
    test('should calculate correct match scores', () => {
      // Mock environment for testing
      jest.spyOn(process, 'env', 'get').mockImplementation(() => ({ NODE_ENV: 'test' }));
      
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

      const matches = findMatchingProviders(sampleProviders, request);
      
      for (const match of matches) {
        expect(match.matchScore).toBeGreaterThanOrEqual(0);
        expect(match.matchScore).toBeLessThanOrEqual(100);
        
        expect(match.scores.distance).toBeGreaterThanOrEqual(0);
        expect(match.scores.distance).toBeLessThanOrEqual(100);
        
        expect(match.scores.rating).toBeGreaterThanOrEqual(0);
        expect(match.scores.rating).toBeLessThanOrEqual(100);
        
        expect(match.scores.experience).toBeGreaterThanOrEqual(0);
        expect(match.scores.experience).toBeLessThanOrEqual(100);
        
        expect(match.scores.skillLevel).toBeGreaterThanOrEqual(0);
        expect(match.scores.skillLevel).toBeLessThanOrEqual(100);
      }
    });

    test('should adjust scores based on prioritization options', () => {
      // Mock environment for testing
      jest.spyOn(process, 'env', 'get').mockImplementation(() => ({ NODE_ENV: 'test' }));
      
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

      // Test with prioritize rating
      const matchesWithPrioritizedRating = findMatchingProviders(
        sampleProviders,
        request,
        { prioritizeRating: true }
      );
      
      // Test with prioritize experience
      const matchesWithPrioritizedExperience = findMatchingProviders(
        sampleProviders,
        request,
        { prioritizeExperience: true }
      );
      
      // Verify different ordering based on prioritization
      expect(matchesWithPrioritizedRating[0].provider.id)
        .not.toBe(matchesWithPrioritizedExperience[0].provider.id);
    });
  });
});

// New tests for the refactored findAndRankProviders function
describe('findAndRankProviders', () => {
  const mockSupabase: Partial<SupabaseClient> = {
    rpc: jest.fn(),
  };

  const bookingRequest: BookingRequest = {
    serviceId: 'cleaning',
    date: new Date('2025-06-23T00:00:00'),
    timeSlot: { startTime: '10:00', endTime: '12:00' },
    location: { latitude: 34.0522, longitude: -118.2437 },
  };

  beforeEach(() => {
    // Reset mocks before each test
    (mockSupabase.rpc as jest.Mock).mockClear();
  });

  test('should return ranked providers when RPC call is successful', async () => {
    const mockRpcData = [
      {
        id: 'provider1',
        business_name: 'LA Cleaners',
        rating: 4.8,
        total_jobs: 150,
        latitude: 34.0522,
        longitude: -118.2437,
        distance_meters: 0,
        // Mock other necessary fields from ProviderWithDistance
        user_id: 'user1', license_number: '123', insurance_verified: true, active: true, location: '', services: [], created_at: '', updated_at: ''
      },
    ];

    (mockSupabase.rpc as jest.Mock).mockResolvedValue({ data: mockRpcData, error: null });

    const matches = await findAndRankProviders(mockSupabase as SupabaseClient, bookingRequest);

    expect(mockSupabase.rpc).toHaveBeenCalledWith('find_providers_in_radius', expect.any(Object));
    expect(matches.length).toBe(1);
    expect(matches[0].provider.id).toBe('provider1');
  });

  test('should throw ProviderMatchingError when RPC call fails', async () => {
    const rpcError = { message: 'Database connection failed', code: '500' };
    (mockSupabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: rpcError });

    await expect(findAndRankProviders(mockSupabase as SupabaseClient, bookingRequest)).rejects.toThrow(
      new ProviderMatchingError(`Database error: ${rpcError.message}`, ProviderMatchingErrorType.MATCHING_ERROR)
    );
  });

  test('should return an empty array when no providers are found', async () => {
    (mockSupabase.rpc as jest.Mock).mockResolvedValue({ data: [], error: null });

    const matches = await findAndRankProviders(mockSupabase as SupabaseClient, bookingRequest);

    expect(matches).toEqual([]);
  });
});
