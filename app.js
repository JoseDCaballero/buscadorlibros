const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchType = document.getElementById('search-type');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
let currentPage = 1;

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentPage = 1;
    await fetchBooks();
});

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

function displayResults(books) {
    resultsDiv.innerHTML = '';
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center text-red-500">No se encontraron libros.</p>';
        return;
    }

    books.forEach((book) => {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : '/img/nocover.jpg';

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

function setupPagination(totalResults) {
    const resultsPerPage = 100;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    paginationDiv.innerHTML = '';

    if (totalPages <= 1) return;

    // Botón de retroceso
    const prevButton = document.createElement('button');
    prevButton.textContent = '<- Anterior';
    prevButton.classList.add(
        'px-4',
        'py-2',
        'rounded',
        'border',
        'hover:bg-blue-600',
        'hover:text-white',
        'transition',
        'bg-gray-200'
    );
    if (currentPage === 1) {
        prevButton.disabled = true;
        prevButton.classList.add('opacity-50', 'cursor-not-allowed');
    }

    prevButton.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await fetchBooks();
        }
    });

    paginationDiv.appendChild(prevButton);

    // Mostrar página actual
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInfo.classList.add('px-4', 'py-2', 'font-semibold', 'text-gray-700');

    paginationDiv.appendChild(pageInfo);

    // Botón de avance
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente ->';
    nextButton.classList.add(
        'px-4',
        'py-2',
        'rounded',
        'border',
        'hover:bg-blue-600',
        'hover:text-white',
        'transition',
        'bg-gray-200'
    );
    if (currentPage === totalPages) {
        nextButton.disabled = true;
        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    }

    nextButton.addEventListener('click', async () => {
        if (currentPage < totalPages) {
            currentPage++;
            await fetchBooks();
        }
    });

    paginationDiv.appendChild(nextButton);
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const loadingMessage = document.getElementById('loading-message');
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.getElementById('pagination');
        
    loadingMessage.classList.remove('hidden');
        
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';
        
    setTimeout(() => {        
        loadingMessage.classList.add('hidden');
                
        resultsContainer.innerHTML = '<p>Cargando resultados...</p>';
    });
});