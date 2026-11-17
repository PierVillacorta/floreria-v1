export const formatCLP = (amount: number): string =>
  `$${amount.toLocaleString("es-CL")}`; // devuelve como pesos chilenos


export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });// devuelve una fecha local cl
