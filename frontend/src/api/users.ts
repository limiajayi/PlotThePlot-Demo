/* eslint-disable @typescript-eslint/no-explicit-any */

type ApiFetch = (path: string, options?: RequestInit) => Promise<any>;

export const createUsersService = (apiFetch: ApiFetch) => ({

    deleteAccount: (userId: string) => {
        return apiFetch(`/api/users/${userId}/account`, { method: 'DELETE' });
    }

});