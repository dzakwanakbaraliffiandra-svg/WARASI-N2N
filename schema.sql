create table if not exists aspirasi (
  id           text        primary key,
  judul        text        not null,
  deskripsi    text        not null,
  nama         text        not null default '',
  kategori     text        not null default 'kritik',
  dukungan     integer     not null default 1,
  target       integer     not null default 50,
  komentar     integer     not null default 0,
  rekomendasi  boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists aspirasi_created_at_idx on aspirasi (created_at desc);
create index if not exists aspirasi_kategori_idx   on aspirasi (kategori);
