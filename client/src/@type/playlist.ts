export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: 'public' | 'private';
}
