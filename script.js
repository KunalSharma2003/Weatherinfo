let input_box = document.getElementById("input-box");
let searchButton= document.getElementById("search-btn");
let location_btn = document.querySelector("#Location-btn");
const WeatherCardDiv = document.querySelector(".weather-card");
const CurrentWeatherDiv = document.querySelector(".current-weather");

const Api_key = "193548c39be28883e142490d7218d050";

const createWetherCard = (cityName,wetherItem,index)  => {
    if(index === 0){
        return ` <div class="details">
            <h2>${cityName}(${wetherItem.dt_txt.split(" ")[0]}) </h2>
            <h4>Temp: ${(wetherItem.main.temp - 273.15).toFixed(2)}C</h4>
            <h4>Wind: ${wetherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${wetherItem.main.humidity}</h4>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${wetherItem.weather[0].icon}@4x.png" alt="weather-image" >
                <h4>${wetherItem.weather[0].description}</h4>
            </div>`
    }
    return `
        <li class="card">
            <h2>(${wetherItem.dt_txt.split(" ")[0]}) </h2>
            <img src="https://openweathermap.org/img/wn/${wetherItem.weather[0].icon}@2x.png" alt="weather-image" >
            <h4>Temp: ${(wetherItem.main.temp - 273.15).toFixed(2)}C</h4>
            <h4>Wind: ${wetherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${wetherItem.main.humidity}</h4>
        </li>`
};

const getWeatherDetails = (cityName,lat,lon) => {
    Get_WeatherApi_Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Api_key}`;
    fetch(Get_WeatherApi_Url).then(res => res.json()).then(data =>{
         const uniqueForcastDays = [];
         const fiveDaysforecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForcastDays.includes(forecastDate)){
               return uniqueForcastDays.push(forecastDate);
            }
        });
        WeatherCardDiv.innerHTML ="";
        CurrentWeatherDiv.innerHTML ="";
        input_box.value = "";
        console.log(fiveDaysforecast);
        fiveDaysforecast.forEach((wetherItem,index)  => {
            if(index === 0){
                CurrentWeatherDiv.insertAdjacentHTML("beforeend",createWetherCard(cityName,wetherItem,index));
            }else{
                WeatherCardDiv.insertAdjacentHTML("beforeend",createWetherCard(cityName,wetherItem,index));
            }
           
        });
    }).catch(() =>{
        alert("Error occurred While Featching weather Forecast ");
    }); 
}
const getCityCordinates = () =>{
    const cityName = input_box.value.trim();
    Get_Api_Url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${Api_key}`;
    fetch(Get_Api_Url).then( res => res.json()).then( data => {
        if(!data) return console.log(`No result found for city: ${cityName}`);
        const {name , lat , lon} = data[0] ;
        getWeatherDetails(name,lat,lon);
        // console.log(data);
    }).catch(() =>{
        alert("Error occurred ");
    }); 
} 

const getuserCordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude} = position.coords;
            const REVERSE_GETCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${Api_key}`;
           
            fetch(REVERSE_GETCODING_URL).then( res => res.json()).then( data => {
               console.log(data);
               const {name} = data[0] ;
               getWeatherDetails(name,latitude,longitude);
            }).catch(() =>{
                alert("Error While fetchinh the City! ");
            });
        },
        error =>{
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request Denied. Please reset Location permission to grant access again.!");
            }
        }
    );
}

searchButton.addEventListener("click",getCityCordinates);
location_btn.addEventListener("click",getuserCordinates);
input_box.addEventListener("keyup", e => e.key === "Enter" && getCityCordinates());
