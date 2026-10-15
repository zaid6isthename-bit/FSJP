import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function Exp12Demo() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('499');
  const [message, setMessage] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    const res = await api.getBooks();
    if (res.success) {
      setBooks(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !author) return;
    const res = await api.createBook({
      title,
      author,
      price: parseFloat(price) || 0.0,
    });
    if (res.success) {
      setMessage(`✓ Created book: "${res.data.title}" via Spring Boot Service layer`);
      setTitle('');
      setAuthor('');
      setPrice('499');
      fetchBooks();
    } else {
      setMessage(`✕ Error: ${res.message}`);
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleDelete = async (id) => {
    const res = await api.deleteBook(id);
    if (res.success) {
      setMessage('✓ Deleted book record via JdbcBookRepository');
      fetchBooks();
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E6E4DC] pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#101418] font-display">Spring Boot Monolithic Architecture (Book CRUD)</h3>
          <p className="text-xs text-[#5C6672]">
            Real working CRUD executing against Spring Boot @RestController, @Service, and @Repository layers
          </p>
        </div>
        <button
          onClick={fetchBooks}
          disabled={loading}
          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white border border-[#E6E4DC] text-[#101418] hover:border-[#0E6E5C] flex items-center gap-1.5 shadow-subtle transition-all"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Live Data
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-[#EFF5F2] border border-[#D0E2D9] text-xs font-mono text-[#0E6E5C] animate-fadeIn">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Book Form */}
        <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-card space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">add_circle</span>
            Add New Book Record
          </h4>

          <form onSubmit={handleCreate} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[#101418] mb-1 font-medium font-sans">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clean Architecture"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] text-[#101418] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0E6E5C] focus:bg-white transition-all shadow-subtle"
              />
            </div>

            <div>
              <label className="block text-[#101418] mb-1 font-medium font-sans">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Robert C. Martin"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] text-[#101418] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0E6E5C] focus:bg-white transition-all shadow-subtle"
              />
            </div>

            <div>
              <label className="block text-[#101418] mb-1 font-medium font-sans">Price (₹ INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC] text-[#101418] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0E6E5C] focus:bg-white transition-all shadow-subtle"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-sans font-semibold text-xs bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white shadow-subtle transition-all cursor-pointer"
            >
              Dispatch POST to BookController
            </button>
          </form>
        </div>

        {/* Live Book Inventory Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#0E6E5C]">database</span>
              Database Records (books table)
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF5F2] text-[#0E6E5C] border border-[#D0E2D9] font-medium">
              Live Spring JDBC Connection
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E6E4DC] text-[#5C6672] font-mono">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEEE8] font-mono">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-2.5 px-3 text-[#5C6672]">#{b.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#101418]">{b.title}</td>
                    <td className="py-2.5 px-3 text-[#5C6672]">{b.author}</td>
                    <td className="py-2.5 px-3 text-right text-[#0E6E5C] font-bold">₹{b.price}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-[#A93226] hover:text-[#7A1E15] text-[11px] font-medium px-2 py-0.5 rounded hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#5C6672] font-sans">
                      No books found in database. Add one on the left!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
