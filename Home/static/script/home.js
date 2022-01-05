$(document).ready(function () {
    $(".post-module").hover(function () {
        $(this).find(".description").stop().animate({
                height: "toggle",
                opacity: "toggle"
            },
            300
        );
    });
});

var owl = $('#slider-1');
owl.owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    navText: [" ", " "],
    responsive: {
        0: {
            items: 2,
            nav: true
        },
        600: {
            items: 3,
            nav: false
        },
        1000: {
            items: 4,
            nav: true,
            loop: false
        }
    }
});
$('.play').on('click', function () {
    owl.trigger('play.owl.autoplay', [1000])
})
$('.stop').on('click', function () {
    owl.trigger('stop.owl.autoplay')
})
