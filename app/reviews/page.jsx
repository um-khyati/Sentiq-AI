"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button, Input, Modal, Loader, useToast } from "@/components/ui";
import { reviewsApi } from "@/lib/api";
import { Search, Smile, Frown, Meh, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

const sentimentMeta = {
  Positive: { icon: Smile, classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  Negative: { icon: Frown, classes: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400" },
  Neutral: { icon: Meh, classes: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
};

const emptyForm = { guest: "", room: "", sentiment: "Positive", score: 80, date: "", text: "" };

/** Shared select styling that matches the look of the Input component. */
function SentimentSelect({ value, onChange, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Sentiment
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-primary-500/20"
      >
        <option value="Positive">Positive</option>
        <option value="Neutral">Neutral</option>
        <option value="Negative">Negative</option>
      </select>
    </div>
  );
}

/**
 * /reviews — Detail/List View screen.
 *
 * Fetches reviews from the SentiqAI backend (GET /api/reviews) instead of
 * static mock data, and supports creating, editing, and deleting reviews
 * directly against the API.
 *
 * Desktop/tablet: data table. Mobile: stacked cards (same data, no
 * horizontal scrolling). Clicking a row/card opens the Modal with the
 * full review detail, where it can also be edited or deleted.
 */
export default function ReviewsPage() {
  const { toast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // review being viewed/edited
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewsApi.getAll();
      setReviews(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.guest.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.sentiment.toLowerCase().includes(q)
    );
  }, [query, reviews]);

  /** Opens the detail modal in read-only mode. */
  const openDetail = (review) => {
    setSelected(review);
    setEditing(false);
    setEditForm({
      guest: review.guest,
      room: review.room,
      sentiment: review.sentiment,
      score: review.score,
      date: review.date ? review.date.slice(0, 10) : "",
      text: review.text,
    });
  };

  const closeDetail = () => {
    setSelected(null);
    setEditing(false);
  };

  /** Create a new review (POST /api/reviews) */
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...createForm, score: Number(createForm.score) };
      const res = await reviewsApi.create(payload);
      setReviews((prev) => [res.data, ...prev]);
      toast("Review created.", { variant: "success" });
      setCreateOpen(false);
      setCreateForm(emptyForm);
    } catch (err) {
      toast(err.message, { variant: "error" });
    } finally {
      setCreating(false);
    }
  };

  /** Save edits to an existing review (PUT /api/reviews/:id) */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSavingEdit(true);
    try {
      const payload = { ...editForm, score: Number(editForm.score) };
      const res = await reviewsApi.update(selected._id, payload);
      setReviews((prev) => prev.map((r) => (r._id === selected._id ? res.data : r)));
      setSelected(res.data);
      setEditing(false);
      toast("Review updated.", { variant: "success" });
    } catch (err) {
      toast(err.message, { variant: "error" });
    } finally {
      setSavingEdit(false);
    }
  };

  /** Delete a review (DELETE /api/reviews/:id) */
  const handleDelete = async () => {
    if (!selected) return;
    if (typeof window !== "undefined" && !window.confirm(`Delete the review from ${selected.guest}?`)) {
      return;
    }
    setDeleting(true);
    try {
      await reviewsApi.remove(selected._id);
      setReviews((prev) => prev.filter((r) => r._id !== selected._id));
      toast("Review deleted.", { variant: "success" });
      closeDetail();
    } catch (err) {
      toast(err.message, { variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 transition-colors duration-300 dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                Reviews
              </h1>
              <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                Browse, search, and manage guest reviews and their sentiment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                icon={Search}
                placeholder="Search guest, room, or sentiment…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="sm:w-72"
              />
              <Button onClick={() => setCreateOpen(true)} className="shrink-0">
                <Plus className="h-4 w-4" />
                Add Review
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mt-8">
            {loading ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-surface-darkCard">
                <Loader label="Loading reviews…" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 py-16 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
                <Button variant="secondary" size="sm" onClick={loadReviews}>
                  Try again
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop / tablet: table */}
                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none sm:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Guest</th>
                        <th className="px-6 py-3 font-medium">Room</th>
                        <th className="px-6 py-3 font-medium">Sentiment</th>
                        <th className="px-6 py-3 font-medium">Score</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filtered.map((review) => {
                        const meta = sentimentMeta[review.sentiment];
                        const Icon = meta.icon;
                        return (
                          <tr
                            key={review._id}
                            onClick={() => openDetail(review)}
                            className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                          >
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{review.guest}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{review.room}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.classes}`}>
                                <Icon className="h-3.5 w-3.5" />
                                {review.sentiment}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{review.score}</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-500">
                              {review.date ? new Date(review.date).toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: stacked cards */}
                <div className="flex flex-col gap-4 sm:hidden">
                  {filtered.map((review) => {
                    const meta = sentimentMeta[review.sentiment];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={review._id}
                        onClick={() => openDetail(review)}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card dark:border-slate-800 dark:bg-surface-darkCard dark:shadow-none"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900 dark:text-white">{review.guest}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.classes}`}>
                            <Icon className="h-3 w-3" />
                            {review.sentiment}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {review.room} • {review.date ? new Date(review.date).toLocaleDateString() : "—"}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    {reviews.length === 0
                      ? "No reviews yet. Click “Add Review” to create one."
                      : `No reviews match “${query}”.`}
                  </p>
                )}
              </>
            )}
          </AnimatedSection>
        </div>
      </main>

      {/* Detail / Edit view (Modal) */}
      <Modal
        isOpen={Boolean(selected)}
        onClose={closeDetail}
        title={editing ? `Edit review — ${selected?.guest}` : selected?.guest}
        footer={
          editing ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)} disabled={savingEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} loading={savingEdit}>
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button onClick={closeDetail}>Close</Button>
            </>
          )
        }
      >
        {selected && !editing && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Room: {selected.room}</span>
              <span>Date: {selected.date ? new Date(selected.date).toLocaleDateString() : "—"}</span>
              <span>Score: {selected.score}/100</span>
            </div>
            <p className="leading-relaxed">{selected.text}</p>
          </div>
        )}

        {selected && editing && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Guest name"
                value={editForm.guest}
                onChange={(e) => setEditForm((f) => ({ ...f, guest: e.target.value }))}
                required
              />
              <Input
                label="Room"
                value={editForm.room}
                onChange={(e) => setEditForm((f) => ({ ...f, room: e.target.value }))}
                required
              />
              <SentimentSelect
                id="edit-sentiment"
                value={editForm.sentiment}
                onChange={(e) => setEditForm((f) => ({ ...f, sentiment: e.target.value }))}
              />
              <Input
                label="Score (0–100)"
                type="number"
                min="0"
                max="100"
                value={editForm.score}
                onChange={(e) => setEditForm((f) => ({ ...f, score: e.target.value }))}
                required
              />
              <Input
                label="Date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <Input
              label="Review text"
              value={editForm.text}
              onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
              required
            />
          </form>
        )}
      </Modal>

      {/* Create review (Modal) */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a new review"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              Create review
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Guest name"
              placeholder="Jane Doe"
              value={createForm.guest}
              onChange={(e) => setCreateForm((f) => ({ ...f, guest: e.target.value }))}
              required
            />
            <Input
              label="Room"
              placeholder="Deluxe King"
              value={createForm.room}
              onChange={(e) => setCreateForm((f) => ({ ...f, room: e.target.value }))}
              required
            />
            <SentimentSelect
              id="create-sentiment"
              value={createForm.sentiment}
              onChange={(e) => setCreateForm((f) => ({ ...f, sentiment: e.target.value }))}
            />
            <Input
              label="Score (0–100)"
              type="number"
              min="0"
              max="100"
              value={createForm.score}
              onChange={(e) => setCreateForm((f) => ({ ...f, score: e.target.value }))}
              required
            />
            <Input
              label="Date"
              type="date"
              value={createForm.date}
              onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <Input
            label="Review text"
            placeholder="What did the guest say?"
            value={createForm.text}
            onChange={(e) => setCreateForm((f) => ({ ...f, text: e.target.value }))}
            required
          />
        </form>
      </Modal>

      <Footer />
    </>
  );
}
