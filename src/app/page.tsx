"use client";
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiCheck } from "react-icons/fi";
import { api } from "./api";

interface TaskProps {
  id: string;
  valorTotal: string;
  dataHoraPagamento: string;
  statusPagamento: boolean;
  meioPagamento: string;
  valores_id: string;
}

export default function Home() {
  const valorTotalRef = useRef<HTMLInputElement | null>(null);
  const selectnRef = useRef<HTMLSelectElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const [pagamento, setPagamento] = useState<TaskProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await readPagamento();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  async function readPagamento() {
    try {
      const response = await api.get("/pagamentos");
      console.log("Dados recebidos:", response.data);
      setPagamento(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      setPagamento([]);
    }
  }

  async function createTask(event: FormEvent) {
    event.preventDefault();

    if (!valorTotalRef.current?.value || !dateRef.current?.value || !selectnRef.current?.value) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/pagamentos", {
        valorTotal: valorTotalRef.current.value,
        dataHoraPagamento: dateRef.current.value,
        meioPagamento: selectnRef.current.value,
      });

      setPagamento((allPagamento) => [...allPagamento, response.data]);

      // Limpar os campos do formulário
      valorTotalRef.current.value = "";
      dateRef.current.value = "";
      if (selectnRef.current) selectnRef.current.value = "credit-card";
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
    }
  }

  async function deleteTask(id: string) {
    try {
      await api.delete(`/pagamentos/${id}`);
      const updatedPagamento = pagamento.filter((task) => task.id !== id);
      setPagamento(updatedPagamento);
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
    }
  }

  async function setTaskDone(id: string) {
    try {
      await api.put(`/pagamentos/${id}`, { statusPagamento: true });
      const updatedPagamento = pagamento.map((task) =>
        task.id === id ? { ...task, statusPagamento: true } : task
      );
      setPagamento(updatedPagamento);
    } catch (error) {
      console.error("Erro ao atualizar status do pagamento:", error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">Pagamento</h1>

          <form className="flex flex-col my-6" onSubmit={createTask}>
            <label className="text-slate-200">Valor Total</label>
            <input
              type="text"
              className="w-full mb-5 p-2 rounded"
              ref={valorTotalRef}
              placeholder="Digite o valor"
            />

            <label className="text-slate-200">Forma de Pagamento</label>
            <select className="w-full mb-5 p-2 rounded" ref={selectnRef} defaultValue="credit-card">
              <option value="credit-card">Cartão de Crédito</option>
              <option value="debit-card">Cartão de Débito</option>
              <option value="pix">Pix</option>
              <option value="cash">Dinheiro</option>
            </select>

            <label className="text-slate-200">Data</label>
            <input
              type="date"
              className="w-full mb-5 p-2 rounded"
              ref={dateRef}
            />

            <input
              type="submit"
              value="Adicionar Pagamento"
              className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4"
            />
          </form>
        </section>

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <section className="mt-5 flex flex-col">
            {pagamento.length > 0 ? (
              pagamento.map((task) => (
                <article
                  className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300"
                  key={task.id}
                >
                  <p>Valor Total: {task.valorTotal}</p>
                  <p>Data: {new Date(task.dataHoraPagamento).toLocaleDateString()}</p>
                  <p>Forma de Pagamento: {task.meioPagamento}</p>
                  <p>Status: {task.statusPagamento ? "Pago" : "Pendente"}</p>

                  <button
                    className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200"
                    onClick={() => setTaskDone(task.id)}
                  >
                    <FiCheck />
                  </button>

                  <button
                    className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200"
                    onClick={() => deleteTask(task.id)}
                  >
                    <FiTrash />
                  </button>
                </article>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhum pagamento encontrado.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
