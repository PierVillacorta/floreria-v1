import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";
import { Loading } from "../../components/ui/Loading";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const AdminCategories = () => {
  const { categories, loading, fetchCategories } = useProductStore();
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      setFeedback({ success: false, message: "El nombre es obligatorio" });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`${API_URL}/auth/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: newName.trim() }),
      });

      const data = await res.json();

      if (data.status === "ALREADY_EXISTS") {
        setFeedback({ success: false, message: "Esa categoría ya existe" });
        return;
      }

      if (data.status !== "OK") {
        setFeedback({ success: false, message: "No se pudo crear la categoría" });
        return;
      }

      setNewName("");
      setFeedback({ success: true, message: "Categoría creada correctamente" });
      // Recargamos las categorías para que aparezca la nueva
      fetchCategories();
    } catch {
      setFeedback({ success: false, message: "Error de conexión" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase mb-2">Categorías</h1>
      <p className="text-brown-pc/60 mb-8">Gestión de categorías de productos</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Formulario nueva categoría */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold uppercase mb-6">Nueva categoría</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nombre *
              </label>
              <input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setFeedback(null);
                }}
                placeholder="Ej: Plantas de interior"
                className="w-full rounded-lg border border-brown-pc/20
                  bg-white-semi px-4 py-3 text-brown-pc outline-none
                  focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10
                  transition-all duration-300"
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <p className={`text-sm font-semibold ${
                feedback.success ? "text-green-600" : "text-red-500"
              }`}>
                {feedback.message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-amber-950 px-5 py-3
                font-semibold text-white transition-all duration-300
                hover:bg-amber-900 hover:scale-[1.01] active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Guardando..." : "CREAR CATEGORÍA"}
            </button>
          </form>
        </div>

        {/* Listado actual */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-bold uppercase mb-6">
            Categorías actuales
            <span className="ml-2 text-sm font-normal text-brown-pc/50">
              ({categories.length})
            </span>
          </h2>

          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li
                key={cat.category_id}
                className="flex items-center justify-between
                  rounded-xl bg-amber-50/60 px-4 py-3
                  border border-amber-900/10"
              >
                <span className="font-semibold">{cat.category_name}</span>
                <span className="text-xs text-brown-pc/40">
                  #{cat.category_id}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;