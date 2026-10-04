const ALLOWED_DOMAINS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com","@floreria.com"]

export const isValidEmail = (email: string): boolean => {
  const emailLower = email.toLowerCase().trim();
  return ALLOWED_DOMAINS.some((domain) => emailLower.endsWith(domain));
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 4 && password.length <= 10;
};