import { z } from 'zod';

export const CertificateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certificate name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type Certificate = z.infer<typeof CertificateSchema>;

export const createCertificate = (data: Partial<Certificate>): Certificate => {
  return CertificateSchema.parse({
    id: data.id ?? crypto.randomUUID(),
    name: data.name ?? '',
    issuer: data.issuer ?? '',
    date: data.date ?? '',
    url: data.url ?? '',
  });
};

export const validateCertificate = (data: unknown): data is Certificate => {
  return CertificateSchema.safeParse(data).success;
};

export const updateCertificate = (certificate: Certificate, updates: Partial<Certificate>): Certificate => {
  return CertificateSchema.parse({
    ...certificate,
    ...updates,
  });
};
