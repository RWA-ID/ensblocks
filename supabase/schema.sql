create extension if not exists "uuid-ossp";

create table projects (
  id               uuid primary key default uuid_generate_v4(),
  ens_domain       text not null unique,
  name             text not null,
  tagline          text not null,
  category         text not null,
  short_desc       text not null,
  long_desc        text not null,
  founder_name     text not null,
  wallet_address   text not null,
  contact_email    text,
  contact_telegram text,
  contact_twitter  text,
  contact_discord  text,
  github_url       text,
  demo_url         text,
  ipfs_pitch_deck  text,
  ipfs_images      text[],
  seeking_funding  boolean default false,
  donation_total   numeric default 0,
  submitter_address text not null,
  verified_ens_owner boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table projects enable row level security;
create policy "Public read" on projects for select using (true);
create policy "Submitter insert" on projects for insert
  with check (auth.uid()::text = submitter_address);

create table donations (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid references projects(id),
  tx_hash      text unique not null,
  from_address text not null,
  to_address   text not null,
  amount_eth   numeric not null,
  block_number bigint not null,
  created_at   timestamptz default now()
);

create index on donations(project_id);
create index on donations(to_address);

-- RPC: recompute donation_total for a wallet after indexing
create or replace function refresh_donation_total(p_wallet text)
returns void language sql as $$
  update projects
  set donation_total = (
    select coalesce(sum(amount_eth), 0)
    from donations
    where to_address = p_wallet
  ),
  updated_at = now()
  where wallet_address = p_wallet;
$$;

create table sponsor_inquiries (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  company      text not null,
  email        text not null,
  tier         text not null,
  message      text,
  created_at   timestamptz default now()
);
