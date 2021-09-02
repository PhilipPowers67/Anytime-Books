const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU";
var arr = [];
var bookSelection = [];
let bookType = document.getElementById("bookType");

// next api
// fetch ("https://api.nytimes.com/svc/books/v3/lists/current/" + userSelection + ".json?api-key=" + nytKey)

fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    console.log(response);
    for (i = 0; i < response.results.length; i++) {
      // pushing the name and the code
      arr.push({
        name: response.results[i].display_name,
        code: response.results[i].list_name_encoded,
      });
    }
    console.log(arr);
  })
  .then(() => {
    // filter list to leave only genre
    for (i = 0; i < arr.length; i++) {
      if (
        !arr[i].name.includes("Fiction") &&
        !arr[i].name.includes("Nonfiction") &&
        !arr[i].name.includes("Hardcover") &&
        !arr[i].name.includes("Paperback") &&
        !arr[i].name.includes("E-book") &&
        !arr[i].name.includes("Children’s") &&
        !arr[i].name.includes("Young") &&
        !arr[i].name.includes("Books")
      ) {
        let createdOption = document.createElement("option");
        createdOption.setAttribute("value", arr[i].code);
        createdOption.textContent = arr[i].name;
        bookType.appendChild(createdOption);
      }
    }
  })
  .catch((error) => console.log(error));

typeSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  let userSelection = document.querySelector("#bookType").value;
  console.log(userSelection);

  fetch(
    "https://api.nytimes.com/svc/books/v3/lists/current/" +
      userSelection +
      ".json?api-key=" +
      apiKey
  )
    .then((secondResponse) => {
      return secondResponse.json();
    })
    .then((secondResponse) => {
      console.log(secondResponse);
    });
});
