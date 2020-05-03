"use strict";

var uploadbox = document.getElementById("drop-file-area");

var $fileInput = $("#file-input")

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
    $form.trigger('submit');
  });

$fileInput.on('change', function (e) {
  $form.trigger('submit');
});

$form.on('submit', function (e) {
  if ($form.hasClass('is-uploading')) return false;

  $form.addClass('is-uploading').removeClass('is-error');

  var ajaxData = new FormData($form.get(0));

  if (droppedFiles) {
    $.each(droppedFiles, function (i, file) {
      ajaxData.append($fileInput.attr('name'), file);
    });

    console.log(droppedFiles)
    $form.find('input[type="file"]').prop('files', droppedFiles);
  }

  console.log('Ajax Upload!')
  e.preventDefault()

  // $.ajax({
  //   url: $form.attr('action'),
  //   type: $form.attr('method'),
  //   data: ajaxData,
  //   dataType: 'json',
  //   cache: false,
  //   contentType: false,
  //   processData: false,
  //   complete: function () {
  //     $form.removeClass('is-uploading');
  //   },
  //   success: function (data) {
  //     $form.addClass(data.success == true ? 'is-success' : 'is-error');
  //     if (!data.success) $errorMsg.text(data.error);
  //   },
  //   error: function () {
  //     // Log the error, show an alert, whatever works for you
  //   }
  // });
  
});