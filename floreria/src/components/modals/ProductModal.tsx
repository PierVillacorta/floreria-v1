import {  useRef } from "react";
import type { ProductForm, Category } from "../../types/types";

type ProductModalProps = {
  mode: "create" | "edit";
  form: ProductForm;
  categories: Category[];
  saving: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
};

export const ProductModal = ({
  mode,
  form,
  categories,
  saving,
  onChange,
  onSave,
}: ProductModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <dialog
      ref={dialogRef}
      id="modal_product"
      className="modal"
      role="dialog"
      aria-labelledby="product-modal-title"
    >
      <div className="modal-box bg-white text-brown-pc max-w-lg">
        <h3 id="product-modal-title" className="font-bold text-lg uppercase mb-4">
          {mode === "create" ? "Nuevo producto" : "Editar producto"}
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          {/* Nombre */}
          <div>
            <label htmlFor="product_name" className="block text-xs font-bold uppercase mb-1">Nombre *</label>
            <input
              type="text"
              name="product_name"
              value={form.product_name}
              onChange={onChange}
              placeholder="Nombre del producto"
              required
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-xs font-bold uppercase mb-1">Precio *</label>
              <input
              id="price"
                type="number"
                name="price"
                min="0"
                value={form.price === 0 ? "" : form.price}
                onChange={onChange}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                required
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-xs font-bold uppercase mb-1">Stock *</label>
              <input
              id="stock"
                type="number"
                name="stock"
                min="0"
                value={form.stock === 0 ? "" : form.stock}
                onChange={onChange}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                required
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
              />
            </div>
          </div>

          {/* Stock Crítico y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="critical_stock" className="block text-xs font-bold uppercase mb-1">Stock crítico</label>
              <input
                type="number"
                name="critical_stock"
                min="0"
                value={form.critical_stock === 0 ? "" : form.critical_stock}
                onChange={onChange}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-xs font-bold uppercase mb-1">Categoría *</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
              >
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL Imagen */}
          <div>
            <label htmlFor="image_url" className="block text-xs font-bold uppercase mb-1">URL de imagen</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={onChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              placeholder="Descripción del producto"
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-2.5 text-brown-pc outline-none focus:border-brown-pc/60 resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="modal-action flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="btn btn-ghost font-semibold text-brown-pc hover:bg-brown-pc/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn bg-amber-950 text-white hover:bg-amber-900 border-none font-semibold px-6"
            >
              {saving ? "Guardando..." : mode === "create" ? "Crear producto" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};