type NewUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role: string;
};

interface CreateUserModalProps {
  newUser: NewUserPayload;
  creating: boolean;
  onChange: (field: keyof NewUserPayload, value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateUserModal = ({
  newUser,
  creating,
  onChange,
  onClose,
  onCreate,
}: CreateUserModalProps) => {
  const inputStyle = "w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3 text-brown-pc outline-none focus:border-brown-pc/60 focus:ring-2 focus:ring-brown-pc/10 transition-all"
  return (
    <dialog id="modal_create_user" className="modal">
      <div className="modal-box max-w-md bg-white text-brown-pc">
        <h3 className="font-bold text-lg mb-4 uppercase">Nuevo usuario</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre completo"
            className={inputStyle}
            value={newUser.full_name}
            onChange={(e) => onChange("full_name", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={inputStyle}
            value={newUser.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className={inputStyle}
            value={newUser.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <select
            className={inputStyle}
            value={newUser.role}
            onChange={(e) => onChange("role", e.target.value)}
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="SELLER">SELLER</option>
          </select>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={creating}>
            Cancelar
          </button>
          <button
            className="btn bg-amber-950 text-white hover:bg-amber-900 border-none cursor-pointer"
            onClick={onCreate}
            disabled={creating}
          >
            {creating ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Cerrar</button>
      </form>
    </dialog>
  );
};