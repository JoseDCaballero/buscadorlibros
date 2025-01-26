const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchType = document.getElementById('search-type');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
let currentPage = 1;

// Evento para manejar la búsqueda
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentPage = 1; // Reiniciar a la primera página
    await fetchBooks();
});

// Función para buscar libros en OpenLibrary
async function fetchBooks() {
    const query = searchInput.value.trim();
    if (!query) return;
    const type = searchType.value;
    const url = `https://openlibrary.org/search.json?${type}=${encodeURIComponent(query)}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.docs);
        setupPagination(data.num_found);
    } catch (error) {
        resultsDiv.innerHTML = '<p class="text-red-500">Ocurrió un error al buscar. Por favor, intenta de nuevo.</p>';
        console.error(error);
    }
}

// Mostrar los resultados como tarjetas
function displayResults(books) {
    resultsDiv.innerHTML = '';
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center text-red-500">No se encontraron libros.</p>';
        return;
    }

    books.forEach((book) => {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/150?text=No+Image';

        const bookElement = `
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <img src="${coverUrl}" alt="Portada de ${book.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-lg font-semibold">${book.title}</h3>
                <p class="text-gray-600"><strong>Autor:</strong> ${book.author_name ? book.author_name.join(', ') : 'Desconocido'}</p>
                <p class="text-gray-600"><strong>Año:</strong> ${book.first_publish_year || 'Desconocido'}</p>
            </div>
        `;
        resultsDiv.insertAdjacentHTML('beforeend', bookElement);
    });
}

// Mejorar la paginación
function setupPagination(totalResults) {
    const resultsPerPage = 100; // Resultados por página
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    paginationDiv.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add(
            'px-4',
            'py-2',
            'rounded',
            'border',
            'hover:bg-blue-600',
            'hover:text-white',
            'transition'
        );
        if (i === currentPage) {
            pageButton.classList.add('bg-blue-600', 'text-white');
        } else {
            pageButton.classList.add('bg-gray-200');
        }        

        pageButton.addEventListener('click', async () => {
            currentPage = i;
            await fetchBooks();
        });

        paginationDiv.appendChild(pageButton);
    }
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const loadingMessage = document.getElementById('loading-message');
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.getElementById('pagination');
    
    // Mostrar el mensaje de carga
    loadingMessage.classList.remove('hidden');
    
    // Limpiar resultados anteriores
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';
    
    // Simular una solicitud a la API
    setTimeout(() => {
        // Ocultar el mensaje de carga
        loadingMessage.classList.add('hidden');
        
        // Mostrar resultados simulados
        resultsContainer.innerHTML = '<p>Cargando resultados...</p>';
    });
});