export default function PromptCard({ prompt, onDelete, onEdit, onFav }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{prompt.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{new Date(prompt.createdAt || Date.now()).toLocaleString()}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button onClick={onFav} title="Toggle favorite" className={`text-xl ${prompt.favorite ? "text-yellow-500" : "text-gray-300"}`}>
            ★
          </button>
          <div className="flex gap-2">
            <button onClick={onEdit} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Edit</button>
            <button onClick={onDelete} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm whitespace-pre-wrap">{prompt.text}</p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {(prompt.tags || []).map((t) => (
          <span key={t} className="px-2 py-1 bg-zinc-100 rounded text-xs">{t}</span>
        ))}
      </div>
    </div>
  );
}
