import io from "socket.io-client";
import Swal from "sweetalert2";
import { logger } from "./utils/logger"; // Importar el logger una sola vez

const socket = io();
let user;

const chatBox = document.getElementById("chatBox");
const messagesLog = document.getElementById("messagesLogs");

// Función para agregar mensajes al log de forma segura
function addMessages(messages) {
  messagesLog.innerHTML += messages
    .map((message) => `<div>${message.user}: ${message.message}</div>`)
    .join("");
}

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa un usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("join", user); // Avisar al servidor que el usuario se unió
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && chatBox.value.trim()) {
    logger.info(`Mensaje enviado por ${user}: ${chatBox.value}`);
    socket.emit("message", { user, message: chatBox.value });
    chatBox.value = "";
  }
});

socket.on("message", (data) => {
  if (Array.isArray(data)) {
    addMessages(data);
  } else {
    logger.error("Datos recibidos no son un array:", data);
  }
});

socket.on("users", (users) => {
  // Mostrar una lista de usuarios conectados (opcional)
  console.log("Usuarios conectados:", users);
});

socket.on("disconnect", () => {
  logger.info("Te has desconectado del chat");
});
