'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SearchIcon, EditIcon, BookIcon, TrashIcon } from 'lucide-react'
import { fetchBooks, addBook, updateBook, searchBooks, deleteBook } from '@/utils/api'

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  available: boolean;
}

interface BookFormProps {
  onSubmit: (data: Book | Omit<Book, 'id'>) => void;
  initialData?: Book;
}

export default function LibraryManagementSystem() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedAvailability, setSelectedAvailability] = useState("All")
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [isEditBookOpen, setIsEditBookOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    }
    loadBooks();
  }, []);

  const genres = ["All", ...Array.from(new Set(books.map(book => book.genre)))]

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const handleSearch = useCallback(
    debounce(async (term: string, genre: string, availability: string) => {
      try {
        const searchResults = await searchBooks(term, genre, availability);
        setFilteredBooks(searchResults);
      } catch (error) {
        console.error('Error searching books:', error);
      }
    }, 300),
    []
  )

  useEffect(() => {
    handleSearch(searchTerm, selectedGenre, selectedAvailability)
  }, [searchTerm, selectedGenre, selectedAvailability, handleSearch])

  const handleAddBook = async (newBook: Omit<Book, 'id'>) => {
    try {
      const addedBook = await addBook(newBook);
      setBooks(prevBooks => [...prevBooks, addedBook]);
      setFilteredBooks(prevFiltered => [...prevFiltered, addedBook]);
      setIsAddBookOpen(false);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  }

  const handleEditBook = async (updatedBook: Book) => {
    try {
      const editedBook = await updateBook(updatedBook.id, updatedBook);
      setBooks(prevBooks => prevBooks.map(book => book.id === editedBook.id ? editedBook : book));
      setFilteredBooks(prevFiltered => prevFiltered.map(book => book.id === editedBook.id ? editedBook : book));
      setIsEditBookOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  }

  const handleDeleteBook = async (book: Book) => {
    setBookToDelete(book)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id)
        setBooks(prevBooks => prevBooks.filter(b => b.id !== bookToDelete.id))
        setFilteredBooks(prevFiltered => prevFiltered.filter(b => b.id !== bookToDelete.id))
        setIsDeleteDialogOpen(false)
        setBookToDelete(null)
      } catch (error) {
        console.error('Error deleting book:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-foreground">Library Management System</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Input
            type="text"
            placeholder="Search books by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto"><PlusIcon className="mr-2 h-4 w-4" /> Add Book</Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <BookForm onSubmit={handleAddBook} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <Card key={book.id} className="overflow-hidden bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-card-foreground">{book.title}</h2>
              <p className="text-muted-foreground mb-1">Author: {book.author}</p>
              <p className="text-muted-foreground mb-1">Genre: {book.genre}</p>
              <p className="text-muted-foreground mb-4">Published: {new Date(book.publicationDate).toLocaleDateString()}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.available ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                  {book.available ? 'Available' : 'Unavailable'}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingBook(book)
                    setIsEditBookOpen(true)
                  }}>
                    <EditIcon className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBook(book)}>
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditBookOpen} onOpenChange={setIsEditBookOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {editingBook && <BookForm onSubmit={(data) => handleEditBook(data as Book)} initialData={editingBook} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the book "{bookToDelete?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">No books found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}

function BookForm({ onSubmit, initialData }: BookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>(initialData || {
    title: '',
    author: '',
    genre: '',
    publicationDate: '',
    available: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as Book)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" value={formData.author || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input id="genre" name="genre" value={formData.genre || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="publicationDate">Publication Date</Label>
        <Input id="publicationDate" name="publicationDate" type="date" value={formData.publicationDate || ''} onChange={handleChange} required />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="available"
          name="available"
          type="checkbox"
          checked={formData.available || false}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="available">Available</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData?.id ? 'Update Book' : 'Add Book'}
      </Button>
    </form>
  )
}