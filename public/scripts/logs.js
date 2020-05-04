const socket = io()

$output = $(".build-output")

socket.on(fileId, (data) => {
    $output.append(data)
    updateScroll()
})

var scrolled = false;
function updateScroll() {
    if (!scrolled) {
        var element = document.querySelector("body")
        window.scrollTo(0, element.scrollHeight)
    }
}

function getScroll(query) {
    var element = document.querySelector(query);
    console.log(element);
    console.log(element.scrollTop)
}

$(window).scroll(function () {
    if (Math.abs($(window).scrollTop() + $(window).height() - $(document).height()) < 50) {
        scrolled = false;
    } else {
        scrolled = true;
    }
});
