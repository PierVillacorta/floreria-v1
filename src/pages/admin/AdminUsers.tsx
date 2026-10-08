import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { UserModal } from "../../components/modals/UserModal";
import { CreateUserModal } from "../../components/modals/CreateUserModal";
import { useUserStore } from "../../store/usersStore";
import type { UserRow } from "../../types/types";

type NewUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role: string;
};
export const AdminUsers = () => {
  const { deleteUser, fetchUsers, updateUser, createUser, error, loading, users } =useUserStore();

  const [newUser, setNewUser] = useState<NewUserPayload>({
    full_name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setNewUser({ full_name: "", email: "", password: "", role: "CUSTOMER" });
    (document.getElementById("modal_create_user") as HTMLDialogElement)?.showModal();
  };

  const closeCreate = () => {(document.getElementById("modal_create_user") as HTMLDialogElement)?.close();};

  const handleNewUserChange = (field: keyof NewUserPayload, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreate = async () => {
    if (!newUser.full_name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }
    setCreating(true);
    const result = await createUser(newUser);
    setCreating(false);
    if (result.success) {
      closeCreate();
      setNewUser({ full_name: "", email: "", password: "", role: "CUSTOMER" });
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    const result = await deleteUser(id);
    if (!result.success) alert(result.message);
  };

  const handleEditOpen = (user: UserRow) => {
    setSelected({ ...user });
    (document.getElementById("modal_edit_user") as HTMLDialogElement)?.showModal();
  };

  const handleFieldChange = (field: keyof UserRow, value: string) => {
    if (!selected) return;
    setSelected({ ...selected, [field]: value });
  };

  const handleEditSave = async () => {
    if (!selected) return;
    setSaving(true);
    const result = await updateUser(selected.user_id, {
      full_name: selected.full_name,
      role: selected.role,
      account_status: selected.account_status,
    });
    setSaving(false);

    if (result.success) {
      (document.getElementById("modal_edit_user") as HTMLDialogElement)?.close();
      setSelected(null);
    } else {
      alert(result.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  const filterUsers = users.filter((u) => u.role !== "ADMIN");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase mb-2">Usuarios</h1>
          <p className="text-brown-pc/60">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="btn bg-amber-950 text-white hover:bg-amber-900 border-none font-semibold cursor-pointer"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {filterUsers.map((u) => (
              <tr key={u.user_id} className="hover:bg-amber-50/50 transition-colors">
                <td className="px-6 py-4 text-brown-pc/50">#{u.user_id}</td>
                <td className="px-6 py-4 font-semibold">{u.full_name}</td>
                <td className="px-6 py-4 text-brown-pc/70">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      u.role === "SELLER" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      u.account_status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.account_status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleEditOpen(u)}
                    className="text-amber-800 hover:text-amber-600 font-semibold text-xs uppercase cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.user_id)}
                    className="text-red-500 hover:text-red-700 font-semibold text-xs uppercase cursor-pointer"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición de usuario */}
      <UserModal
        selected={selected}
        saving={saving}
        onChange={handleFieldChange}
        onSave={handleEditSave}
      />

      {/* Modal de Creación de usuario */}
      <CreateUserModal
        newUser={newUser}
        creating={creating}
        onChange={handleNewUserChange}
        onClose={closeCreate}
        onCreate={handleCreate}
      />
    </>
  );
};