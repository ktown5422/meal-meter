"use client";

import { useState, FormEvent } from "react";
import useSWR from "swr";

type Meal = {
  id: number;
  name: string;
  rating: number;
  photoUrl?: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data: meals, mutate } = useSWR<Meal[]>("/api/meals", fetcher);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name);
    form.append("rating", rating.toString());
    if (photo) form.append("photo", photo);

    await fetch("/api/meals", {
      method: "POST",
      body: form,
    });
    setName("");
    setRating(1);
    setPhoto(null);
    mutate();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
          MealMeter
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dish Name
            </label>
            <input
              type="text"
              placeholder="What did you eat?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md shadow-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(+e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Meal
          </button>
        </form>

        {/* Meals Grid */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals?.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              {m.photoUrl ? (
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Photo
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {m.name}
                </h2>
                <p className="mt-2 text-yellow-500 font-medium">
                  {"★".repeat(m.rating) + "☆".repeat(5 - m.rating)}
                </p>
                <p className="mt-2 text-gray-500 text-sm">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}


