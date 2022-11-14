const boxId = "" // add your boxID
const phenomenonId = "" //add your sensorID
const apiUrl = (boxId) => `https://api.opensensemap.org/boxes/${boxId}`

let widget = await createWidget()
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
    const data = await new Request(apiUrl(boxId)).loadJSON()

    if (!data || !data.name || !data.sensors) {
        const errorList = new ListWidget()
        errorList.addText("Keine Ergebnisse für den aktuellen Ort gefunden.")
        return errorList
    }

    const name = data.name

    const sensors = data.sensors
    const sensor = sensors.find(sensor => sensor._id == phenomenonId)
    const list = new ListWidget()

    if (Device.isUsingDarkAppearance()) {
        const gradient = new LinearGradient()
        gradient.colors = [
            new Color("111111"),
            new Color("222222")
        ]
        list.backgroundGradient = gradient
    }

    const header = list.addText(name)
    header.font = Font.mediumSystemFont(13)

    list.addSpacer()
    list.addText(sensor.title)
    const label = list.addText(sensor.lastMeasurement.value)
    label.font = Font.boldSystemFont(24)
    label.textColor = Color.green()
    var timeStamp = sensor.lastMeasurement.createdAt
    const date = new Date(timeStamp)      
    var time = list.addText(date.toLocaleString())
    time.font = Font.boldSystemFont(8)
    time.textColor = Color.blue()
    return list
}