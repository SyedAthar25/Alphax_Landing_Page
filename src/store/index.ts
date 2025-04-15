import { create } from "zustand";
// import { jwtDecode } from "jwt-decode"; // Enable if using real JWTs
import { DecodedJwt } from "types/auth.request";

type ROOT_DATA = {
  isStarting: boolean;
  isSignUp: boolean;
  isIn: boolean;
  isConfigSite: boolean;
  isPayment: boolean;
  confirmPayment: boolean;
  man: DecodedJwt | null;
  tk: string;
};

const INIT_DATA: ROOT_DATA = {
  isStarting: false,
  isSignUp: false,
  isIn: false,
  isConfigSite: false,
  isPayment: false,
  confirmPayment: false,
  man: null,
  tk: "",
};

interface rootStore {
  data: ROOT_DATA;
  toggleStarted: () => void;
  toggleSignUp: () => void;
  toggleConfigSite: () => void;
  togglePayment: () => void;
  confirmPayment: () => void;
  handleClientLogin: (accessToken: string) => void;
  handleClientLogout: () => void;
}

// 🧩 Full fallback guest JWT for type compatibility
const fallbackDecodedJwt: DecodedJwt = {
  sub: "guest-sub-id",
  email: "guest@example.com",
  email_verified: false,
  iss: "frappe-session",
  "cognito:username": "guest",
  origin_jti: "guest-origin-jti",
  aud: "guest-audience",
  event_id: "guest-event-id",
  token_use: "access",
  auth_time: 0,
  exp: 9999999999,
  iat: 0,
  jti: "guest-jti",
};

export const rootStore = create<rootStore>((set) => ({
  data: INIT_DATA,

  toggleStarted: () =>
    set((state) => ({
      data: { ...state.data, isStarting: !state.data.isStarting },
    })),

  toggleSignUp: () =>
    set((state) => ({
      data: { ...state.data, isSignUp: !state.data.isSignUp },
    })),

  toggleConfigSite: () =>
    set((state) => ({
      data: { ...state.data, isConfigSite: !state.data.isConfigSite },
    })),

  togglePayment: () =>
    set((state) => ({
      data: { ...state.data, isPayment: !state.data.isPayment },
    })),

  confirmPayment: () =>
    set((state) => ({
      data: { ...state.data, confirmPayment: true },
    })),

  handleClientLogin: (accessToken: string) =>
    set((state) => {
      localStorage.setItem("in", "true");
      localStorage.setItem("tk", accessToken);
      localStorage.setItem("man", JSON.stringify(fallbackDecodedJwt));

      return {
        data: {
          ...state.data,
          isIn: true,
          tk: accessToken,
          man: fallbackDecodedJwt,
        },
      };
    }),

  // Optional: use this instead if you switch to real JWTs
  /*
  handleClientLogin: (accessToken: string) =>
    set((state) => {
      localStorage.setItem("in", "true");
      localStorage.setItem("tk", accessToken);
      const acTokenDecoded = jwtDecode<DecodedJwt>(accessToken);
      localStorage.setItem("man", JSON.stringify(acTokenDecoded));

      return {
        data: {
          ...state.data,
          isIn: true,
          tk: accessToken,
          man: acTokenDecoded,
        },
      };
    }),
  */

  handleClientLogout: () => {
    localStorage.setItem("in", "false");
    localStorage.removeItem("tk");
    localStorage.removeItem("man");
    return set(() => ({ data: INIT_DATA }));
  },
}));
