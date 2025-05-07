import { useAuth } from "../contexts/AuthContext";

export function useApi() {
    const { authToken, getIdToken } = useAuth();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    async function getAuthHeaders() {
        // ensure token is latest
        const token = authToken || await getIdToken();
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    }

    async function fetchWithAuth(endpoint, options = {}) {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Sorry, something went wrong");
        }

        return response.json();
    }

    // Account operations
    async function getAccountDetails() {
        return fetchWithAuth("/account");
    }
    
    // get transactions
    async function getTransactions() {
        return fetchWithAuth("/transactions");
    }
    
    // transfer funds
    async function transferFunds(data) {
        return fetchWithAuth("/transfer", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    // admin operations
    async function getAllAccounts() {
        return fetchWithAuth("/admin/accounts");
    }

    async function updateAccountStatus(accountId, status) {
        return fetchWithAuth(`/admin/accounts/${accountId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });
    }
    // get all users
    async function getUsers() {
        return fetchWithAuth("/admin/users");
    }
    // get all transactions
    async function getAllTransactions() {
        return fetchWithAuth("/admin/transactions");
    }
    // get transactions for a user
    async function getTransactions(userId) {
        return fetchWithAuth(`/users/${userId}/transactions`);
    }
    // get a transaction details for a user
    async function getTransactionDetails(userId, transactionId) {
        return fetchWithAuth(`/users/${userId}/transactions/${transactionId}`);
    }
    // get all accounts
    async function getAllAccounts() {
        return fetchWithAuth("/admin/accounts");
    }
     return {
        getAccountDetails,
        getTransactions,
        transferFunds,
        getAllAccounts,
        updateAccountStatus,
        getUsers,
        getAllTransactions,
        getTransactionDetails,
     };
}