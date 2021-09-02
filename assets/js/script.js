const apiKey = 'BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC'
var arr = []    //1
var fictionArray = []
var nonFic = []
let fictionType = document.getElementById('fictionType');


// next api 
// fetch ("https://api.nytimes.com/svc/books/v3/lists/current/" + userSelection + ".json?api-key=" + nytKey)



fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`)
.then((response) => {
    return response.json();
  })
  .then((response) => {
      console.log(response)
    for (i = 0; i < response.results.length; i++) {
        // pushing the name and the code 
        arr.push({
            name: response.results[i].display_name,
            code: response.results[i].list_name_encoded,
             })
            }
    console.log(arr)
})
.then(() => {
        // separate Fiction | Nonfiction 
            for (i = 0; i < arr.length; i++) {
                if (!arr[i].name.includes('Fiction') &&
                    !arr[i].name.includes('Nonfiction') &&
                    !arr[i].name.includes('Hardcover') &&
                    !arr[i].name.includes('Paperback') &&
                    !arr[i].name.includes('E-book') &&
                    !arr[i].name.includes('Children’s') &&
                    !arr[i].name.includes('Young') &&
                    !arr[i].name.includes('Books')) {
                        let createdOption = document.createElement("option")
                        createdOption.setAttribute('value', arr[i].code)
                        createdOption.textContent = arr[i].name
                        fictionType.appendChild(createdOption)
                    }
            }
})
.catch(error => console.log(error))

fictionNonfiction.addEventListener('click', function(event)  {
    event.preventDefault()
    let fictionType = document.querySelector('#fictionType').value
    
})

