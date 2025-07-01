-- Create rate limits table
create table if not exists rate_limits (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  count integer not null default 0,
  reset_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index if not exists rate_limits_key_idx on rate_limits(key);
create index if not exists rate_limits_reset_at_idx on rate_limits(reset_at);

-- Add RLS policies
alter table rate_limits enable row level security;

-- Everyone can read their own rate limits
create policy "Read own rate limits"
  on rate_limits for select
  using (key like 'rate_limit:chat:%');

-- System can manage all rate limits
create policy "System can manage rate limits"
  on rate_limits for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_rate_limits_updated_at
  before update on rate_limits
  for each row
  execute function update_updated_at_column();