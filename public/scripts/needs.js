//options change
var regulardata = document.getElementById("regulardata")
var plasmadata = document.getElementById("plasmadata")
var regulartag = document.getElementById("regular")
var plasmatag = document.getElementById("plasma")

plasmatag.addEventListener("click", () => {
    regulartag.classList.remove("active")
    plasmatag.classList.add("active")
    regulardata.style.display = "none";
    plasmadata.style.display = "block"
})

regulartag.addEventListener("click", () => {
    regulartag.classList.add("active")
    plasmatag.classList.remove("active")
    regulardata.style.display = "block";
    plasmadata.style.display = "none"
})



//show more action
var actions = document.getElementById("regulardata")

actions.addEventListener("click", (e) => {
    var target = e.target;
    // console.log(target.parentNode.childNodes)
    if (target.parentNode.childNodes[9].className === 'more') {
        $(target.parentNode.childNodes[9]).toggle("slow")
    }
})

var action2 = document.getElementById("plasmadata")

action2.addEventListener("click", (e) => {
    var target = e.target;
    console.log(target.parentNode.childNodes)
    if (target.parentNode.childNodes[9].className === 'more2') {
        $(target.parentNode.childNodes[9]).toggle("slow")
    }
});   





//navbar action
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";


        document.querySelector(".fa-times").style.display = "block"

    } else {
        x.className = "topnav";

        document.querySelector(".fa-times").style.display = "none"
    }
}
