'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  description: string;
  cover: string;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Manage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [errorBooks, setErrorBooks] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    setErrorBooks(null);
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data.books);
      setIsAdmin(response.data.role === 'admin');
    } catch (error) {
      console.error('Error fetching books:', error);
      setErrorBooks('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorUsers('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        setErrorBooks('Failed to delete book. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setErrorUsers('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Manage Books and Users</h1>
        <Link href="/admin/createbook">
          <Button>Create New Book</Button>
        </Link>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">Books</h2>
        {isLoadingBooks ? (
          <div>Loading books...</div>
        ) : errorBooks ? (
          <div className="bg-red-50 border-red-200 p-4">
            <p className="text-red-500">{errorBooks}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img src={book.cover} alt={book.title} className="w-20 h-27 object-cover" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.description}</td>
                  <td>{book.status}</td>
                  <td>
                    <Link href={`/admin/editbook/${book._id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Button variant="destructive" onClick={() => handleDeleteBook(book._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Users</h2>
        {isLoadingUsers ? (
          <div>Loading users...</div>
        ) : errorUsers ? (
          <div className="bg-red-50 border-red-200 p-4">
            <p className="text-red-500">{errorUsers}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}