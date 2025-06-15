
if (!window.indexedDB) {
 alert("O teu navegador non soporta IndexedDB. A aplicación non funcionará correctamente.");
}

const dbName = "XestorLibros";
const dbVersion = 2; //forzamos o upgradeneeded
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
 console.error("Erro ao abrir a base de datos:", event.target.errorCode);
};


request.onupgradeneeded = function(event) {//ao ter unha version superior crea categorias
 db = event.target.result;
 const objectStore = db.createObjectStore("categorias", { keyPath: "id", autoIncrement: true });
 objectStore.createIndex("nome", "nome", { unique: true }); //ainda que se poden poñer mais 
 console.log("Obxecto 'categorias' creado na base de datos.");
};

request.onsuccess = function(event) {
 db = event.target.result;
 console.log("Base de datos aberta exitosamente.");
 displayCategorias();

//poñer aqui o que facer nada mais cargar a páxina
};

function addCategoria(nome) {
 const transaction = db.transaction(["categorias"], "readwrite");
 const objectStore = transaction.objectStore("categorias");
 const categoria = { nome: nome, numero: 1 };
  const request = objectStore.add(categoria);
 request.onsuccess = function() {
 console.log("Categoria engadida:", nome);
 displayCategorias();
 };
 request.onerror = function(event) {
 console.error("Erro ao engadir a categoria:", event.target.error);
 };
}

function removeCategoria(id) {
 const transaction = db.transaction(["categorias"], "readwrite");
 const objectStore = transaction.objectStore("categorias");
  const request = objectStore.delete(id);
 request.onsuccess = function() {
 console.log("Categoria eliminada:", id);
 displayCategorias();
 };
 request.onerror = function(event) {
 console.error("Erro ao eliminar a categoria:", event.target.error);
 };
}

function displayCategorias() {
 const categoriasList = document.getElementById("categorias");
 categoriasList.innerHTML = ""; // Limpar a lista
 const transaction = db.transaction(["categorias"], "readonly");
 const objectStore = transaction.objectStore("categorias");
 objectStore.openCursor().onsuccess = function(event) {
 const cursor = event.target.result;
 if (cursor) {
 const li = document.createElement("li");
 const p1 = document.createElement("p");
 const p2 = document.createElement("p");
 li.className = "categoria-item";
 p1.textContent = cursor.value.nome; 
 p2.textContent = cursor.value.numero; 
li.appendChild(p1);
li.appendChild(p2);
 categoriasList.appendChild(li);
 cursor.continue();
 } else {
 console.log("Todas as categorias foron mostradas.");
 }
 };
}


document.getElementById("categoriaForm").addEventListener("submit", function(event) {
 event.preventDefault();
 const nomeInput = document.getElementById("categoriasInput");
 const nome = nomeInput.value.trim();
 if (nome !== "") {
 addCategoria(nome);
 nomeInput.value = "";
 }
});


