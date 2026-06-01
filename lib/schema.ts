import { z } from "zod";

export const budgetSchema = z.object({
  client: z.object({
    name: z.string().min(2, `Minimo de 2 caracteres`),
    address: z.string().min(2, `Minimo de 2 caracteres`),
    tel: z.string().min(2, `Minimo de 2 caracteres`),
  }),
  items: z.array(
    z.object({
      productName: z.string().min(2, `Minimo de 2 caracteres`),
      productValue: z.number().positive("O valor deve ser maior do que zero"),
      productCategory: z.array(z.string()),
      productQuantity: z.number().positive(`O valor deve ser maior do que zero`)
    }),
  ),
});

export type BudgetData = z.infer<typeof budgetSchema>;
