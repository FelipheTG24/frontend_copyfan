"use client"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiEdit, FiCheck } from "react-icons/fi"
import { api } from "./api";

interface TaskProps {
  id: string;
  description: string;
  dataHoraPagamento: string;
  statusPagamento: boolean;
  meioPagamento: string,
  valores_id: string,

}

export default function Home() {

  // Linkar os inputs
  const descriptionRef = useRef<HTMLInputElement | null>(null)
  const selectnRef = useRef<HTMLSelectElement | null>(null)
  const dateRef = useRef<HTMLInputElement | null>(null)

  // Inicializa lista de tarefas da página como lista vazia
  const [pagamento, setPagamento] = useState<TaskProps[]>([])

  // Ao renderizar a página, chama a função "readPagamento"
  useEffect(() => {
    readPagamento();
  }, [])

  // Busca as tarefas no banco de dados via API
  async function readPagamento() {
    try {
    const response = await api.get("/pagamentos")
    console.log(response.data)
    setPagamento(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    setPagamento([]);
  }

  // Cria uma nova tarefa
  async function createTask(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/pagamentos", {
      description: descriptionRef.current?.value,
      date: dateRef.current?.value
    }) 
    setPagamento(allPagamento => [...allPagamento, response.data])
  }

  // Deleta uma tarefa
  async function deleteTask(id: string){
    try{
      await api.delete("/pagamentos/" + id)
      const allPagamento = pagamento.filter((task) => task.id !== id)
      setPagamento(allPagamento)
    }
    catch(err){
      alert(err)
    }
  }

  async function setTaskDone(id:string) {
    try {
      await api.put("/pagamentos/" + id, {
        status: true,
      })
      const response = await api.get("/pagamentos")
      setPagamento(response.data)
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">Pagamento</h1>

          <form className="flex flex-col my-6" onSubmit={createTask}>
          
            <label className="text-slate-200">Valor Total</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={descriptionRef}/>

            <label className="text-slate-200">Forma de Pagamento</label>
             <select ref={selectnRef}>
            <option value="credit-card"> Cartão de Crédito</option>
            <option value="debit-card"> Cartão de Débito</option>
            <option value="pix"> Pix</option>
            <option value="cash"> Dinheiro</option>
            </select>

            <label className="text-slate-200">Data</label>
            <input type="date" className="w-full mb-5 p-2 rounded" ref={dateRef} />

            <input type="submit" value={"Add Task"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" />
          </form>

        </section>
        {/* <section className="mt-5 flex flex-col">

          {pagamento.length > 0 ? (
          
          pagamento.map((task) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={task.id}>
              <p>{task.description}</p>
              <p>{new Date(task.dataHoraPagamento).toLocaleDateString()}</p>
              <p>{task.statusPagamento.toString()}</p>


              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setTaskDone(task.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deleteTask(task.id)}><FiTrash></FiTrash></button>
            </article>
          ))
        ) : (
         <p className= "text-center text-gray-500"> Nenhum pagamento encontrado.</p>
        )} 
        </section> */}
      </main>
    </div>
  );
 }
}
