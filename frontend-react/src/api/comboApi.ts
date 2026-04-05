import { httpClient } from './httpClient';
import type { ComboSummary } from '../features/catalog/types';

export const comboApi = {
  getCombosByPart: (partId: number) => httpClient<ComboSummary[]>({ path: `/combos/by-part/${partId}`, method: 'GET' }),
  getActiveCombos: () => httpClient<ComboSummary[]>({ path: '/combos', method: 'GET' }),
};
