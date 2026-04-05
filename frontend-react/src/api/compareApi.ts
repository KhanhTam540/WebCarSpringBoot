import { httpClient } from './httpClient';
import type { PartDetail } from '../features/catalog/types';

export type CompareResponse = {
  parts: PartDetail[];
  comparableFields: string[];
  comparisonRows: Record<string, string[]>;
};

export const compareApi = {
  compareParts: (partIds: number[]) => {
    const params = new URLSearchParams();
    partIds.forEach((partId) => params.append('partIds', String(partId)));

    return httpClient<CompareResponse>({ path: `/compare?${params.toString()}`, method: 'GET' });
  },
};
