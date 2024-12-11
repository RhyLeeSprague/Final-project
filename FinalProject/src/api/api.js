// Base API URL
const API_BASE_URL = 'http://localhost:3000';

// Helper function for fetch requests
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }

    return response.json();
}

// Users
export const userAPI = {
    async getAllUsers() {
        return fetchAPI('/users');
    },
    async getUserById(userId) {
        return fetchAPI(`/users/${userId}`);
    },
    async createUser(userData) {
        return fetchAPI('/users', 'POST', userData);
    },
    async updateUser(userId, userData) {
        return fetchAPI(`/users/${userId}`, 'PUT', userData);
    },
    async deleteUser(userId) {
        return fetchAPI(`/users/${userId}`, 'DELETE');
    },
};

// Tasks
export const taskAPI = {
    async getAllTasks() {
        return fetchAPI('/tasks');
    },
    async getTaskById(taskId) {
        return fetchAPI(`/tasks/${taskId}`);
    },
    async createTask(taskData, token) {
        return fetchAPI('/tasks', 'POST', taskData, token);
    },
    async updateTask(taskId, taskData) {
        return fetchAPI(`/tasks/${taskId}`, 'PUT', taskData);
    },
    async deleteTask(taskId) {
        return fetchAPI(`/tasks/${taskId}`, 'DELETE');
    },
};

// Mood Tracker
export const moodAPI = {
    async getAllMoodTrackers() {
        return fetchAPI('/moodtrackers');
    },
    async getMoodTrackerById(moodTrackerId) {
        return fetchAPI(`/moodtrackers/${moodTrackerId}`);
    },
    async createMoodTracker(moodData, token) {
        return fetchAPI('/moodtrackers', 'POST', moodData, token);
    },
    async updateMoodTracker(moodTrackerId, moodData) {
        return fetchAPI(`/moodtrackers/${moodTrackerId}`, 'PUT', moodData);
    },
    async deleteMoodTracker(moodTrackerId) {
        return fetchAPI(`/moodtrackers/${moodTrackerId}`, 'DELETE');
    },
};

// Authentication
export const authAPI = {
    async register(userData) {
        return fetchAPI('/register', 'POST', userData);
    },
    async login(credentials) {
        return fetchAPI('/login', 'POST', credentials);
    },
    async getProfile(token) {
        return fetchAPI('/profile', 'GET', null, token);
    },
    async guestMode() {
        // Example guest mode implementation
        return fetchAPI('/guest-mode', 'POST'); 
        // Modify endpoint as per your server-side logic; this can simply initialize a guest session if needed.
    },
};

