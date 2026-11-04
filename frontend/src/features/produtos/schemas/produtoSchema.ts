import { z } from 'zod';

const precoRegex = /^\d+([.,]\d{1,2})?$/;

export const produtoSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome').max(150, 'Máximo de 150 caracteres'),
  preco: z.string().trim().min(1, 'Informe o preço').regex(precoRegex, 'Preço inválido (ex: 19.90)'),
  preco_promocional: z
    .string()
    .trim()
    .regex(precoRegex, 'Preço inválido (ex: 19.90)')
    .or(z.literal(''))
    .optional(),
  descricao: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
  ingredientes: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
  alergenicos: z.string().max(255, 'Máximo de 255 caracteres').optional(),
  porcao: z.string().regex(/^\d+$/, 'Use apenas números inteiros').or(z.literal('')).optional(),
  disponivel: z.boolean(),
  promocao_fim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD')
    .or(z.literal(''))
    .optional(),
  categoria: z.string().max(80, 'Máximo de 80 caracteres').optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;