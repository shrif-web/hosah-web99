const SERVER_IP = "193.151.128.53"

function getFormAsJson(formId) {
  const data = $(formId).serializeArray().reduce(function(obj, item) {
    obj[item.name] = parseFloat(item.value)
    return obj
  }, {})
  console.log(JSON.stringify(data))
  return data
}

function resetNumbersForm() {
  $("#num1").val('')
  $("#num2").val('')
}

function setSHAResult(sum) {
  $("#sha256_result_container").removeClass("hidden")
  $("#sha256_result").text(`SHA hashed sum is ${sum}`)
}

function setSHAError(message) {
  $("#sha256_result_container").removeClass("positive hidden")
  $("#sha256_result_container").addClass("negative")
  $("#sha256_result").text(`Error: ${message}`)
}

$(document).ready(function() {
  $('.message .close')
    .on('click', function() {
      $(this)
        .closest('.message')
        .transition('fade')
    })

  $("form").submit(function(e) {
    e.preventDefault()
  })

  $("#golang_sha").click(function() {
    $.getJSON({
        method: "POST",
        // url: `http://${SERVER_IP}/go/sha256/`,
        url: `http://127.0.0.1:8080/go/sha256/`,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(getFormAsJson("numbers_form"))
      })
      .done(function(response) {
        resetNumbersForm()
        setSHAResult(response["sum"])
      })
      .fail(function(e) {
        setSHAError(response["message"])
      })
  })
})

$("#golang_lineno").click(function() {
  $.getJSON({
    method: "POST",
    // url: `http://${SERVER_IP}/go/sha256/`,
    url: `http://127.0.0.1:8080/go/write/`,
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify(getFormAsJson("lineno_form"))
  })
  .done(function(response) {
    console.log(response)
  })
  .fail(function(e) {
    console.log(e)
  })
})