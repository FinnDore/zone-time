import { capitalize } from 'lodash-es';

export const formatTimezone = (timezone: string) =>
    capitalize(timezone.replace(/_/g, ' ').split('/').pop() ?? '');
