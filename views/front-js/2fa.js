const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser)
var error = document.getElementById('error')

// 1.send data as JSON (popular in node)
// 2.send data as url encoded (popular in php)
async function registerUser(event){
    event.preventDefault()
    const token = document.getElementById('token').value

    
    const result = await fetch('/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token
        })
    }).then((res) => res.json())
    
    if (result.status === 'verified') {
        // everythign went fine
      //  window.location.href = "https://google.com";
      error.innerHTML = "<label class='alert alert-success' id='error' role='alert'>Token Verified!!</label>"
        //alert('Success')
    } else {
        //
        error.innerHTML = "<label class='alert alert-danger' id='error' role='alert'>Enter the correct code</label>"
        //alert('wrong')
    }
}