import { useEffect, useState } from "react";
import { Loading } from "../../components/ui/Loading";

type UserRow = {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/users`);
      const data = await res.json();
      setUsers(data.items);
    } catch {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "OK") {
        setUsers((prev) => prev.filter((u) => u.user_id !== id));
      }
    } catch {
      alert("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-brown-pc">{error}</p>;

  const filterUsers = users.filter((u) => u.role !== "ADMIN");

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase mb-2">Usuarios</h1>
      <p className="text-brown-pc/60 mb-8">Gestión de usuarios del sistema</p>

      <div className="rounded-2xl border border-amber-900/10 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brown-pc text-white-semi uppercase text-xs tracking-wider">
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
            {filterUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-brown-pc/60 font-medium text-base"
                >
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              filterUsers.map((u) => (
                <>
                  <tr
                    key={u.user_id}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-brown-pc/50">#{u.user_id}</td>
                    <td className="px-6 py-4 font-semibold">{u.full_name}</td>
                    <td className="px-6 py-4 text-brown-pc/70">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                    ${
                      u.role === "ADMIN"
                        ? "bg-amber-100 text-amber-800"
                        : u.role === "SELLER"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                    ${
                      u.account_status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                      >
                        {u.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(u.user_id)}
                        className="text-red-500 hover:text-red-700 font-semibold
                      text-xs uppercase transition-colors duration-200 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
