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
var $errorMsg = $(".box__error");

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
  e.preventDefault();
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

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: ajaxData,
    dataType: 'json',
    cache: false,
    contentType: false,
    processData: false,
    complete: function () {
      $form.removeClass('is-uploading');
    },
    success: function (data) {
      $form.addClass(data.success == true ? 'is-success' : 'is-error');

      if (!data.success) $errorMsg.text(data.message);

      if (data.success) window.location.replace('/logs/' + data.folderName)
    },
    error: function (xhr, status, error) {
      // Log the error, show an alert, whatever works for you
      $form.addClass('is-error');
      let data = JSON.parse(xhr.responseText);
      if (data.message) {
        $errorMsg.text(data.message);
      }
    }
  });
  
});