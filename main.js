let booksData = [];
        
async function fetchBooks() {
    const categories = ["programming", "design", "marketing", "ui-ux", "seo", "mathematics"];
    const promises = categories.map(category => 
        fetch(`https://openlibrary.org/subjects/${category}.json?limit=10`)
            .then(response => response.json())
            .then(data => {
                data.works.forEach(book => book.category = category);
                return data.works;
            })
    );

    const results = await Promise.all(promises);

    booksData = results.flat();
    displayBooks(booksData);
}

function displayBooks(books) {
    const booksContainer = document.getElementById('books');
    booksContainer.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg" alt="${book.title}">
            <div class="details">
                <h2>${book.title}</h2>
                <p>By: ${book.authors ? book.authors.map(a => a.name).join(', ') : 'Unknown'}</p>
                <p>Published Year: ${book.first_publish_year || 'N/A'}</p>
            </div>
        `;
        booksContainer.appendChild(bookElement);
    });
}

function filterBooks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const selectedCategory = document.getElementById('category').value;
    
    const filteredBooks = booksData.filter(book => 
        (selectedCategory === 'all' || book.category === selectedCategory) && 
        book.title.toLowerCase().includes(searchQuery)
    );
    
    displayBooks(filteredBooks);
}

fetchBooks();