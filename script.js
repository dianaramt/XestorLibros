
if (!window.indexedDB) {
 alert("O teu navegador non soporta IndexedDB");
}
const dbName = "XestorLibros";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion); //abrir ou crear
request.onerror = function(event) {
 console.error("Erro ao abrir a base de datos:", event.target.errorCode);
};


request.onupgradeneeded = function(event) {
 db = event.target.result;
 const objectStore = db.createObjectStore("libros", { keyPath: "id",
autoIncrement: true });
 objectStore.createIndex("nome", "nome", { unique: false });
 console.log("Obxecto 'nome' creado na base de datos.");
};


request.onsuccess = function(event) {
 db = event.target.result;
 console.log("Base de datos aberta exitosamente.");
 displayLibros();
};
// Función para engadir unha libro
function addTask(nome) {
 const transaction = db.transaction(["libros"], "readwrite");
 const objectStore = transaction.objectStore("libros");
 const libro = { nome: nome, completed: false };
 const request = objectStore.add(libro);
 request.onsuccess = function() {
 console.log("Libro engadido:", nome);
 displayLibros();
 };
 request.onerror = function(event) {
 console.error("Erro ao engadir o libro:", event.target.error);
 };
}

// Función para obter e mostrar todos os libros
function displayLibros() {
 const lista = document.getElementById("libros");
 lista.innerHTML = ""; // Limpar a lista
 const transaction = db.transaction(["libros"], "readonly");
 const objectStore = transaction.objectStore("libros");
 objectStore.openCursor().onsuccess = function(event) {
 const cursor = event.target.result;
 if (cursor) {
 const li = document.createElement("li");
 li.className = "libro-item";
 li.textContent = cursor.value.nome;
 lista.appendChild(li);
 cursor.continue();
 } else {
 console.log("Todos os libros foron mostrados.");
 }
 };
}
// Xestionar o envío do formulario
document.getElementById("libroForm").addEventListener("submit", function(event) {
 event.preventDefault();
 const libroInput = document.getElementById("libroInput");
 const nome = libroInput.value.trim();
 if (nome !== "") {
 addTask(nome);
 libroInput.value = "";
 }
});
