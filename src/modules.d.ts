type GenericResponse<T> = {
  message: string;
  success?: boolean;
  error?: unknown;
  data: T;
};
