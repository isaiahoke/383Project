
let weekList;
const city = document.getElementById('city').value	

class Day{
    constructor(maintemp, low, high, description, humidity, clouds, windspeed, pressure, city, country, date, image){
        this.maintemp = maintemp;
        this.low = low;
        this.high = high;
        this.description = description;
        this.humidity = humidity;
        this.clouds = clouds;
        this.windspeed = windspeed;
        this.pressure = pressure;
        this.city = city;
        this.country = country;
        this.date = date;
        this.image = image;
    }
    getDay(data, i){
        return{
            maintemp: data.list[i].temp.day,
            low: data.list[i].temp.min,
            high: data.list[i].temp.max,
            description: data.list[i].weather[0].description,
            humidity: data.list[i].humidity,
            clouds:data.list[i].clouds,
            windspeed:data.list[i].speed,
            pressure:data.list[i].pressure,
            city:data.city.name,
            country:data.city.country,
            date:data.list[i].dt,
            image: data.list[i].weather[0].icon
        }
    }
    getWeek(data){
        let week = [];
        for(let i = 0; i < 7; i++){
            week.push(this.getDay(data, i))
        }
        return week
    }
    
}

	async function fetchWeather(city){
		const url = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&units=metric&cnt=7&lang=en&appid=c0c4a4b4047b97ebc5948ac9c48c0559'
        const options = {
            'method': 'GET',
			'Access-Control-Allow-Origin': '*', 
        }
        const response = await fetch(url, options)
        return response.json()
	}

	 function doGet(){
		fetchWeather(city).then((data)=>{
            const myDay = new Day()
            const day = myDay.getDay(data, 0)
		    const week = myDay.getWeek(data)
		   createLayout(day)
		   createForecast(week)
		  
		}).catch(error=>{
			console.log(error)
		})

	}

	function createLayout(day){
		let dayname = new Date(day.date * 1000).toLocaleDateString("en", {
						weekday: "long",
				    });
		let monthname = new Date(day.date * 1000).toLocaleDateString("en-US", { month: 'long' })
		let daynumber = new Date(day.date * 1000).toLocaleDateString('en', {day: "numeric"})
        
       // let days = calenderDate.getDay();
		const dateData = `<div class="date"> ${dayname}, ${monthname} ${daynumber}</div>
			              <div class="place"> ${day.city},  ${day.country}</div>`
		const loadedData = `<div class="wethear-now">
							
							<img src="http://openweathermap.org/img/wn/${day.image}@2x.png">
							<div class="temperature-sensor">${parseInt(day.maintemp)}°C</div>
							<div class="max-min-temperature">
								<span>Low: ${parseInt(day.low)}°C</span>
								<span>High: ${parseInt(day.high)}°C</span>
							</div>
						</div>


						<div class="climate">${day.description}</div>

						<div class="wethear-now-description">
							<div>
							
								<img src="/img/humidity.png" style="width:40px; height:40px;">
								<div>Humidity</div>
								<span>${day.humidity}%</span>
							</div>

							<div>
								<img src="/img/cloud.png" style="width:40px; height:40px;">
								<div>Clouds</div>
								<span>${day.clouds}%</span>
							</div>

							<div>
								<img src="/img/wind.png" style="width:40px; height:40px;">
								<div>Wind Speed</div>
								<span>${day.windspeed}KMPH</span>
							</div>
						</div>`

		document.getElementById('hold').innerHTML = loadedData
		document.getElementById('hold-date').innerHTML = dateData
	}

	function createForecast(week){
		document.getElementById('forecast-holder').innerHTML =''
		week.slice(1).forEach((day, index)=>{
			let dayname = new Date(day.date * 1000).toLocaleDateString("en", {
						weekday: "long",
			});
			let card = document.createElement('div')
            card.classList.add('day-wethear-item')
		    card.addEventListener('click', ()=>{
				switchContent(index + 1)
				document.body.scrollTop = 0;  
                document.documentElement.scrollTop = 0;  
			})
			card.innerHTML = `<div class="title">${dayname}</div>
				
								<img src="http://openweathermap.org/img/wn/${day.image}@2x.png">
				
								<div class="wethear-now">
									<div class="temperature-sensor">${parseInt(day.maintemp)}°C</div>
									<div class="max-min-temperature">
										<span>${parseInt(day.low)}°C</span>
										<span class="high">${parseInt(day.high)}°C</span>
									</div>
								</div>`
			document.getElementById('forecast-holder').appendChild(card)
			
		})
		weekList = week
	}

	
	function switchContent(i){
	    createLayout(weekList[i])
	}
	

	document.addEventListener("DOMContentLoaded", function(event) { 
      doGet()
	  setTimeout(function(){
        document.getElementById('flash').remove()
      }, 5000);
    });