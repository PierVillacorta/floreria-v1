  import type { ProductForm, Category } from "../../types/types";
interface ProductModalProps {
  mode: "edit" | "create";
  form: ProductForm;
  categories: Category[];
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

export const ProductModal = ({ mode, form, categories, saving, onChange, onSave }: ProductModalProps) => {
  return (
    <dialog id="modal_product" className="modal">
      <div className="modal-box bg-white text-brown-pc max-w-lg">
        <h3 className="font-bold text-lg uppercase mb-6">
          {mode === "edit" ? "Editar producto" : "Nuevo producto"}
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre *</label>
            <input
              name="product_name"
              value={form.product_name}
              onChange={onChange}
              placeholder="Nombre del producto"
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 text-brown-pc outline-none focus:border-brown-pc/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Precio *</label>
              <input name="price" type="number" min={0} value={form.price} onChange={onChange} className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock *</label>
              <input name="stock" type="number" min={0} value={form.stock} onChange={onChange} className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Stock crítico</label>
              <input name="critical_stock" type="number" min={0} value={form.critical_stock} onChange={onChange} className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Categoría *</label>
              <select name="category_id" value={form.category_id} onChange={onChange} className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none">
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">URL de imagen</label>
            <input name="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Descripción del producto" className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2 outline-none resize-none" />
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog"><button className="btn btn-ghost mr-2">Cancelar</button></form>
          <button onClick={onSave} disabled={saving} className="btn bg-amber-950 text-white hover:bg-amber-900 border-none disabled:opacity-50">
            {saving ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop"><button>Cerrar</button></form>
    </dialog>
  );
};