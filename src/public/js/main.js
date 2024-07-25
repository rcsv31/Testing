import { io } from "socket.io-client";
import { logger } from "./utils/logger.js"; // Assuming logger is a named export

logger.info("esta funcionando main.js");

const socket = io();

// Handle product events
const productSocket = io("/products");

productSocket.on("products", (data) => {
  renderProducts(data);
});

// Function to render product list
const renderProducts = (products) => {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  products.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card"; // Use className for class attribute
    card.innerHTML = `
      <p>ID:${element._id}</p>
      <p>Titulo: ${element.title}</p>
      <p>Precio: ${element.price}</p>
      <button>Eliminar</button>
    `;
    productsContainer.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      removeProduct(element.id);
    });
  });
};

// Function to remove product
const removeProduct = (id) => {
  productSocket.emit("removeProduct", id);
};

// Add product functionality
document.getElementById("btnEnviar").addEventListener("click", () => {
  addProduct();
});

// Function to add product
const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value), // Ensure numeric price
    thumbnail: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: parseInt(document.getElementById("stock").value), // Ensure numeric stock
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };
  productSocket.emit("addProduct", product);
};

// Function to render chat messages
const renderMessages = (messages) => {
  const messagesLogs = document.getElementById("messagesLogs");
  messagesLogs.innerHTML = "";
  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message.text;
    messagesLogs.appendChild(messageElement);
  });
};

// Function to render cart products
const renderCartProducts = (cart) => {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  cart.forEach((cartItem) => {
    const product = cartItem.product;
    const quantity = cartItem.quantity;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p>ID:${product._id}</p>
      <p>Titulo: ${product.title}</p>
      <p>Descripción: ${product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Cantidad en el carrito: ${quantity}</p>
      <button>Eliminar</button>
    `;
    productsContainer.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      removeProductFromCart(product._id); // Assuming removeProductFromCart function exists
    });
  });
};

// Login events
const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const usuario = document.getElementById("usuario").value;
  const pass = document.getElementById("pass").value;

  const obj = { usuario, pass };

  fetch("/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((result) => result.json())
    .then((json) => {
      localStorage.setItem("authToken", json.token);
    });
});
