export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: 'public' | 'private';
}

export interface History {
  date: string;
  audios: {
    id: string;
    date: Date;
    audioId: string;
    title: string;
  }[];
}
