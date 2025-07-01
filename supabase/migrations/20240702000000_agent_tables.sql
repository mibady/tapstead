-- Create agent_interactions table for analytics
CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id),
  agent_type TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  latency_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT fk_conversation 
    FOREIGN KEY (conversation_id)
    REFERENCES chat_conversations(id)
    ON DELETE CASCADE
);

-- Create provider_applications table
CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL,
  service_categories TEXT[] NOT NULL,
  experience_years INTEGER NOT NULL,
  availability TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_agent_interactions_conversation ON agent_interactions(conversation_id);
CREATE INDEX idx_agent_interactions_type ON agent_interactions(agent_type);
CREATE INDEX idx_agent_interactions_tool ON agent_interactions(tool_name);
CREATE INDEX idx_provider_applications_user ON provider_applications(user_id);
CREATE INDEX idx_provider_applications_status ON provider_applications(status);

-- Add RLS policies
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY admin_all ON agent_interactions 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY admin_all ON provider_applications
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users can view their own interactions and applications
CREATE POLICY user_select ON agent_interactions 
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM chat_conversations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY user_select ON provider_applications
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert applications
CREATE POLICY user_insert ON provider_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own applications
CREATE POLICY user_update ON provider_applications
  FOR UPDATE USING (user_id = auth.uid());

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_provider_applications_updated_at
    BEFORE UPDATE ON provider_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();