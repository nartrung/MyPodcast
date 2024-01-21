import { Request } from "express";

export interface createNewPlaylistRequest extends Request {
  body: {
    title: string;
  };
}

export interface updatePlaylistRequest extends Request {
  body: {
    title: string;
    playlistId: string;
    audioId: string;
    visibility: "public" | "private";
  };
}
