(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// API Client Configuration
// ============================================
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "api",
    ()=>api,
    "apiClient",
    ()=>apiClient,
    "clearAuthToken",
    ()=>clearAuthToken,
    "getAuthToken",
    ()=>getAuthToken,
    "setAuthToken",
    ()=>setAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8080/api") || "http://localhost:8080/api";
// Token management
let authToken = null;
const setAuthToken = (token)=>{
    authToken = token;
    if ("TURBOPACK compile-time truthy", 1) {
        if (token) {
            localStorage.setItem("authToken", token);
        } else {
            localStorage.removeItem("authToken");
        }
    }
};
const getAuthToken = ()=>{
    if (authToken) return authToken;
    if ("TURBOPACK compile-time truthy", 1) {
        authToken = localStorage.getItem("authToken");
    }
    return authToken;
};
const clearAuthToken = ()=>{
    setAuthToken(null);
};
// Build query string from params
const buildQueryString = (params)=>{
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value])=>{
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};
const apiClient = async (endpoint, config = {})=>{
    const { params, ...fetchConfig } = config;
    const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;
    const headers = {
        "Content-Type": "application/json"
    };
    // Merge existing headers if any
    if (fetchConfig.headers) {
        Object.entries(fetchConfig.headers).forEach(([key, value])=>{
            headers[key] = String(value);
        });
    }
    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(url, {
            ...fetchConfig,
            headers
        });
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
            clearAuthToken();
            // Redirect to login if on client side
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = "/auth/login";
            }
            throw new Error("Unauthorized - please login again");
        }
        // Parse response
        const data = await response.json().catch(()=>null);
        // Handle error responses
        if (!response.ok) {
            const error = {
                message: data?.message || response.statusText || "An error occurred",
                statusCode: response.status,
                errors: data?.errors
            };
            throw error;
        }
        return data;
    } catch (error) {
        // Re-throw ApiError objects
        if (error.statusCode) {
            throw error;
        }
        // Handle network errors
        throw {
            message: error.message || "Network error occurred",
            statusCode: 0
        };
    }
};
const api = {
    get: (endpoint, params)=>apiClient(endpoint, {
            method: "GET",
            params
        }),
    post: (endpoint, body, params)=>apiClient(endpoint, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
            params
        }),
    put: (endpoint, body, params)=>apiClient(endpoint, {
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
            params
        }),
    delete: (endpoint, params)=>apiClient(endpoint, {
            method: "DELETE",
            params
        }),
    patch: (endpoint, body, params)=>apiClient(endpoint, {
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
            params
        })
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Authentication API Service
// ============================================
__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const authApi = {
    /**
   * Register a new user (client)
   * POST /auth/register
   */ register: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/register", data);
    },
    /**
   * Login user and get JWT token
   * POST /auth/login
   */ login: async (credentials)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/login", credentials);
        // Store token after successful login
        if (response.token) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(response.token);
        }
        return response;
    },
    /**
   * Logout user and invalidate token
   * POST /auth/logout
   */ logout: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/logout");
            return response;
        } finally{
            // Always clear token on logout, even if request fails
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthToken"])();
        }
    },
    /**
   * Refresh JWT token
   * POST /auth/refresh
   */ refreshToken: async (refreshToken)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/refresh", {
            refreshToken
        });
        // Update stored token
        if (response.token) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(response.token);
        }
        return response;
    },
    /**
   * Check if user is authenticated
   */ isAuthenticated: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return !!localStorage.getItem("authToken");
    },
    /**
   * Get current user data from storage
   */ getCurrentUser: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const userData = localStorage.getItem("currentUser");
        return userData ? JSON.parse(userData) : null;
    },
    /**
   * Store current user data
   */ setCurrentUser: (user)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        }
    },
    /**
   * Clear current user data
   */ clearCurrentUser: ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem("currentUser");
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// User Management API Service
// ============================================
__turbopack_context__.s([
    "userApi",
    ()=>userApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const userApi = {
    /**
   * Get user profile by ID
   * GET /users/{userId}
   */ getUserProfile: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/users/${userId}`);
    },
    /**
   * Get all users with pagination and filtering (Admin only)
   * GET /users
   */ getAllUsers: async (params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/users", params);
    },
    /**
   * Update user profile
   * PUT /users/{userId}
   */ updateUserProfile: async (userId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/users/${userId}`, data);
    },
    /**
   * Approve pending user registration (Admin only)
   * PUT /users/{userId}/approve
   */ approveUser: async (userId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/users/${userId}/approve`, data);
    },
    /**
   * Reject pending user registration (Admin only)
   * PUT /users/{userId}/reject
   */ rejectUser: async (userId, reason)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/users/${userId}/reject`, {
            reason
        });
    },
    /**
   * Suspend user account (Admin only)
   * PUT /users/{userId}/suspend
   */ suspendUser: async (userId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/users/${userId}/suspend`, data);
    },
    /**
   * Unsuspend/reactivate user account (Admin only)
   * PUT /users/{userId}/unsuspend
   */ unsuspendUser: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/users/${userId}/unsuspend`);
    },
    /**
   * Delete user (soft delete - Admin only)
   * DELETE /users/{userId}
   */ deleteUser: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/users/${userId}`);
    },
    /**
   * Get pending user approvals (Admin only)
   * GET /users?status=PENDING
   */ getPendingApprovals: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/users", {
            status: "PENDING"
        });
    },
    /**
   * Search users by name or email (Admin only)
   * GET /users?search=query
   */ searchUsers: async (query)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/users", {
            search: query
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/accounts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Account Management API Service
// ============================================
__turbopack_context__.s([
    "accountApi",
    ()=>accountApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const accountApi = {
    /**
   * Get all accounts for a specific user
   * GET /accounts/user/{userId}
   */ getUserAccounts: async (userId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/accounts/user/${userId}`, params);
    },
    /**
   * Get single account details
   * GET /accounts/{accountId}
   */ getAccount: async (accountId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/accounts/${accountId}`);
    },
    /**
   * Create new account (Admin only)
   * POST /accounts
   */ createAccount: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/accounts", data);
    },
    /**
   * Update account details (Admin only)
   * PUT /accounts/{accountId}
   */ updateAccount: async (accountId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/accounts/${accountId}`, data);
    },
    /**
   * Close/delete account (Admin only)
   * DELETE /accounts/{accountId}
   * Note: Balance must be zero before closing
   */ closeAccount: async (accountId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/accounts/${accountId}`);
    },
    /**
   * Get account balance
   * GET /accounts/{accountId}/balance
   */ getAccountBalance: async (accountId)=>{
        const account = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/accounts/${accountId}`);
        return {
            balance: account.balance
        };
    },
    /**
   * Get active accounts for a user
   * GET /accounts/user/{userId}?status=ACTIVE
   */ getActiveAccounts: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/accounts/user/${userId}`, {
            status: "ACTIVE"
        });
    },
    /**
   * Get pending accounts for a user
   * GET /accounts/user/{userId}?status=PENDING
   */ getPendingAccounts: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/accounts/user/${userId}`, {
            status: "PENDING"
        });
    },
    /**
   * Suspend account (Admin only)
   * PUT /accounts/{accountId}
   */ suspendAccount: async (accountId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/accounts/${accountId}`, {
            status: "SUSPENDED"
        });
    },
    /**
   * Activate account (Admin only)
   * PUT /accounts/{accountId}
   */ activateAccount: async (accountId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/accounts/${accountId}`, {
            status: "ACTIVE"
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/transactions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Transaction Management API Service
// ============================================
__turbopack_context__.s([
    "transactionApi",
    ()=>transactionApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const transactionApi = {
    /**
   * Get all transactions for an account
   * GET /transactions/account/{accountId}
   */ getAccountTransactions: async (accountId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/account/${accountId}`, params);
    },
    /**
   * Get single transaction details
   * GET /transactions/{transactionId}
   */ getTransaction: async (transactionId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/${transactionId}`);
    },
    /**
   * Create new transaction (deposit, withdrawal, transfer)
   * POST /transactions
   */ createTransaction: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/transactions", data);
    },
    /**
   * Update transaction status (Admin only)
   * PUT /transactions/{transactionId}
   */ updateTransaction: async (transactionId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/transactions/${transactionId}`, data);
    },
    /**
   * Cancel/reverse transaction (Admin only)
   * DELETE /transactions/{transactionId}
   */ reverseTransaction: async (transactionId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/transactions/${transactionId}`);
    },
    /**
   * Make a deposit
   * POST /transactions
   */ deposit: async (accountId, amount, description)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/transactions", {
            accountId,
            type: "DEPOSIT",
            amount,
            description
        });
    },
    /**
   * Make a withdrawal
   * POST /transactions
   */ withdraw: async (accountId, amount, description)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/transactions", {
            accountId,
            type: "WITHDRAWAL",
            amount,
            description
        });
    },
    /**
   * Make a transfer
   * POST /transactions
   */ transfer: async (fromAccountId, toAccountId, amount, description)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/transactions", {
            accountId: fromAccountId,
            type: "TRANSFER",
            amount,
            description: `Transfer to account ${toAccountId}: ${description}`
        });
    },
    /**
   * Get transactions by type
   * GET /transactions/account/{accountId}?type={type}
   */ getTransactionsByType: async (accountId, type)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/account/${accountId}`, {
            type
        });
    },
    /**
   * Get transactions by date range
   * GET /transactions/account/{accountId}?startDate={startDate}&endDate={endDate}
   */ getTransactionsByDateRange: async (accountId, startDate, endDate)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/account/${accountId}`, {
            startDate,
            endDate
        });
    },
    /**
   * Get recent transactions
   * GET /transactions/account/{accountId}?limit=10
   */ getRecentTransactions: async (accountId, limit = 10)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/account/${accountId}`, {
            limit
        });
    },
    /**
   * Get transaction history with pagination
   * GET /transactions/account/{accountId}?page={page}&limit={limit}
   */ getTransactionHistory: async (accountId, page = 1, limit = 20)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/transactions/account/${accountId}`, {
            page,
            limit
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/loans.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Loan Management API Service
// ============================================
__turbopack_context__.s([
    "loanApi",
    ()=>loanApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const loanApi = {
    /**
   * Request a new loan
   * POST /loans
   */ requestLoan: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/loans", data);
    },
    /**
   * Get all loans for a specific user
   * GET /loans/user/{userId}
   */ getUserLoans: async (userId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/loans/user/${userId}`, params);
    },
    /**
   * Get single loan details
   * GET /loans/{loanId}
   */ getLoan: async (loanId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/loans/${loanId}`);
    },
    /**
   * Approve loan (Admin only)
   * PUT /loans/{loanId}/approve
   */ approveLoan: async (loanId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/loans/${loanId}/approve`, data);
    },
    /**
   * Reject loan (Admin only)
   * PUT /loans/{loanId}/reject
   */ rejectLoan: async (loanId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/loans/${loanId}/reject`, data);
    },
    /**
   * Disburse approved loan (Admin only)
   * POST /loans/{loanId}/disburse
   */ disburseLoan: async (loanId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/loans/${loanId}/disburse`, data);
    },
    /**
   * Update loan status (Admin only)
   * PUT /loans/{loanId}
   */ updateLoan: async (loanId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/loans/${loanId}`, data);
    },
    /**
   * Close/complete loan (Admin only)
   * DELETE /loans/{loanId}
   * Note: Balance must be fully repaid
   */ closeLoan: async (loanId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/loans/${loanId}`);
    },
    /**
   * Get pending loan requests (Admin only)
   * GET /loans?status=PENDING
   */ getPendingLoans: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/loans", {
            status: "PENDING"
        });
    },
    /**
   * Get approved loans (Admin only)
   * GET /loans?status=APPROVED
   */ getApprovedLoans: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/loans", {
            status: "APPROVED"
        });
    },
    /**
   * Get active loans for a user
   * GET /loans/user/{userId}?status=REPAYING
   */ getActiveLoans: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/loans/user/${userId}`, {
            status: "REPAYING"
        });
    },
    /**
   * Get completed loans for a user
   * GET /loans/user/{userId}?status=COMPLETED
   */ getCompletedLoans: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/loans/user/${userId}`, {
            status: "COMPLETED"
        });
    },
    /**
   * Get all loans (Admin only)
   * GET /loans
   */ getAllLoans: async (params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/loans", params);
    },
    /**
   * Calculate loan interest
   */ calculateLoanInterest: (principal, interestRate, months)=>{
        // Simple interest calculation: P * R * T
        return principal * interestRate * (months / 12);
    },
    /**
   * Calculate total loan repayment amount
   */ calculateTotalRepayment: (principal, interestRate, months)=>{
        const interest = principal * interestRate * (months / 12);
        return principal + interest;
    },
    /**
   * Calculate monthly payment
   */ calculateMonthlyPayment: (principal, interestRate, months)=>{
        const totalRepayment = principal + principal * interestRate * (months / 12);
        return totalRepayment / months;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/repayments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Repayment Management API Service
// ============================================
__turbopack_context__.s([
    "repaymentApi",
    ()=>repaymentApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const repaymentApi = {
    /**
   * Make a loan repayment
   * POST /repayments
   */ makeRepayment: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/repayments", data);
    },
    /**
   * Get all repayments for a specific loan
   * GET /repayments/loan/{loanId}
   */ getLoanRepayments: async (loanId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/repayments/loan/${loanId}`, params);
    },
    /**
   * Get single repayment details
   * GET /repayments/{repaymentId}
   */ getRepayment: async (repaymentId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/repayments/${repaymentId}`);
    },
    /**
   * Update repayment status (Admin only)
   * PUT /repayments/{repaymentId}
   */ updateRepayment: async (repaymentId, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/repayments/${repaymentId}`, data);
    },
    /**
   * Reverse/cancel repayment (Admin only)
   * DELETE /repayments/{repaymentId}
   */ reverseRepayment: async (repaymentId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/repayments/${repaymentId}`);
    },
    /**
   * Verify repayment (Admin only)
   * PUT /repayments/{repaymentId}
   */ verifyRepayment: async (repaymentId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/repayments/${repaymentId}`, {
            status: "VERIFIED"
        });
    },
    /**
   * Get recent repayments for a loan
   * GET /repayments/loan/{loanId}?limit=10
   */ getRecentRepayments: async (loanId, limit = 10)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/repayments/loan/${loanId}`, {
            limit
        });
    },
    /**
   * Get repayment history with pagination
   * GET /repayments/loan/{loanId}?page={page}&limit={limit}
   */ getRepaymentHistory: async (loanId, page = 1, limit = 20)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/repayments/loan/${loanId}`, {
            page,
            limit
        });
    },
    /**
   * Get total amount repaid for a loan
   */ getTotalRepaid: async (loanId)=>{
        const repayments = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/repayments/loan/${loanId}`);
        return repayments.reduce((total, repayment)=>repayment.status === "COMPLETED" ? total + repayment.amount : total, 0);
    },
    /**
   * Get pending repayments for verification (Admin only)
   * GET /repayments?status=PENDING
   */ getPendingRepayments: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/repayments", {
            status: "PENDING"
        });
    },
    /**
   * Make bank transfer repayment
   */ makeBankTransferRepayment: async (loanId, amount, reference)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/repayments", {
            loanId,
            amount,
            method: "BANK_TRANSFER",
            reference
        });
    },
    /**
   * Make mobile money repayment
   */ makeMobileMoneyRepayment: async (loanId, amount, reference)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/repayments", {
            loanId,
            amount,
            method: "MOBILE_MONEY",
            reference
        });
    },
    /**
   * Make cash repayment
   */ makeCashRepayment: async (loanId, amount, reference)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/repayments", {
            loanId,
            amount,
            method: "CASH",
            reference
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Notification Management API Service
// ============================================
__turbopack_context__.s([
    "notificationApi",
    ()=>notificationApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const notificationApi = {
    /**
   * Get all notifications for a user
   * GET /notifications/user/{userId}
   */ getUserNotifications: async (userId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, params);
    },
    /**
   * Get single notification details
   * GET /notifications/{notificationId}
   */ getNotification: async (notificationId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/${notificationId}`);
    },
    /**
   * Create/send notification (Admin only)
   * POST /notifications
   */ createNotification: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/notifications", data);
    },
    /**
   * Mark notification as read
   * PUT /notifications/{notificationId}
   */ markAsRead: async (notificationId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/notifications/${notificationId}`, {
            status: "READ"
        });
    },
    /**
   * Mark notification as unread
   * PUT /notifications/{notificationId}
   */ markAsUnread: async (notificationId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/notifications/${notificationId}`, {
            status: "UNREAD"
        });
    },
    /**
   * Archive notification
   * PUT /notifications/{notificationId}
   */ archiveNotification: async (notificationId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/notifications/${notificationId}`, {
            status: "ARCHIVED"
        });
    },
    /**
   * Delete notification
   * DELETE /notifications/{notificationId}
   */ deleteNotification: async (notificationId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/notifications/${notificationId}`);
    },
    /**
   * Get unread notifications
   * GET /notifications/user/{userId}?status=UNREAD
   */ getUnreadNotifications: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            status: "UNREAD"
        });
    },
    /**
   * Get read notifications
   * GET /notifications/user/{userId}?status=READ
   */ getReadNotifications: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            status: "READ"
        });
    },
    /**
   * Get notifications by type
   * GET /notifications/user/{userId}?type={type}
   */ getNotificationsByType: async (userId, type)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            type
        });
    },
    /**
   * Mark all notifications as read for a user
   */ markAllAsRead: async (userId)=>{
        const unreadNotifications = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            status: "UNREAD"
        });
        await Promise.all(unreadNotifications.map((notification)=>__TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/notifications/${notification.notificationId}`, {
                status: "READ"
            })));
    },
    /**
   * Get unread notification count
   */ getUnreadCount: async (userId)=>{
        const unreadNotifications = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            status: "UNREAD"
        });
        return unreadNotifications.length;
    },
    /**
   * Delete all read notifications
   */ deleteAllRead: async (userId)=>{
        const readNotifications = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications/user/${userId}`, {
            status: "READ"
        });
        await Promise.all(readNotifications.map((notification)=>__TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/notifications/${notification.notificationId}`)));
    },
    /**
   * Send custom notification (Admin only)
   */ sendCustomNotification: async (userId, message)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/notifications", {
            userId,
            type: "CUSTOM",
            message,
            relatedId: null
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/reports.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Reporting and Statement API Service
// ============================================
__turbopack_context__.s([
    "reportApi",
    ()=>reportApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
;
const reportApi = {
    /**
   * Get account mini-statement
   * GET /reports/statement/account/{accountId}
   */ getAccountStatement: async (accountId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/statement/account/${accountId}`, params);
    },
    /**
   * Get loan statement
   * GET /reports/statement/loan/{loanId}
   */ getLoanStatement: async (loanId, params)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/statement/loan/${loanId}`, params);
    },
    /**
   * Get user dashboard summary
   * GET /reports/dashboard/{userId}
   */ getUserDashboard: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/dashboard/${userId}`);
    },
    /**
   * Get admin dashboard summary
   * GET /reports/admin/dashboard
   */ getAdminDashboard: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/reports/admin/dashboard");
    },
    /**
   * Get account statement for date range
   * GET /reports/statement/account/{accountId}?startDate={startDate}&endDate={endDate}
   */ getAccountStatementByDateRange: async (accountId, startDate, endDate)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/statement/account/${accountId}`, {
            startDate,
            endDate
        });
    },
    /**
   * Get account statement as PDF
   * GET /reports/statement/account/{accountId}?format=pdf
   */ getAccountStatementPDF: async (accountId, params)=>{
        const response = await fetch(`/reports/statement/account/${accountId}?format=pdf${params?.startDate ? `&startDate=${params.startDate}` : ""}${params?.endDate ? `&endDate=${params.endDate}` : ""}`);
        return response.blob();
    },
    /**
   * Get loan statement as PDF
   * GET /reports/statement/loan/{loanId}?format=pdf
   */ getLoanStatementPDF: async (loanId)=>{
        const response = await fetch(`/reports/statement/loan/${loanId}?format=pdf`);
        return response.blob();
    },
    /**
   * Get monthly account statement
   */ getMonthlyAccountStatement: async (accountId, year, month)=>{
        const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
        const endDate = new Date(year, month, 0).toISOString().split("T")[0];
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/statement/account/${accountId}`, {
            startDate,
            endDate
        });
    },
    /**
   * Get yearly account statement
   */ getYearlyAccountStatement: async (accountId, year)=>{
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/statement/account/${accountId}`, {
            startDate,
            endDate
        });
    },
    /**
   * Get all user accounts summary
   * GET /reports/accounts/user/{userId}
   */ getUserAccountsSummary: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/accounts/user/${userId}`);
    },
    /**
   * Get user loans summary
   * GET /reports/loans/user/{userId}
   */ getUserLoansSummary: async (userId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/loans/user/${userId}`);
    },
    /**
   * Get admin statistics
   * GET /reports/admin/statistics
   */ getAdminStatistics: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/reports/admin/statistics");
    },
    /**
   * Get transaction summary for account
   */ getAccountTransactionSummary: async (accountId, startDate, endDate)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/reports/transactions/account/${accountId}`, {
            startDate,
            endDate
        });
    },
    /**
   * Export account statement
   */ exportAccountStatement: async (accountId, format, params)=>{
        const response = await fetch(`/reports/statement/account/${accountId}/export?format=${format}${params?.startDate ? `&startDate=${params.startDate}` : ""}${params?.endDate ? `&endDate=${params.endDate}` : ""}`);
        return response.blob();
    },
    /**
   * Get recent activity for admin
   */ getRecentActivity: async (limit = 20)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/reports/admin/activity", {
            limit
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Type Definitions for Microfinance Manager API
// ============================================
// ============================================
// Common Enums
// ============================================
__turbopack_context__.s([
    "AccountStatus",
    ()=>AccountStatus,
    "AccountType",
    ()=>AccountType,
    "LoanStatus",
    ()=>LoanStatus,
    "NotificationStatus",
    ()=>NotificationStatus,
    "NotificationType",
    ()=>NotificationType,
    "RepaymentMethod",
    ()=>RepaymentMethod,
    "RepaymentStatus",
    ()=>RepaymentStatus,
    "TransactionStatus",
    ()=>TransactionStatus,
    "TransactionType",
    ()=>TransactionType,
    "UserRole",
    ()=>UserRole,
    "UserStatus",
    ()=>UserStatus
]);
var UserStatus = /*#__PURE__*/ function(UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    return UserStatus;
}({});
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["CLIENT"] = "client";
    UserRole["ADMIN"] = "admin";
    return UserRole;
}({});
var AccountType = /*#__PURE__*/ function(AccountType) {
    AccountType["SAVINGS"] = "SAVINGS";
    AccountType["CURRENT"] = "CURRENT";
    return AccountType;
}({});
var AccountStatus = /*#__PURE__*/ function(AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["PENDING"] = "PENDING";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
    AccountStatus["CLOSED"] = "CLOSED";
    return AccountStatus;
}({});
var TransactionType = /*#__PURE__*/ function(TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["TRANSFER"] = "TRANSFER";
    TransactionType["REPAYMENT"] = "REPAYMENT";
    return TransactionType;
}({});
var TransactionStatus = /*#__PURE__*/ function(TransactionStatus) {
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["REVERSED"] = "REVERSED";
    TransactionStatus["FAILED"] = "FAILED";
    return TransactionStatus;
}({});
var LoanStatus = /*#__PURE__*/ function(LoanStatus) {
    LoanStatus["PENDING"] = "PENDING";
    LoanStatus["APPROVED"] = "APPROVED";
    LoanStatus["REJECTED"] = "REJECTED";
    LoanStatus["DISBURSED"] = "DISBURSED";
    LoanStatus["REPAYING"] = "REPAYING";
    LoanStatus["COMPLETED"] = "COMPLETED";
    return LoanStatus;
}({});
var RepaymentMethod = /*#__PURE__*/ function(RepaymentMethod) {
    RepaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    RepaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    RepaymentMethod["CASH"] = "CASH";
    RepaymentMethod["CARD"] = "CARD";
    return RepaymentMethod;
}({});
var RepaymentStatus = /*#__PURE__*/ function(RepaymentStatus) {
    RepaymentStatus["COMPLETED"] = "COMPLETED";
    RepaymentStatus["PENDING"] = "PENDING";
    RepaymentStatus["VERIFIED"] = "VERIFIED";
    RepaymentStatus["FAILED"] = "FAILED";
    return RepaymentStatus;
}({});
var NotificationStatus = /*#__PURE__*/ function(NotificationStatus) {
    NotificationStatus["UNREAD"] = "UNREAD";
    NotificationStatus["READ"] = "READ";
    NotificationStatus["ARCHIVED"] = "ARCHIVED";
    return NotificationStatus;
}({});
var NotificationType = /*#__PURE__*/ function(NotificationType) {
    NotificationType["ACCOUNT_APPROVED"] = "ACCOUNT_APPROVED";
    NotificationType["LOAN_APPROVED"] = "LOAN_APPROVED";
    NotificationType["LOAN_REJECTED"] = "LOAN_REJECTED";
    NotificationType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    NotificationType["CUSTOM"] = "CUSTOM";
    return NotificationType;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// ============================================
// Main API Export
// ============================================
// Export all API services
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$accounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/accounts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$transactions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/transactions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$loans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/loans.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$repayments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/repayments.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$reports$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/reports.ts [app-client] (ecmascript)");
// Export API client utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/client.ts [app-client] (ecmascript)");
// Re-export all types
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/types/index.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/lib/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Auth Context Provider for Global State
// ============================================
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuthContext",
    ()=>useAuthContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/lib/api/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Initialize auth state from storage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initAuth = {
                "AuthProvider.useEffect.initAuth": ()=>{
                    const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].getCurrentUser();
                    setUser(currentUser);
                    setLoading(false);
                }
            }["AuthProvider.useEffect.initAuth"];
            initAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (credentials)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login(credentials);
        __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].setCurrentUser(response);
        setUser(response);
        return response;
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].logout();
        } finally{
            __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].clearCurrentUser();
            setUser(null);
        }
    };
    const register = async (data)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].register(data);
    };
    const refreshAuth = ()=>{
        const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].getCurrentUser();
        setUser(currentUser);
    };
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshAuth
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/microfinancemanagerfrontend/lib/context/AuthContext.tsx",
        lineNumber: 73,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuthContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuthContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/microfinancemanagerfrontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/microfinancemanagerfrontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/microfinancemanagerfrontend/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.3.1";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// src/generic.ts
var DEV_SCRIPT_URL = "https://va.vercel-scripts.com/v1/script.debug.js";
var PROD_SCRIPT_URL = "/_vercel/insights/script.js";
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : PROD_SCRIPT_URL);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const finalParams = {
        ...Object.fromEntries(searchParams.entries()),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        ...params || {}
    };
    return {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        route: params ? computeRoute(path, finalParams) : null,
        path
    };
};
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$microfinancemanagerfrontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/microfinancemanagerfrontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/microfinancemanagerfrontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=microfinancemanagerfrontend_852a3486._.js.map