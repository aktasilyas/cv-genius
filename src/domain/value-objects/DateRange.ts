import { z } from 'zod';

export const DateRangeSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  current: z.boolean(),
}).refine((data) => {
  if (data.current) return true;
  if (!data.endDate) return false;
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'End date must be after start date',
});

export type DateRange = z.infer<typeof DateRangeSchema>;

export const createDateRange = (startDate: string, endDate: string, current: boolean): DateRange => {
  return DateRangeSchema.parse({ startDate, endDate, current });
};

export const formatDateRange = (dateRange: DateRange): string => {
  const start = dateRange.startDate;
  const end = dateRange.current ? 'Present' : dateRange.endDate;
  return `${start} - ${end}`;
};
