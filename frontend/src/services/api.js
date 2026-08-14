import axios from "axios";

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    Accept: "application/json",
  },
});


/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

api.interceptors.response.use(

  (response) =>
    response,

  async (error) => {

    const originalRequest =
      error.config;


    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(
        "/auth/login"
      ) &&
      !originalRequest.url?.includes(
        "/auth/register"
      ) &&
      !originalRequest.url?.includes(
        "/auth/refresh"
      )
    ) {

      originalRequest._retry = true;


      const refreshToken =
        localStorage.getItem(
          "refresh_token"
        );


      if (!refreshToken) {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "user"
        );

        return Promise.reject(error);
      }


      try {

        const response =
          await axios.post(

            `${API_BASE_URL}/auth/refresh`,

            {},

            {
              headers: {
                Authorization:
                  `Bearer ${refreshToken}`,

                Accept:
                  "application/json",
              },
            }
          );


        const newAccessToken =
          response.data.access_token;


        const newRefreshToken =
          response.data.refresh_token;


        localStorage.setItem(
          "access_token",
          newAccessToken
        );


        if (newRefreshToken) {

          localStorage.setItem(
            "refresh_token",
            newRefreshToken
          );
        }


        originalRequest.headers =
          originalRequest.headers || {};


        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        return api(
          originalRequest
        );

      } catch (refreshError) {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "user"
        );

        window.location.href =
          "/login";

        return Promise.reject(
          refreshError
        );
      }
    }


    return Promise.reject(error);
  }
);


/* ============================================================
   API SERVICE
============================================================ */

export const apiService = {


  /* ================= REGISTER ================= */

  register: async (
    userData
  ) => {

    const response =
      await api.post(
        "/auth/register",
        userData
      );


    if (
      response.data.access_token
    ) {

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );
    }


    if (
      response.data.refresh_token
    ) {

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );
    }


    return response.data;
  },


  /* ================= LOGIN ================= */

  login: async (
    userData
  ) => {

    const response =
      await api.post(
        "/auth/login",
        userData
      );


    const data =
      response.data;


    if (data.access_token) {

      localStorage.setItem(
        "access_token",
        data.access_token
      );
    }


    if (data.refresh_token) {

      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );
    }


    return data;
  },


  /* ================= CURRENT USER ================= */

  getCurrentUser: async () => {

    const response =
      await api.get(
        "/auth/me"
      );


    localStorage.setItem(
      "user",
      JSON.stringify(
        response.data
      )
    );


    return response.data;
  },


  /* ================= REFRESH ================= */

  refreshToken: async () => {

    const refreshToken =
      localStorage.getItem(
        "refresh_token"
      );


    if (!refreshToken) {

      throw new Error(
        "Refresh token not found"
      );
    }


    const response =
      await axios.post(

        `${API_BASE_URL}/auth/refresh`,

        {},

        {
          headers: {
            Authorization:
              `Bearer ${refreshToken}`,

            Accept:
              "application/json",
          },
        }
      );


    localStorage.setItem(
      "access_token",
      response.data.access_token
    );


    if (
      response.data.refresh_token
    ) {

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );
    }


    return response.data;
  },


  /* ================= LOGOUT ================= */

  logout: async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } catch (error) {

      console.warn(
        "Logout request failed:",
        error
      );

    } finally {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );
    }
  },


  /* ================= AUTH CHECK ================= */

  isAuthenticated: () => {

    return Boolean(
      localStorage.getItem(
        "access_token"
      )
    );
  },


  /* ================= STORED USER ================= */

  getStoredUser: () => {

    const user =
      localStorage.getItem(
        "user"
      );


    if (!user) {
      return null;
    }


    try {

      return JSON.parse(
        user
      );

    } catch {

      return null;
    }
  },


  /* ================= ANALYSIS LIST ================= */

  getAnalyses: async () => {

    const response =
      await api.get(
        "/analysis"
      );

    return response.data;
  },


  /* ================= SINGLE ANALYSIS ================= */

  getAnalysis: async (
    id
  ) => {

    const response =
      await api.get(
        `/analysis/${id}`
      );

    return response.data;
  },


  /* ================= CREATE ANALYSIS ================= */

  createAnalysis: async (
    data
  ) => {

    const response =
      await api.post(
        "/analysis",
        data
      );

    return response.data;
  },


  /* ================= UPLOAD RESUME ================= */

  uploadResume: async (
    file
  ) => {

    const formData =
      new FormData();


    formData.append(
      "file",
      file
    );


    const response =
      await api.post(
        "/analysis/upload",
        formData
      );


    return response.data;
  },


  /* ================= DELETE ================= */

  deleteAnalysis: async (
    id
  ) => {

    const response =
      await api.delete(
        `/analysis/${id}`
      );

    return response.data;
  },
};


export default api;