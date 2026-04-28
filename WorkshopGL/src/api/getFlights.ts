import type { AirplaneInformation } from "../types/AirplaneInformation";
import axios from "axios";

// Va trebui să pui URL-ul real al API-ului tău aici
const API_BASE_URL = "https://localhost:8080"; 

export const getFlights = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights/search`);
        const airplaneInfromation: AirplaneInformation[] = response.data;
        console.log("Fetched flights:", airplaneInfromation);
        return airplaneInfromation;

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
    
};