const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchBooks() {
  const response = await fetch(`${API_URL}/api/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
}

export async function addBook(bookData: any) {
  const response = await fetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error('Failed to add book');
  }
  return response.json();
}

export async function updateBook(id: number, bookData: any) {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return response.json();
}

export async function searchBooks(query: string, genre: string, availability: string) {
  const params = new URLSearchParams({ query, genre, availability });
  const response = await fetch(`${API_URL}/api/books/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to search books');
  }
  return response.json();
}

export async function deleteBook(id: number) {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
  return response.json();
}