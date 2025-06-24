-- Add estimated_duration to bookings table

ALTER TABLE public.bookings
ADD COLUMN estimated_duration FLOAT;

COMMENT ON COLUMN public.bookings.estimated_duration IS 'Estimated duration of the service in hours, used for provider scheduling.';

-- Note: You may want to backfill this column for existing bookings.
-- For example, you could set a default based on the service type.
