import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { UserModal } from "../../components/modals/UserModal";
import { CreateUserModal } from "../../components/modals/CreateUserModal";
import { useUserStore } from "../../store/usersStore";
import type { UserRow } from "../../types/types";

const defaultNewUser = { full_name: "", email: "", password: "", role: "CUSTOMER" };

export const AdminUsers = () => {
  const { deleteUser, fetchUsers, updateUser, createUser, error, loading, users } = useUserStore();

  const [form, setForm] = useState(defaultNewUser);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleModal = (id: string, open: boolean) => {
    const el = document.getElementById(id) as HTMLDialogElement;
    if (el) open ? el.showModal() : el.close();
  };

  const openCreate = () => {
    setForm(defaultNewUser);
    toggleModal("modal_create_user", true);
  };

  const openEdit = (user: UserRow) => {
    setSelected(user);
    toggleModal("modal_edit_user", true);
  };

  const handleCreate = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
      return alert("Todos los campos son obligatorios");
    }
    setIsSubmitting(true);
    const result = await createUser(form);
    setIsSubmitting(false);

    if (result.success) {
      toggleModal("modal_create_user", false);
      setForm(defaultNewUser);
    } else {
      alert(result.message);
    }
  };

  const handleEditSave = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    const result = await updateUser(selected.user_id, {
      full_name: selected.full_name,
      role: selected.role,
      account_status: selected.account_status,
    });
    setIsSubmitting(false);

    if (result.success) {
      toggleModal("modal_edit_user", false);
      setSelected(null);
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (user: UserRow) => {
  if (confirm(`¿Eliminar al usuario ${user.full_name}?`)) {
    const result = await deleteUser(user.user_id);
    if (!result.success) {
      alert(result.message);
    }
  }
};

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

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

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-white uppercase text-xs tracking-wider">
            <tr>
              {["ID", "Nombre", "Email", "Rol", "Estado", "Acciones"].map((h) => (
                <th key={h} className="px-6 py-4 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {users
              .filter((u) => u.role !== "ADMIN")
              .map((u) => (
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
                      onClick={() => openEdit(u)}
                      className="text-amber-800 hover:text-amber-600 font-semibold text-xs uppercase cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
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

      <UserModal
        selected={selected}
        saving={isSubmitting}
        onChange={(field, val) => selected && setSelected({ ...selected, [field]: val })}
        onSave={handleEditSave}
      />

      <CreateUserModal
        newUser={form}
        creating={isSubmitting}
        onChange={(field, val) => setForm((prev) => ({ ...prev, [field]: val }))}
        onClose={() => toggleModal("modal_create_user", false)}
        onCreate={handleCreate}
      />
    </>
  );
};