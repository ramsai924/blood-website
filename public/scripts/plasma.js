window.addEventListener("load", function () {
    const longifield = document.getElementById("longitudes");
    const latfield = document.getElementById("latitudes")

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position, errors)

        function position(loc) {
            const longitude = loc.coords.longitude;
            const latitude = loc.coords.latitude;

            longifield.value = longitude;
            latfield.value = latitude;
            console.log(longitude, latitude)
        }

        function errors(err) {
            document.getElementById("turnon").style.display = "block"
            document.getElementById("turnon1").style.display = "block"
            console.log(err)
        }
    } else {
        alert("Your browser does't support geo Location")
    }
})

function searchForm() {
    var bg = document.getElementById("bloodgroup")

    if (bg.value == "null") {
        alert("Please provide Blood group and try again!")
    }

}



$(document).ready(function () {

    $("#customlocation").click(function () {
        $("#custloc").show()
        $("#yourloc").hide()
        $("#inact").css({ "background-color": "white" })
        $("#upact").css({ "background-color": "grey" })
    })

    $("#Yourlocation").click(function () {
        $("#custloc").hide()
        $("#yourloc").show()
        $("#inact").css({ "background-color": "grey" })
        $("#upact").css({ "background-color": "white" })
    })

    $("#popup").css("height", "auto")

});