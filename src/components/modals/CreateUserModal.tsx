type CreateUserModalProps = {
  newUser: { full_name: string; email: string; password: string; role: string };
  creating: boolean;
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onCreate: () => void;
};

export const CreateUserModal = ({
  newUser,
  creating,
  onChange,
  onClose,
  onCreate,
}: CreateUserModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <dialog id="modal_create_user" className="modal">
      <div className="modal-box bg-white text-brown-pc">
        <h3 className="font-bold text-lg mb-4">Crear Nuevo Usuario</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
            <input
              type="text"
              value={newUser.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
              placeholder="Nombre"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
              placeholder="correo@ejemplo.com"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => onChange("password", e.target.value)}
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
              placeholder="Contraseña"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Rol</label>
            <select
              value={newUser.role}
              onChange={(e) => onChange("role", e.target.value)}
              className="select select-bordered outline-none w-full text-sm bg-white-semi border-brown-pc/20 text-brown-pc"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="SELLER">SELLER</option>
            </select>
          </div>

          <div className="modal-action flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost" disabled={creating}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn bg-amber-950 text-white hover:bg-amber-900 border-none"
            >
              {creating ? "Guardando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};