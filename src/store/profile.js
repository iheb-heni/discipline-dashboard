import { get, set } from "./storage.js";

const KEY = "dd_profile";

export async function getProfile() {
  const res = await get([KEY]);
  return res[KEY] || { name: "" };
}

export function setProfile(profile) {
  return set({ [KEY]: profile });
}