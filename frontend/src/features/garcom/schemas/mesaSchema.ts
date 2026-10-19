import { z } from 'zod';

export const mesaSchema = z.object({
  numero: z
    .string()
    .trim()
    .min(1, 'Informe o número da mesa')
    .regex(/^\d+$/, 'Use apenas números inteiros')
    .refine((valor) => Number(valor) >= 1, 'O número deve ser maior que zero')
    .refine((valor) => Number(valor) <= 999, 'O número deve ser no máximo 999'),
  capacidade: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Use apenas números inteiros')
    .or(z.literal(''))
    .optional(),
  ativa: z.boolean(),
});

export type MesaFormData = z.infer<typeof mesaSchema>;
