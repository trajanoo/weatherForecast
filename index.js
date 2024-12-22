import express from "express";
import ejs from "ejs";
import axios from "axios";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./public");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Rota GET principal
app.get("/", (req, res) => {
    const { lat, lon } = req.query;

    if (lat && lon) {
        // Se as coordenadas foram passadas, buscar as informações do tempo
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fe5e3a471b1842442b4d9f3155b44dc2&units=metric&lang=pt`)
            .then((response) => {
                const skyDescription = response.data.weather[0].description;
                const icon = response.data.weather[0].icon;
                const cityName = response.data.name

                res.render("index.ejs", {
                    city: cityName,
                    weatherData: skyDescription,
                    weatherIcon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
                    error: null,
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar o clima atual:", error.message);
                res.render("index.ejs", {
                    weatherData: null,
                    weatherIcon: null,
                    error: "Erro ao buscar o clima atual.",
                });
            });
    } else {
        res.render("index.ejs", {
            weatherData: null,
            weatherIcon: null,
            error: "Localização não encontrada.",
        });
    }
});

app.listen(3000, () => {
    console.log("Server listening at 3000.");
});