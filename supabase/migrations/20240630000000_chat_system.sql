-- Chat conversations and messages
create table chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  agent_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references chat_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function calls and results
create table chat_function_calls (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references chat_conversations(id) on delete cascade,
  function_name text not null,
  arguments jsonb not null,
  result jsonb,
  error text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Real-time subscriptions
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;
alter table chat_function_calls enable row level security;

create policy "Users can view their own conversations"
  on chat_conversations for select
  using (auth.uid() = user_id);

create policy "Users can view messages in their conversations"
  on chat_messages for select
  using (
    exists (
      select 1
      from chat_conversations
      where id = chat_messages.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can view function calls in their conversations"
  on chat_function_calls for select
  using (
    exists (
      select 1
      from chat_conversations
      where id = chat_function_calls.conversation_id
      and user_id = auth.uid()
    )
  );

-- Indexes
create index chat_conversations_user_id_idx on chat_conversations(user_id);
create index chat_messages_conversation_id_idx on chat_messages(conversation_id);
create index chat_function_calls_conversation_id_idx on chat_function_calls(conversation_id);
