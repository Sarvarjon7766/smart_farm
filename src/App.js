import React, { useState, useEffect } from "react";
import axios from "./axios"; // Yangi axios instance'ni import qilish
import "./App.css"; // CSS faylini import qilish

function App() {
    const [dhtData, setDhtData] = useState(null);
    const [relayData, setRelayData] = useState(null);

    // DHT va relay ma'lumotlarini olish
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dhtResponse = await axios.get("/dht");
                setDhtData(dhtResponse.data[0]) // faqat bitta yozuvni olish
                const relayResponse = await axios.get("/relay");
                
                
                setRelayData(relayResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    // Relay holatini yangilash va avtomatik qayta olish
    const toggleRelay = async (key) => {
        try {
            // Relay holatini o'zgartirish
            const updatedRelayData = { ...relayData, [key]: !relayData[key] };

            // Serverga yangilangan ma'lumotni yuborish va javobni olish
            const relayResponse = await axios.post("/relay", updatedRelayData);

            // Serverdan qaytgan yangi holatni holatga qo'llash
            setRelayData(relayResponse.data); // Yangilangan holat bilan relayData'ni yangilash
            console.log("Relay holati yangilandi:", relayResponse.data);
        } catch (error) {
            console.error("Error updating relay", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Nazorat Jadvali</h1>
            {dhtData && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h2>{dhtData.title_molxona}</h2>
                        <p>Harorat: {dhtData.temperature_molxona}°C</p>
                        <p>Namlik: {dhtData.humidity_molxona}%</p>

                        <h2>{dhtData.title_issiqxona}</h2>
                        <p>Harorat: {dhtData.temperature_issiqxona}°C</p>
                        <p>Namlik: {dhtData.humidity_issiqxona}%</p>
                    </div>
                </div>
            )}

            <h1 className="text-center mb-4">Ishga tushirish bo'limi</h1>
            {relayData && (
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <button 
                            className={`btn btn-${relayData.molxona_temperature ? 'success' : 'danger'} btn-block`}
                            onClick={() => toggleRelay("molxona_temperature")}
                        >
                            Molxona Harorati: {relayData.molxona_temperature ? "ON" : "OFF"}
                        </button>
                    </div>
                    <div className="col-md-6 mb-3">
                        <button 
                            className={`btn btn-${relayData.molxona_humidity ? 'success' : 'danger'} btn-block`}
                            onClick={() => toggleRelay("molxona_humidity")}
                        >
                            Molxona Namligi: {relayData.molxona_humidity ? "ON" : "OFF"}
                        </button>
                    </div>
                    <div className="col-md-6 mb-3">
                        <button 
                            className={`btn btn-${relayData.issiqxona_temperature ? 'success' : 'danger'} btn-block`}
                            onClick={() => toggleRelay("issiqxona_temperature")}
                        >
                            Issiqxona Harorati: {relayData.issiqxona_temperature ? "ON" : "OFF"}
                        </button>
                    </div>
                    <div className="col-md-6 mb-3">
                        <button 
                            className={`btn btn-${relayData.issiqxona_humidity ? 'success' : 'danger'} btn-block`}
                            onClick={() => toggleRelay("issiqxona_humidity")}
                        >
                            Issiqxona Namligi: {relayData.issiqxona_humidity ? "ON" : "OFF"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
