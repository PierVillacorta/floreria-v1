import type { UserRow } from "../../types/types"; 

interface UserModalProps {
  selected: UserRow | null;
  saving: boolean;
  onChange: (field: keyof UserRow, value: string) => void;
  onSave: () => void;
}

export const UserModal = ({ selected, saving, onChange, onSave }: UserModalProps) => {
  return (
    <dialog id="modal_edit_user" className="modal">
      <div className="modal-box bg-white text-brown-pc">
        <h3 className="font-bold text-lg uppercase mb-6">Editar usuario</h3>

        {selected && (
          <div className="flex flex-col gap-4 ">
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre</label>
              <input
                value={selected.full_name}
                onChange={(e) => onChange("full_name", e.target.value)}
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Rol</label>
              <select
                value={selected.role}
                onChange={(e) => onChange("role", e.target.value)}
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none"
              >
                <option value="ADMIN">Admin</option>
                <option value="SELLER">Seller</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Estado</label>
              <select
                value={selected.account_status}
                onChange={(e) => onChange("account_status", e.target.value)}
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          </div>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost mr-2">Cancelar</button>
          </form>
          <button
            onClick={onSave}
            disabled={saving}
            className="btn bg-amber-950 text-white hover:bg-amber-900 border-none disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Cerrar</button>
      </form>
    </dialog>
  );
};