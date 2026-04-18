export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/user-info",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add-income",
    GET_ALL_INCOME: "/api/v1/income/get-all-income",
    DELETE_INCOME: (id) => `/api/v1/income/${id}`,
    DOWNLOAD_INCOME: "/api/v1/income/download-excel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add-expense",
    GET_ALL_EXPENSE: "/api/v1/expense/get-all-expense",
    DELETE_EXPENSE: (id) => `/api/v1/expense/${id}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/download-excel",
  },
  ACQUISITIONS: {
    ADD: "/api/v1/aqusetions/add",
    GET_ALL: "/api/v1/aqusetions/get",
    DELETE: (id) => `/api/v1/aqusetions/${id}`,
  },
};