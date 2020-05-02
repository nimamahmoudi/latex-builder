var uploadbox = document.getElementById("drop-file-area");

$fileInput = $("#file-input")

// Prevent Default overlay behaviour
$("drop-file-overlay").on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
})

// Select file button
$("#select-file-text").on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
  e.preventDefault();
})
  .on('click', (e) => {
    e.preventDefault();
    $fileInput.trigger('click'); 
  })

// for drop behaviour
var $form = $("form");
var droppedFiles = false;

$form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
})
  .on('dragover dragenter', function () {
    $form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function () {
    $form.removeClass('is-dragover');
  })
  .on('drop', function (ev) {
    droppedFiles = ev.originalEvent.dataTransfer.files;
    console.log(droppedFiles[0].name)
  });