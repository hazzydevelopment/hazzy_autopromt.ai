import { useEffect, useState } from "react";
import { usePromptStore } from "./store/promptStore";
import PromptForm from "./components/PromptForm";
import PromptCard from "./components/PromptCard";

export default function App() {
  const store = usePromptStore();
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);

  useEffect(() => {
    store.loadFromStorage();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    store.saveToStorage();
    // eslint-disable-next-line
  }, [store.prompts]);

  const addOrUpdate = (data) => {
    if (editing) {
      store.updatePrompt(editing.id, data);
      setEditing(null);
    } else {
      store.addPrompt(data);
    }
  };

  const filtered = store.prompts
    .filter((p) => (onlyFav ? p.favorite : true))
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (p.title || "").toLowerCase().includes(q) ||
        (p.text || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    })
    .slice()
    .reverse(); // newest first

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">AutoPrompt</h1>

        <PromptForm
          initial={editing}
          onSubmit={addOrUpdate}
          submitLabel={editing ? "Update Prompt" : "Save Prompt"}
        />

        <div className="mt-4 flex gap-2">
          <input
            placeholder="Search title, text, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={onlyFav} onChange={(e) => setOnlyFav(e.target.checked)} />
            <span className="text-sm">Favorites</span>
          </label>

          <div className="ml-auto flex gap-2">
            <button
              className="px-3 py-1 bg-zinc-800 text-white rounded"
              onClick={() => {
                const json = store.exportToJSON();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "autoprompt-export.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export
            </button>

            <label className="px-3 py-1 bg-zinc-200 rounded cursor-pointer">
              Import
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      store.importFromJSON(reader.result);
                    } catch (err) {
                      alert("Import failed");
                    }
                  };
                  reader.readAsText(f);
                  e.target.value = "";
                }}
              />
            </label>

            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                if (confirm("Clear all prompts?")) store.clearAll();
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-500">No prompts found.</p>
          )}

          {filtered.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p}
              onDelete={() => store.removePrompt(p.id)}
              onEdit={() => setEditing(p)}
              onFav={() => store.toggleFavorite(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
