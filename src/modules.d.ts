type GenericResponse<T> = {
  message: string;
  success?: boolean;
  error?: unknown;
  data: T;
  meta: {
    total?: number;
    hasMore?: boolean;
  };
};
