import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe o nome')
    .max(150, 'Máximo de 150 caracteres'),
  preco: z
    .string()
    .trim()
    .min(1, 'Informe o preço')
    .refine((v) => /^\d+([.,]\d{1,2})?$/.test(v), 'Preço inválido (ex: 19.90)'),
  descricao: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
  quantidade_estoque: z
    .string()
    .refine((v) => v === '' || /^\d+$/.test(v), 'Use apenas números inteiros')
    .optional(),
  data_validade: z
    .string()
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use o formato AAAA-MM-DD')
    .optional(),
  categoria: z.string().max(80, 'Máximo de 80 caracteres').optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;