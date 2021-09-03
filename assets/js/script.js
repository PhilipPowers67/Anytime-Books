const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU";
var arr = [];
var bookInfoNyt = [];
var bookInfoGoogle = [];
let bookType = document.getElementById("bookType");
var selectionContainer = document.querySelector("#viewSelection");

// next api
// fetch ("https://api.nytimes.com/svc/books/v3/lists/current/" + userSelection + ".json?api-key=" + nytKey)

fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    // console.log(response);
    for (i = 0; i < response.results.length; i++) {
      // pushing the name and the code
      arr.push({
        name: response.results[i].display_name,
        code: response.results[i].list_name_encoded,
      });
    }
    // console.log(arr);
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
  selectionContainer.innerHTML = "";
  bookInfoNyt = [];
  bookInfoGoogle = [];
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

      for (i = 0; i < 10; i++) {
        // pushing the author, isbn, and cover link to array
        bookInfoNyt.push({
          author: secondResponse.results.books[i].author,
          title: secondResponse.results.books[i].title,
          isbn: secondResponse.results.books[i].primary_isbn13,
          cover: secondResponse.results.books[i].book_image,
        });
      }
      console.log(bookInfoNyt);

      for (let i = 0; i < bookInfoNyt.length; i++) {
        var bookContainer = document.createElement("div");
        bookInfoGoogle.className = "column is-one-fifth";

        var bookCover = document.createElement("img");
        bookCover.setAttribute("src", bookInfoNyt[i].cover);
        bookContainer.appendChild(bookCover);

        var bookTitle = document.createElement("div");
        bookTitle.className = "column is-full is-centered";
        bookTitle.innerHTML = bookInfoNyt[i].title;
        bookContainer.appendChild(bookTitle);

        var bookAuthor = document.createElement("div");
        bookAuthor.className = "column is-full is-centered";
        bookAuthor.innerHTML = "By " + bookInfoNyt[i].author;
        bookContainer.appendChild(bookAuthor);

        selectionContainer.appendChild(bookContainer);
      }

      //   for (i = 0; i < 10; i++) {
      //     fetch(
      //       "https://www.googleapis.com/books/v1/volumes?q=" +
      //         bookInfoNyt[i].author +
      //         "+isbn:" +
      //         bookInfoNyt[i].isbn +
      //         "&key=" +
      //         googleKey
      //     )
      //       .then((googleResponse) => {
      //         return googleResponse.json();
      //       })
      //       .then((googleResponse) => {
      //         console.log(googleResponse.items);

      //         bookInfoGoogle.push({
      //           description: googleResponse.items[0].volumeInfo.description,
      //           title: googleResponse.items[0].volumeInfo.title,
      //         });
      //       });
      //   //   }
      //   console.log(bookInfoGoogle);
    });
});
