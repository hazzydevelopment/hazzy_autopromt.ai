import { useState } from "react";

export default function TagInput({ tags = [], setTags }) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const v = value.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setValue("");
      return;
    }
    setTags([...tags, v]);
    setValue("");
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const onKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-md border bg-white"
          placeholder="Add tag (press Enter)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
        <button onClick={addTag} className="px-3 py-1 bg-zinc-800 text-white rounded-md">Add</button>
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        {tags.map((t) => (
          <button key={t} onClick={() => removeTag(t)} className="px-2 py-1 bg-zinc-200 rounded text-xs">
            {t} ✕
          </button>
        ))}
      </div>
    </div>
  );
}
