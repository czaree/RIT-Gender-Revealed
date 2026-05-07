// set distance at which an artifact will pop up as availble for viewing
const ARTIFACT_GEO_PROXIMITY = 25;
const artifactList = document.getElementById("artifactList");

// test artifact coordinate list
const artifacts = {
    0: {
        id: 0,
        name: "TEST ARTIFACT 0",
        lat: 1,
        long: 1
    },
    1: {
        id: 1,
        name: "TEST ARTIFACT 1",
        lat: 43.08026,
        long: -77.67923
    }
};

/**
 * automatically refresh GPS position of client device every 5s
 * for accurate geo-location
 */
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(latitude, longitude);
        checkProximity(latitude, longitude);
    },
    (error) => handleError(error),
    {
        enableHighAccuracy: true,
        maximumAge: 5000,          // accept cached position up to 5s old
        timeout: 10000             // timeout position fetch after 10s 
    }
);

function checkProximity(lat, long) {
    Object.entries(artifacts).forEach(([key, artifact]) => {
        const distance = haversine(lat, long, artifact.lat, artifact.long);
        console.log(key, distance);
        if (distance < ARTIFACT_GEO_PROXIMITY && !alreadyTriggered(key)) {
            markTriggered(key);
        } else {
            markUntriggered(key);
        }
    });
}

/**
 * uses the haversine formula to calculate the approximate direct shortest distance 
 * (i.e. "as the crow flies") between the two locations given as sets of latitude and longitude coordinates
 * 
 * @param lat1 latitute of the first location
 * @param {*} long1 longitude of the first location
 * @param {*} lat2 latitute of the second location
 * @param {*} long2 longitude of the second location
 */
function haversine(lat1, long1, lat2, long2) {
    const R = 6731;      // radius of the earth in km
    const toRad = (deg) => (deg * Math.PI) / 180; // convert degrees to radians

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(long2 - long1);

    const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    return distance;
}

/**
 * adds the location with the given id to the "triggered" list as available for 
 * display and shows the artifact card
 * 
 * @param id id of the location to mark as actively being triggered
 */
function markTriggered(id) {
    let triggered = JSON.parse(localStorage.getItem("triggeredLocations")) || {};
    triggered[id] = true;
    localStorage.setItem("triggeredLocations", JSON.stringify(triggered));

    showArtifactCard(id);
}

/**
 * removes the location with the given id from the "triggered" list and 
 * hides the artifact card
 * 
 * @param id id of the location to mark as actively being triggered
 */
function markUntriggered(id) {
    let triggered = JSON.parse(localStorage.getItem("triggeredLocations")) || {};
    triggered[id] = false;
    localStorage.setItem("triggeredLocations", JSON.stringify(triggered));

    hideArtifactCard(id);
}

function alreadyTriggered(id) {
    let triggered = JSON.parse(localStorage.getItem("triggeredLocations")) || {};
    return triggered[id]
}

function showArtifactCard(id) {
    let artifact = document.createElement("div")
    artifact.id = `artifact-${id}`
    artifact.innerHTML = `
        <h3>${artifacts[id].name}</h3>
        <p>${id}: at (${artifacts[id].lat}, ${artifacts[id].long})</p>
    `

    artifactList.appendChild(artifact);
}

function hideArtifactCard(id) {
    const artifact = document.getElementById(`artifact-${id}`);
    if (artifact) {
        artifactList.removeChild(artifact);
    }
}

function handleError(error) {
    console.error(error);
}