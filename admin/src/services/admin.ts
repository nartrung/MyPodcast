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

export const verifyPodcast = async (id: string) => {
  try {
    const { data } = await axios.post(API_URL + `verify/${id}`, null, { headers: authHeader() });
    return data.message;
  } catch (error) {
    throw error;
  }
};

export const deletePodcast = async (id: string) => {
  try {
    const { data } = await axios.delete(API_URL + `delete/${id}`, { headers: authHeader() });
    return data;
  } catch (error) {
    throw error;
  }
};
