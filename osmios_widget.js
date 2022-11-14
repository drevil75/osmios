const boxId = "6005d07cca495d001be58ef1" // add your boxID
const temperatureAir = "6005d07cca495d001be58efc" //add your Air Temperatur SensorID
const humidityAir = "6005d07cca495d001be58efb"  //add your Air Humidity SensorID
const pm10 = "6005d07cca495d001be58ef7"  //add your pm10 dust SensorID
const pm25 = "6005d07cca495d001be58ef6"  //add your pm25 dust SensorID
const wind = "6005d07cca495d001be58ef2"  //add your pm25 dust SensorID

const apiUrl = (boxId) => `https://api.opensensemap.org/boxes/${boxId}`

let widget = await createWidget()
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
    const data = await new Request(apiUrl(boxId)).loadJSON()
    const name = data.name
    const lastUpdated = data.updatedAt
    const sensors = data.sensors

    if (!data || !data.name || !data.sensors) {
        const errorList = new ListWidget()
        errorList.addText("Keine Ergebnisse für den aktuellen Ort gefunden.")
        return errorList
    }

    const list = new ListWidget()

    if (Device.isUsingDarkAppearance()) {
        const gradient = new LinearGradient()
        gradient.colors = [
            new Color("111111"),
            new Color("222222")
        ]
        list.backgroundGradient = gradient
    }

    
    
    // Name of the Station - standard white
    const header = list.addText(name)
    header.font = Font.boldSystemFont(12)
    header.textColor = Color.green()

    // last refresh timestamp - small blue
    const date = new Date(lastUpdated)      
    var time = list.addText(date.toLocaleString())
    time.font = Font.mediumSystemFont(6)
    // time.textColor = Color.blue()

    // add space
    list.addSpacer(4)

    // temp. sensor
    let sensor = sensors.find(sensor => sensor._id == temperatureAir)
    let label = list.addText("Temp  " + sensor.lastMeasurement.value + "\xB0")
    label.font = Font.boldSystemFont(12)
    label.textColor = Color.blue()

    // humidity sensor
    sensor = sensors.find(sensor => sensor._id == humidityAir)
    label = list.addText("Humi   " + sensor.lastMeasurement.value + "%")
    label.font = Font.boldSystemFont(12)
    label.textColor = Color.yellow()
    
    // pm10 sensor
    sensor = sensors.find(sensor => sensor._id == pm10)
    label = list.addText("PM10  " + sensor.lastMeasurement.value)
    label.font = Font.boldSystemFont(12)
    label.textColor = Color.green()
    
    // pm25 sensor
    sensor = sensors.find(sensor => sensor._id == pm25)
    label = list.addText("PM25  " + sensor.lastMeasurement.value)
    label.font = Font.boldSystemFont(12)
    label.textColor = Color.green()
    
    // wind sensor
    sensor = sensors.find(sensor => sensor._id == wind)
    label = list.addText("wind  " + sensor.lastMeasurement.value + " km/h")
    label.font = Font.boldSystemFont(12)
    label.textColor = Color.blue()

    // // rain sensor
    // sensor = sensors.find(sensor => sensor._id == pm10)
    // // list.addText(sensor.title)
    // label = list.addText("PM10" + sensor.lastMeasurement.value)
    // label.font = Font.boldSystemFont(24)
    // label.textColor = Color.green()
    
    
    return list
}