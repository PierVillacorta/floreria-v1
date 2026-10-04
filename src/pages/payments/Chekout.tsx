import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

export const Checkout = () => {
  const { cart, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Pre-llenamos con los datos del usuario si está logueado
  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    email:     user?.email ?? "",
    address:   user?.address ?? "",
    region:    user?.region ?? "",
    commune:   user?.commune ?? "",
    notes:     "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getTotal();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo cuando el usuario empieza a escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "El nombre es obligatorio";
    if (!form.email.trim())     newErrors.email = "El correo es obligatorio";
    if (!form.address.trim())   newErrors.address = "La dirección es obligatoria";
    if (!form.region.trim())    newErrors.region = "La región es obligatoria";
    if (!form.commune.trim())   newErrors.commune = "La comuna es obligatoria";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulamos el pago — 80% éxito, 20% fallo (como no hay pasarela real)
    const success = Math.random() > 0.2;

    if (success) {
      clearCart();
      navigate("/payment-success", { state: { form, total, cart } });
    } else {
      navigate("/payment-error", { state: { form, total, cart } });
    }
  };

  // Si el carrito está vacío, redirige a la tienda
  if (cart.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-white-semi text-brown-pc">
        <p className="text-2xl font-bold uppercase">Tu carrito está vacío</p>
        <Link to="/" className="mt-6 text-amber-950 font-semibold hover:underline">
          Volver a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Título */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Último paso
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase">Checkout</h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Resumen de productos */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold uppercase mb-4">
                Productos ({cart.length})
              </h2>
              <ul className="flex flex-col gap-3">
                {cart.map((p) => (
                  <li key={p.product_id} className="flex justify-between text-sm">
                    <span>{p.product_name} × {p.amount}</span>
                    <span className="font-semibold">
                      ${(p.price * p.amount).toLocaleString("es-CL")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Datos del cliente */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold uppercase mb-4">
                Información del cliente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Nombre completo *
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                      text-brown-pc outline-none focus:border-brown-pc/60
                      focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Correo *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                      text-brown-pc outline-none focus:border-brown-pc/60
                      focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold uppercase mb-4">
                Dirección de entrega
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Calle y número *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Ej: Av. Providencia 1234"
                    className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                      text-brown-pc outline-none focus:border-brown-pc/60
                      focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Región *
                    </label>
                    <input
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      placeholder="Ej: Región Metropolitana"
                      className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                        text-brown-pc outline-none focus:border-brown-pc/60
                        focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300"
                    />
                    {errors.region && (
                      <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Comuna *
                    </label>
                    <input
                      name="commune"
                      value={form.commune}
                      onChange={handleChange}
                      placeholder="Ej: Providencia"
                      className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                        text-brown-pc outline-none focus:border-brown-pc/60
                        focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300"
                    />
                    {errors.commune && (
                      <p className="text-red-500 text-xs mt-1">{errors.commune}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Indicaciones adicionales (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej: Dejar con el conserje, timbre 2"
                    className="w-full rounded-lg border border-brown-pc/20 bg-white-semi px-4 py-3
                      text-brown-pc outline-none focus:border-brown-pc/60
                      focus:ring-2 focus:ring-brown-pc/10 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-950 px-6 py-4 font-semibold
                tracking-wide text-white transition-all duration-300
                hover:bg-amber-900 hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              PAGAR ${total.toLocaleString("es-CL")}
            </button>
          </form>

          {/* Resumen lateral */}
          <aside className="h-fit rounded-2xl border border-amber-900/10 bg-amber-50/70 p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold uppercase mb-4">Resumen</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Productos</span>
              <span>{cart.length}</span>
            </div>
            <div className="h-px bg-brown-pc/10 my-4" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${total.toLocaleString("es-CL")}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

