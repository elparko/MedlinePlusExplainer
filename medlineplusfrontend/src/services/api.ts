import { API_CONFIG } from '../config/api';

interface SearchParams {
    query: string;
    n_results?: number;
    language?: string;
}

interface PersonalInfo {
    user_id: string;
    age_range: string;
    gender: string;
    language: string;
}

export const apiService = {
    async search({ query, n_results = 5, language = 'English' }: SearchParams) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, n_results, language }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    },

    async getPersonalInfo(userId: string) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERSONAL_INFO}/${userId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get personal info error:', error);
            throw error;
        }
    },

    async createPersonalInfo(info: PersonalInfo) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERSONAL_INFO}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(info),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Create personal info error:', error);
            throw error;
        }
    },

    async testConnection() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_CONNECTION}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Test connection error:', error);
            throw error;
        }
    }
}; 