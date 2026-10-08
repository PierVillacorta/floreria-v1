

interface CategoryModalProps {

  editName: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

export const CategoryModal = ({  editName, saving, onChange, onSave }: CategoryModalProps) => {
  return (
    <dialog id="modal_edit_cat" className="modal">
      <div className="modal-box bg-white text-brown-pc">
        <h3 className="font-bold text-lg uppercase mb-6">Editar categoría</h3>
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre *</label>
          <input
            value={editName}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost mr-2">Cancelar</button>
          </form>
          <button
            onClick={onSave}
            disabled={saving}
            className="btn bg-amber-950 text-white hover:bg-amber-900 border-none disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Cerrar</button>
      </form>
    </dialog>
  );
};