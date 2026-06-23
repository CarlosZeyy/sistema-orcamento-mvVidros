"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/lib/schema";
import { useState } from "react";
import { ReactFormState } from "react-dom/client";

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

  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<BudgetFormData | null>(null);

  const onSubmit = (data: BudgetFormData) => {
    setFormData(data);
    setIsPreview(true);
  };

  const onError = (errors: any) => {
    console.log("O formulário foi bloqueado! Veja os erros:", errors);
  };

  function formatTel(telNumber: string): string {
    const numbers = telNumber.replace(/\D/g, "");

    // Formata para 11 dígitos (Celular): (11) 99999-9999
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    // Formata para 9 dígitos (Celular): 99999-9999
    if (numbers.length === 9) {
      return numbers.replace(/(\d{5})(\d{4})/, "$1-$2");
    }

    // Formata para 8 dígitos (Fixo): 9999-9999
    if (numbers.length === 8) {
      return numbers.replace(/(\d{4})(\d{4})/, "$1-$2");
    }

    // Retorna o valor original se não tiver 8 ou 9 dígitos
    return telNumber;
  }

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch(`/api/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.blob();

      const browser = URL.createObjectURL(result);

      window.open(browser);

      console.log("Dados enviados com sucesso!", result);
    } catch (error) {
      console.error("Erro ao enviar dados: ", error);
    }
  };

  {
    if (isPreview === true && formData) {
      const currentDate = new Date().toLocaleDateString("pt-BR");

      const totalValue = formData.items.reduce((acc, item) => {
        return acc + item.productQuantity * item.productValue;
      }, 0);

      return (
        <div className="flex justify-center w-full">
          <div className="w-full max-w-4xl bg-white shadow-2xl p-4 sm:p-8 md:p-12">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <h2 className="text-gray-950 font-semibold text-4xl md:text-6xl p-2 md:p-5">
                <span className="text-5xl md:text-7xl font-extrabold">MV</span>{" "}
                Vidros
              </h2>
              <div className="text-gray-800 text-sm md:text-2xl font-medium flex-1 text-center md:text-right">
                <p>
                  Colocação de Vidros Temperados, Comum, Jateado, Box, Tampos e
                  Vidros Coloridos
                </p>
                <p>Fechamento de Áreas</p>
              </div>
            </div>

            {/* Contato */}
            <div className="text-gray-950 font-semibold text-sm md:text-3xl flex flex-col md:flex-row mt-4 md:mt-6 justify-between items-center gap-2">
              <p>11 97058-2051</p>
              <p>mvvidrosmv@hotmail.com</p>
            </div>

            {/* Borda */}
            <div className="border-b border-gray-300 my-6"></div>

            {/* Orcamento */}
            <div className="text-gray-950 flex justify-center font-semibold text-2xl md:text-4xl mt-2 text-center">
              <h3>ORÇAMENTO COMERCIAL</h3>
            </div>

            {/* Dados do cliente */}
            <div className="text-gray-950 my-6 text-base md:text-2xl flex flex-col gap-2 p-4 rounded-lg">
              <p>
                <span className="font-semibold">Data:</span> {currentDate}
              </p>
              <p>
                <span className="font-semibold">Nome:</span>{" "}
                {formData.client.name}
              </p>
              <p>
                <span className="font-semibold">Endereço:</span>{" "}
                {formData.client.address}
              </p>
              <p>
                <span className="font-semibold">Cel:</span>{" "}
                {formatTel(formData.client.tel)}
              </p>
            </div>

            {/* Tabela com Scroll Responsivo */}
            <div className="overflow-x-auto w-full mt-8">
              <table className="w-full text-left border-collapse min-w-150">
                <thead className="text-gray-900 border-b-2 border-gray-300">
                  <tr>
                    <th className="pb-3 px-2 font-semibold">Qtd</th>

                    <th className="pb-3 px-2 font-semibold">
                      Categoria do Produto
                    </th>

                    <th className="pb-3 px-2 font-semibold">
                      Descrição do Produto
                    </th>

                    <th className="pb-3 px-2 font-semibold">Preço Unit.</th>

                    <th className="pb-3 px-2 font-semibold">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 text-gray-800 hover:bg-gray-50"
                    >
                      <td className="py-4 px-2">{item.productQuantity}</td>

                      <td className="py-4 px-2">{item.productCategory}</td>

                      <td className="py-4 px-2 font-medium">
                        {item.productName}
                      </td>

                      <td className="py-4 px-2">
                        R$ {item.productValue.toFixed(2)}
                      </td>

                      <td className="py-4 px-2">
                        R${" "}
                        {(item.productQuantity * item.productValue).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="text-gray-900 border-t-2 border-gray-300">
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 px-2 font-bold text-right text-lg md:text-xl"
                    >
                      Valor Total:
                    </td>
                    <td className="py-4 px-2 font-bold text-lg md:text-xl text-blue-600">
                      R$ {totalValue.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Botão de Voltar */}
            <div className="mt-10 flex justify-center md:justify-between">
              <button
                onClick={() => setIsPreview(false)}
                className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full md:w-auto"
              >
                Voltar e editar
              </button>

              <button
                onClick={() => {
                  handleGeneratePDF();
                }}
                className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full md:w-auto"
              >
                Gerar PDF e enviar
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-8 w-full"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Novo Orçamento</h1>

      {/* SEÇÃO DO CLIENTE */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Dados do cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo: Nome */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Nome:</label>
            <input
              {...register("client.name")}
              placeholder="Nome do cliente"
              className="px-3 py-2 w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.client?.name?.message && (
              <p className="text-xs text-red-500">
                {errors.client?.name?.message}
              </p>
            )}
          </div>

          {/* Campo: Endereço */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">
              Endereço:
            </label>
            <input
              {...register("client.address")}
              placeholder="Endereço do cliente"
              className="px-3 py-2 w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.client?.address?.message && (
              <p className="text-xs text-red-500">
                {errors.client?.address?.message}
              </p>
            )}
          </div>

          {/* Campo: Telefone */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">
              Telefone:
            </label>
            <input
              type="tel"
              {...register("client.tel")}
              placeholder="Telefone do cliente"
              className="px-3 py-2 w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.client?.tel?.message && (
              <p className="text-xs text-red-500">
                {errors.client?.tel?.message}
              </p>
            )}
          </div>

          {/* Campo: Email */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Email:</label>
            <input
              type="tel"
              {...register("client.email")}
              placeholder="Email do cliente (Opcional)"
              className="px-3 py-2 w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.client?.email?.message && (
              <p className="text-xs text-red-500">
                {errors.client?.email?.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO DOS ITENS DO ORÇAMENTO */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Itens do Orçamento
          </h2>
          <button
            type="button"
            onClick={() =>
              append({
                productName: "",
                productValue: 0,
                productQuantity: 1,
                productCategory: "",
              })
            }
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md font-medium hover:bg-blue-100 transition-colors cursor-pointer"
          >
            + Adicionar Produto
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row items-start md:items-end gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative group"
            >
              <div className="flex-1 flex flex-col gap-1 w-full">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto / Serviço
                </label>
                <input
                  {...register(`items.${index}.productName` as const)}
                  placeholder="Ex: Espelho 4mm Bisotê"
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.items?.[index]?.productName && (
                  <p className="text-xs text-red-500">
                    {errors.items[index].productName?.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-32 flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Categoria
                </label>
                <select
                  {...register(`items.${index}.productCategory` as const)}
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="Vidro">Vidro</option>
                  <option value="Alumínio">Alumínio</option>
                  <option value="Mão de Obra">Mão de Obra</option>
                  <option value="Ferragem">Ferragem</option>
                </select>
              </div>

              <div className="w-full md:w-32 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.productValue` as const, {
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.items?.[index]?.productValue && (
                  <p className="text-xs text-red-500">
                    {errors.items[index].productValue?.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-24 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qtd
                </label>
                <input
                  type="number"
                  {...register(`items.${index}.productQuantity` as const, {
                    valueAsNumber: true,
                  })}
                  placeholder="1"
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.items?.[index]?.productQuantity && (
                  <p className="text-xs text-red-500">
                    {errors.items[index].productQuantity?.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="w-full md:w-auto mt-2 md:mt-0 px-4 py-2 text-red-500 bg-red-50 rounded-md hover:bg-red-100 font-medium transition-colors cursor-pointer"
              >
                Remover
              </button>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-center text-gray-400 py-4 text-sm">
              Nenhum item adicionado ainda.
            </p>
          )}
        </div>
      </section>

      {/* BOTÃO SUBMIT */}
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        Gerar Orçamento
      </button>
    </form>
  );
}
