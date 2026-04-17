export const BASE_URL = "https://localhost:8000"

export const API_PATHES = {
    AUTH : {
        LOGIN: "/api/v1/auth/login",
        REGISTER:"/api/v1/auth/register",
        GET_USER_INFO:"/api/v1/auth/user-info"
    },
    DASHBOARD : {
        GET_DATA:"/api/v1/dashboard"
    },
    INCOME : {
        ADD_INCOME: "/api/v1/income/add-income",
        GET_ALL_INCOME: "/api/v1/income/get-all-income",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/v1/income/download-excel"
    },
    EXPENSE : {
        ADD_EXPENSE: "/api/v1/expense/add-expense",
        GET_ALL_EXPENSE: "/api/v1/expense/get-all-expense",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DONWLOAD_EXPENSE: "/api/v1/expense/download-excel"
    },
    AQUESTIONS : {
        ADD_AQUESTION: "/api/v1/aqusetions/add",
        GET_ALL_AQUESTION: "/api/v1/aqusetions/get",
        DELETE_AQUESTION: (aqusetionsId) => `/api/v1/aqusetions/${aqusetionsId}`
    },
    
}