var n = document.querySelector("#jparticleground");
n && new Particleground.particle(n, {
    color: "rgba(255,255,255,0.5)",
    num: .1,
    minR: .1,
    maxR: 1,
    maxSpeed: 1,
    minSpeed: .3
})

function w3_open() {
    document.getElementById("mySidebar").style.display = "inline";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}

function jparticlegroundReponsive(reponsive) {
    if (reponsive.matches) { // If media query matches
        var n = document.querySelector("#jparticleground");
        n && new Particleground.particle(n, {
            color: "rgba(255,255,255,0.5)",
            num: .06,
            minR: .1,
            maxR: 1,
            maxSpeed: 1,
            minSpeed: .3
        })
    }
    //else {
    //     var n = document.querySelector("#jparticleground");
    //     n && new Particleground.particle(n, {
    //         color: "rgba(255,255,255,0.5)",
    //         num: .1,
    //         minR: .1,
    //         maxR: 1,
    //         maxSpeed: 1,
    //         minSpeed: .3
    //     })
    // }
}

// change Jparticleground when display on mobile
var reponsive = window.matchMedia("(max-width: 800px)")
jparticlegroundReponsive(reponsive) // Call listener function at run time
reponsive.addListener(jparticlegroundReponsive) // Attach listener function on state changes
reponsive.addListener(showDivs) // Attach listener function on state changes
//intro slides
var slideIndex = 0;
var introIndex = 0;

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var y = document.getElementsByClassName("intro");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        y[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) {
        slideIndex = 1
    }
    if (introIndex > y.length) {
        introIndex = 1
    }
    x[slideIndex - 1].style.display = "block";
    y[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 5000); // Change image every 2 seconds
}
carousel();

function toggleFunction() {
    var x = document.getElementById("navMobile");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function connectZalo() {
    window.open("https://zalo.me/0912347222");
}



// profile slides
var slideProfileIndex = 1;
showDivs(slideProfileIndex);

function plusDivs(n) {
    showDivs(slideProfileIndex += n);
    if (reponsive.matches) {
        if (slideProfileIndex > 6) {
            slideProfileIndex = 6;
            return;
        }
        if (slideProfileIndex < 1) {
            slideProfileIndex = 1;
            return;
        }
        console.log("slideProfileIndex is " + slideProfileIndex);
    } else {
        if (slideProfileIndex > 3) {
            slideProfileIndex = 3;
            return;
        }
        if (slideProfileIndex < 1) {
            slideProfileIndex = 1;
            return;
        }
        console.log("slideProfileIndex is " + slideProfileIndex);
    }

}

function showDivs(n) {
    var i;
    var j;
    var x = document.getElementsByClassName("myProfileSlides");
    if (reponsive.matches) {
        console.log(x.length);
        if (slideProfileIndex > 6 || slideProfileIndex < 1) {
            return;
        } else {
            if (n > x.length) {
                slideProfileIndex = 1;
            }
            if (n < 1) {
                slideProfileIndex = x.length;
            }
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            var lastProfileIndex = slideProfileIndex + 1;
            for (j = slideProfileIndex; j < slideProfileIndex + 1; j++) {
                console.log("j is " + j);
                console.log("n is " + n);
                x[j - 1].style.display = "block";
            }
        }
    } else {
        if (slideProfileIndex > 3 || slideProfileIndex < 1) {
            return;
        } else {
            if (n > x.length) {
                slideProfileIndex = 1;
            }
            if (n < 1) {
                slideProfileIndex = x.length;
            }
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            var lastProfileIndex = slideProfileIndex + 3;
            for (j = slideProfileIndex; j <= slideProfileIndex + 3; j++) {
                console.log("j is " + j);
                console.log("n is " + n);
                x[j - 1].style.display = "block";
            }
        }
    }

}