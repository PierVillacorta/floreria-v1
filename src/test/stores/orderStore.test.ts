import { useOrderStore } from "../../store/orderStore";
import { jsonResponse, makeOrder, makeOrderSummary } from "../helpers";

describe("orderStore", () => {
  beforeEach(() => useOrderStore.setState({ orders: [], loading: false, error: null }));
  afterEach(() => vi.restoreAllMocks());

  it("createOrder devuelve la orden creada", async () => {
    const order = makeOrder();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(order, 201));
    const res = await useOrderStore.getState().createOrder({
      customer_name: "Ana",
      customer_email: "ana@gmail.com",
      address: "Calle 1",
      region: "RM",
      commune: "Providencia",
      notes: "",
      items: [{ product_id: 1, quantity: 2 }],
    });
    expect(res).toEqual({ success: true, data: order });
  });

  it("fetchAllOrders y fetchMyOrders cargan el listado correspondiente", async () => {
    const summary = makeOrderSummary();
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([summary]));
    await useOrderStore.getState().fetchMyOrders();
    expect(spy.mock.lastCall![0]).toContain("/orders/me");
    expect(useOrderStore.getState().orders).toEqual([summary]);

    await useOrderStore.getState().fetchAllOrders();
    expect(spy.mock.lastCall![0]).toMatch(/\/orders$/);
  });

  it("fetchOrder obtiene el detalle por ID", async () => {
    const order = makeOrder({ order_id: 55 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(order));
    const res = await useOrderStore.getState().fetchOrder(55);
    expect(res).toEqual({ success: true, data: order });
  });
});