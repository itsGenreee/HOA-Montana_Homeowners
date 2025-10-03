import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const saveToken = async (token: string) => {
  if (__DEV__) {
    console.log("🔐 [TokenStorage] SAVING token:", token ? `${token.substring(0, 10)}...` : 'NULL');
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const retrieveToken = async () => {
  if (__DEV__) {
    console.log("🔐 [TokenStorage] RETRIEVING Token...");
  }
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (__DEV__) {
    if (token){
      console.log("🔐 [TokenStorage] RETRIEVED Token:", token ? `${token.substring(0, 10)}...` : 'NULL');
  } else {
      console.log("🔐 [TokenStorage] The token doesnt exist!");
    }
  }

  return token;
};

export const clearToken = async () => {
  if (__DEV__) {
    console.log("[TokenStorage] Deleting Token...");
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  if (__DEV__) {
    console.log("[TokenStorage] Token Deleted!");
  }
};