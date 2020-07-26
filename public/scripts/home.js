
$(document).ready(function () {

  $("#signin").click(function() {
    $("#sininform").show()
    $("#sinupform").hide()
    $("#inact").css({"background-color" : "white"})
    $("#upact").css({ "background-color": "grey" })
  })

  $("#signup").click(function () {
    $("#sininform").hide()
    $("#sinupform").show()
    $("#inact").css({ "background-color": "grey" })
    $("#upact").css({ "background-color": "white" })
  })

  $("#popup").css("height","auto")

});

