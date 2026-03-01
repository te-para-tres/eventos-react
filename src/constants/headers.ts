import LocalStorageManager from "@/config/constants/localstorage-manager";

export const getAuthorizationHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(
    LocalStorageManager.TOKEN
  )}`.replace('"', ""),
});
