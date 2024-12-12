export const API_CONFIG = {
    BASE_URL: import.meta.env.PROD 
        ? 'https://plainmed.vercel.app/api'  // Production URL
        : 'http://localhost:3001',           // Development URL
    ENDPOINTS: {
        SEARCH: '/search',
        PERSONAL_INFO: '/personal-info',
        TEST_DB: '/test-db-language',
        TEST_CONNECTION: '/test-supabase'
    }
}; 