const socket = io()

$output = $(".build-output")

socket.on(fileId, (data) => {
    $output.append(data)
    updateScroll()
})

socket.on(fileId + '/dump', (data) => {
    $output.text(data)
    scrollToEnd()
})

socket.emit('ready', fileId)


// Scroll functionality
var scrolled = false;

function scrollToEnd() {
    var element = document.querySelector("body")
    window.scrollTo(0, element.scrollHeight)
}

function updateScroll() {
    if (!scrolled) {
        scrollToEnd()
    }
}

function getScroll(query) {
    var element = document.querySelector(query);
    console.log(element);
    console.log(element.scrollTop)
}

$(window).scroll(function () {
    if (Math.abs($(window).scrollTop() + $(window).height() - $(document).height()) < 100) {
        scrolled = false;
    } else {
        scrolled = true;
    }
});
