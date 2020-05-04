const socket = io()

$output = $(".build-output")

socket.on(fileId, (data) => {
    $output.append(data)
})
