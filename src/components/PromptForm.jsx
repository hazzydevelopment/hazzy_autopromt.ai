import { useState, useEffect } from "react";
import TagInput from "./TagInput";

export default function PromptForm({ onSubmit, initial = null, submitLabel = "Save Prompt" }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setText(initial.text || "");
      setTags(Array.isArray(initial.tags) ? initial.tags : []);
      setFavorite(!!initial.favorite);
    } else {
      setTitle("");
      setText("");
      setTags([]);
      setFavorite(false);
    }
  }, [initial]);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!title.trim() || !text.trim()) return;
    onSubmit({ title: title.trim(), text: text.trim(), tags, favorite });
    // if not editing, clear
    if (!initial) {
      setTitle("");
      setText("");
      setTags([]);
      setFavorite(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded-xl shadow">
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 mb-2 border rounded"
        placeholder="Prompt text..."
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <TagInput tags={tags} setTags={setTags} />
      <div className="flex items-center gap-3 mt-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
          <span className="text-sm">Favorite</span>
        </label>
        <button type="submit" className="ml-auto px-4 py-2 bg-green-600 text-white rounded">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
