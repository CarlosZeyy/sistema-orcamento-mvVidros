"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/lib/schema";

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function BudgetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  });

  const onSubmit = (data: BudgetFormData) => {
    console.log("Dados válidos: ", data);
  }

   return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nome:</label>
        <input {...register("client.name")} />
        {errors.client?.name?.message && <p style={{ color: 'red' }}>{errors.client?.name?.message}</p>}
      </div>

      <div>
        <label>Endereço:</label>
        <input {...register("client.address")} />
        {errors.client?.address?.message && <p style={{ color: 'red' }}>{errors.client?.address?.message}</p>}
      </div>

      <div>
        <label>Telefone:</label>
        <input type="tel" {...register("client.tel")} />
        {errors.client?.tel?.message && <p style={{ color: 'red' }}>{errors.client?.tel?.message}</p>}
      </div>

      <button type="submit">Enviar</button>
    </form>
  ); 
}
