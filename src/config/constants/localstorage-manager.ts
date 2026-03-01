import VITE_ENV from "./vite-env";

export default class LocalStorageManager {
  public static PREFIX = VITE_ENV.APP_NAME;
  public static TOKEN = `${LocalStorageManager.PREFIX}_Token`;
  public static REFRESH_TOKEN = `${LocalStorageManager.PREFIX}_RefreshToken`;
  public static IS_SIDEBAR_OPEN = `${LocalStorageManager.PREFIX}_IS_SIDEBAR_OPEN`;
}
