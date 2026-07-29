create table if not exists public.agent_research (
  id uuid primary key default gen_random_uuid(),
  request jsonb not null,
  state jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists agent_research_created_at_idx
  on public.agent_research (created_at desc);

alter table public.agent_research enable row level security;

comment on table public.agent_research is
  'Structured research runs emitted by the Bhavya agent platform.';
