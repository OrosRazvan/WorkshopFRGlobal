import type { AirplaneInformation } from "../types/AirplaneInformation";
import axios from "axios";

const API_KEY = "apv_48e8d574-6d3a-4af8-9c0e-a7b39634e664";
// Va trebui să pui URL-ul real al API-ului tău aici
const API_BASE_URL = "https://url-ul-api-ului-tau-aici.com/api"; 

export const getFlights = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights`);
        const airplaneInfromation: AirplaneInformation[] = response.data;
        console.log("Fetched flights:", airplaneInfromation);
        return airplaneInfromation;

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
    
};