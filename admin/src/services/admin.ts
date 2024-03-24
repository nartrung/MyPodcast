import axios from "axios";
import authHeader from "./auth-header";
import { PodcastTypes } from "../components/Podcast";

const API_URL = "http://localhost:8080/admin/";

export const getPodcastToVerify = async (): Promise<PodcastTypes[]> => {
  try {
    const { data } = await axios.get(API_URL + "podcast", { headers: authHeader() });
    return data;
  } catch (error) {
    throw error;
  }
};
