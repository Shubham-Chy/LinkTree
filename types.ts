
export interface Link {
  label: string;
  url: string;
  icon?: string;
}

export interface Track {
  title: string;
  artist: string;
  src: string;
}

export interface SiteConfig {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  links: Link[];
  playlist: Track[];
}
