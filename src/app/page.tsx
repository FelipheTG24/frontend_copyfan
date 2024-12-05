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
  const dateRef = useRef<HTMLInputElement | null>(null)

  // Inicializa lista de tarefas da página como lista vazia
  const [pagamento, setPagamento] = useState<TaskProps[]>([])

  // Ao renderizar a página, chama a função "readPagamento"
  useEffect(() => {
    readPagamento();
  }, [])

  // Busca as tarefas no banco de dados via API
  async function readPagamento() {
    const response = await api.get("/pagamento")
    console.log(response.data)
    setPagamento(response.data)
  }

  // Cria uma nova tarefa
  async function createTask(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/pagamento", {
      description: descriptionRef.current?.value,
      date: dateRef.current?.value
    }) 
    setPagamento(allPagamento => [...allPagamento, response.data])
  }

  // Deleta uma tarefa
  async function deleteTask(id: string){
    try{
      await api.delete("/pagamento/" + id)
      const allPagamento = pagamento.filter((task) => task.id !== id)
      setPagamento(allPagamento)
    }
    catch(err){
      alert(err)
    }
  }

  async function setTaskDone(id:string) {
    try {
      await api.put("/pagamento/" + id, {
        status: true,
      })
      const response = await api.get("/pagamento")
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

            <label className="text-slate-200">Data</label>
            <input type="date" className="w-full mb-5 p-2 rounded" ref={dateRef} />

            <input type="submit" value={"Add Task"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" />
          </form>

        </section>
        <section className="mt-5 flex flex-col">

          {pagamento.map((task) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={task.id}>
              <p>{task.description}</p>
              <p>{new Date(task.dataHoraPagamento).toLocaleDateString()}</p>
              <p>{task.statusPagamento.toString()}</p>


              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setTaskDone(task.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deleteTask(task.id)}><FiTrash></FiTrash></button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
