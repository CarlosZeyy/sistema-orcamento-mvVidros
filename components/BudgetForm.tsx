"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/lib/schema";

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function BudgetForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: BudgetFormData) => {
    console.log("Dados válidos: ", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nome:</label>
        <input {...register("client.name")} />
        {errors.client?.name?.message && (
          <p style={{ color: "red" }}>{errors.client?.name?.message}</p>
        )}
      </div>

      <div>
        <label>Endereço:</label>
        <input {...register("client.address")} />
        {errors.client?.address?.message && (
          <p style={{ color: "red" }}>{errors.client?.address?.message}</p>
        )}
      </div>

      <div>
        <label>Telefone:</label>
        <input type="tel" {...register("client.tel")} />
        {errors.client?.tel?.message && (
          <p style={{ color: "red" }}>{errors.client?.tel?.message}</p>
        )}
      </div>

      {fields.map((field, index) => (
        <div key={field.id}>
          <div>
            <input
              {...register(`items.${index}.productName` as const)}
              placeholder="Nome do item"
            />
            <input
              {...register(`items.${index}.productValue` as const, {
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Valor do item"
            />
            <input
              {...register(`items.${index}.productQuantity` as const, {
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Quantidade de item"
            />
            {errors.items?.[index]?.productName && (
              <p className="red m-0">
                {errors.items[index].productName?.message}
              </p>
            )}
            {errors.items?.[index]?.productValue && (
              <p className="red m-0">
                {errors.items[index].productValue?.message}
              </p>
            )}
            {errors.items?.[index]?.productQuantity && (
              <p className="red m-0">
                {errors.items[index].productQuantity?.message}
              </p>
            )}
          </div>
          {
            <button type="button" onClick={() => remove(index)}>
              Remover
            </button>
          }
        </div>
      ))}

      {
        <button
          type="button"
          onClick={() =>
            append({
              productName: "",
              productValue: 0,
              productQuantity: 1,
              productCategory: [],
            })
          }
        >
          Adicionar item
        </button>
      }
      <button type="submit">Enviar</button>
    </form>
  );
}
