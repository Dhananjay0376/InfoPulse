declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: "admin" | "sender" | "viewer";
      };
    }
  }
}

export {};
