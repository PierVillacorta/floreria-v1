import type { NewUserPayload } from "../../types/types";

type CreateUserModalProps = {
  newUser: NewUserPayload
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
              maxLength={50}
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
              placeholder="vendedor@floreria.com"
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
              placeholder="Ej: vend1234"
              autoComplete="new-password"
              minLength={4}
              maxLength={10}
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
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Dirección</label>
            <input
              type="text"
              value={newUser.address ?? ""}
              onChange={(e) => onChange("address", e.target.value)}
              className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
              placeholder="Av. Principal 123"
              maxLength={300}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Región</label>
              <input
                type="text"
                value={newUser.region ?? ""}
                onChange={(e) => onChange("region", e.target.value)}
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
                placeholder="Metropolitana"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Comuna</label>
              <input
                type="text"
                value={newUser.commune ?? ""}
                onChange={(e) => onChange("commune", e.target.value)}
                className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
                placeholder="Santiago"
                maxLength={100}
                required
              />
            </div>
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
