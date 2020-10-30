const SERVER_IP = "193.151.128.53"

function getFormAsJson(formId) {
  const data = $(`#${formId}`).serializeArray().reduce(function(obj, item) {
    obj[item.name] = parseFloat(item.value)
    return obj
  }, {})
  return data
}

function resetNumbersForm() {
  $("#num1").val('')
  $("#num2").val('')
}

function resetLinenoForm() {
  $("#lineno").val('')
}

function setFormResult(formId, result) {
  $(`#${formId}_result_container`).removeClass("negative hidden")
  $(`#${formId}_result_container`).addClass("positive")
  $(`#${formId}_result`).text(result)
}

function setFormError(formName, message) {
  $(`#${formName}_result_container`).removeClass("positive hidden")
  $(`#${formName}_result_container`).addClass("negative")
  $(`#${formName}_result`).text(`Error: ${message}`)
}

function submitSHAForm(apiUrl) {
  if ($("#num1").val() === '' || $("#num2").val() === '') {
    setFormError('sha256', 'Please enter two valid numbers.')
    return
  }
  return $.getJSON({
      method: "POST",
      url: apiUrl,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(getFormAsJson("numbers_form"))
    })
    .done(function(response) {
      resetNumbersForm()
      setFormResult('sha256', `SHA hashed sum is ${response["sum"]}`)
    })
    .fail(function(e) {
      setFormError('sha256', e.responseJSON["message"])
    })
}

function submitLineNumberForm(apiUrl) {
  let lineno = $("#lineno").val()
  if (lineno === '') {
    setFormError('lineno', 'Please enter a number between 1 and 100.')
    return
  }
  try {
    lineno = parseInt(lineno)
  } catch (e) {
    setFormError('lineno', 'Please enter a number between 1 and 100.')
    return
  }
  return $.get({
      method: "GET",
      url: apiUrl,
      dataType: 'text',
      contentType: 'application/json;charset=UTF-8',
      data: { lineno }
    })
    .done(function(response) {
      resetLinenoForm()
      setFormResult('lineno', `Line ${lineno}: ${response}`)
    })
    .fail(function(e) {
      const message = JSON.parse(e.responseText).message
      setFormError('lineno', message)
    })
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
    submitSHAForm(`http://${SERVER_IP}/go/sha256/`)
  })

  $("#nodejs_sha").click(function() {
    submitSHAForm(`http://${SERVER_IP}/nodejs/sha256`)
  })

  $("#golang_lineno").click(function() {
    submitLineNumberForm(`http://${SERVER_IP}/go/write/`)
  })

  $("#nodejs_lineno").click(function() {
    submitLineNumberForm(`http://${SERVER_IP}/nodejs/write/`)
  })
})