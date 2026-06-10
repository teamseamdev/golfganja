export type LiveRole = "viewer" | "creator";

export type LiveTokenRequest = {
  roomName: string;
  role: LiveRole;
};

export type LiveTokenResponse = {
  token: string;
  url: string;
  roomName: string;
  role: LiveRole;
};
