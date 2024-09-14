const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // Para lidar com requisições JSON

// Criar uma nova tarefa
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
    },
  });
  res.json(todo);
});

// Listar todas as tarefas
app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

// Obter uma tarefa por ID
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(id) },
  });
  if (!todo) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(todo);
});

// Atualizar uma tarefa
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed, description } = req.body;
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { title, completed, description },
  });
  res.json(todo);
});

// Deletar uma tarefa
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Tarefa deletada" });
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
