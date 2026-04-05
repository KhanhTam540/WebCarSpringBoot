import { httpClient } from './httpClient';
import type { PartSummary } from '../features/catalog/types';

export type FavoriteItem = PartSummary & {
  id: number;
  partId: number;
};

export const favoriteApi = {
  getFavorites: () => httpClient<FavoriteItem[]>({ path: '/favorites', method: 'GET' }),
  addFavorite: (partId: number) => httpClient<FavoriteItem>({ path: `/favorites/${partId}`, method: 'POST' }),
  removeFavorite: (partId: number) => httpClient<void>({ path: `/favorites/${partId}`, method: 'DELETE' }),
};
