-- Insert sample services
INSERT INTO services (title, description, base_price, duration, category) VALUES
('House Cleaning', 'Deep cleaning, regular maintenance, move-in/out cleaning', 99.00, '2-4 hours', 'cleaning'),
('Handyman Services', 'Repairs, installations, furniture assembly, and more', 75.00, '1-3 hours', 'handyman'),
('Plumbing Services', 'Leak repairs, drain cleaning, fixture installation, emergency plumbing', 89.00, '1-3 hours', 'plumbing'),
('Junk Removal', 'Furniture, appliances, construction debris, estate cleanouts', 149.00, '1-2 hours', 'junk-removal'),
('Pressure Washing', 'Driveways, decks, siding, and exterior surfaces', 199.00, '2-4 hours', 'cleaning'),
('Gutter Services', 'Gutter cleaning, repairs, installation, and downspout maintenance', 159.00, '2-4 hours', 'exterior'),
('Electrical Services', 'Outlet installation, lighting, ceiling fans, smart home setup', 125.00, '1-3 hours', 'electrical'),
('Interior Painting', 'Room painting, touch-ups, color consultation', 299.00, '4-8 hours', 'painting'),
('Welding Services', 'Metal fabrication, repairs, custom welding projects, structural work', 95.00, '1-4 hours', 'welding');

-- Add disaster/emergency services
INSERT INTO services (title, description, base_price, duration, category) VALUES
('Fire Debris Removal', 'Emergency fire damage cleanup, ash removal, structural debris disposal', 299.00, '4-8 hours', 'disaster'),
('Storm Damage Cleanup', 'Emergency cleanup after storms, hurricanes, and natural disasters', 249.00, '3-6 hours', 'disaster'),
('Emergency Disaster Cleanup', 'Rapid response for all types of disaster debris and emergency cleanup', 199.00, '2-6 hours', 'disaster');

-- Insert sample providers
INSERT INTO providers (user_id, business_name, license_number, insurance_verified, rating, total_jobs, location, services) VALUES
(gen_random_uuid(), 'Clean Pro Services', 'LIC-001', true, 4.9, 150, 'Austin, TX', ARRAY['house-cleaning', 'pressure-washing']),
(gen_random_uuid(), 'Fix It Fast', 'LIC-002', true, 4.8, 200, 'Austin, TX', ARRAY['handyman', 'electrical']),
(gen_random_uuid(), 'Haul Away Heroes', 'LIC-003', true, 4.7, 100, 'Austin, TX', ARRAY['junk-removal']),
(gen_random_uuid(), 'Paint Perfect', 'LIC-004', true, 4.9, 75, 'Austin, TX', ARRAY['painting']),
(gen_random_uuid(), 'Elite Welding Solutions', 'AWS-001', true, 4.9, 85, 'Austin, TX', ARRAY['welding', 'handyman']),
(gen_random_uuid(), 'Pro Plumbing Solutions', 'PLB-001', true, 4.8, 120, 'Austin, TX', ARRAY['plumbing']),
(gen_random_uuid(), 'Gutter Guard Pros', 'GUT-001', true, 4.8, 95, 'Austin, TX', ARRAY['gutter-services', 'pressure-washing']);

-- Add disaster response providers
INSERT INTO providers (user_id, business_name, license_number, insurance_verified, rating, total_jobs, location, services) VALUES
(gen_random_uuid(), 'Rapid Fire Recovery', 'HAZMAT-001', true, 4.8, 45, 'Austin, TX', ARRAY['fire-debris-removal', 'storm-damage-cleanup']),
(gen_random_uuid(), 'Emergency Response Team', 'FEMA-001', true, 4.9, 65, 'Austin, TX', ARRAY['emergency-disaster-cleanup', 'fire-debris-removal']),
(gen_random_uuid(), 'Storm Shield Services', 'IICRC-001', true, 4.7, 35, 'Austin, TX', ARRAY['storm-damage-cleanup', 'emergency-disaster-cleanup']);
