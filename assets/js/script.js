const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU";
var arr = [];
var bookInfo = [];
let bookType = document.getElementById("bookType");
var selectionContainer = document.querySelector("#viewSelection");

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
  bookInfo = [];
  let userSelection = document.querySelector("#bookType").value;
  console.log(userSelection);

  var pageLoad = function () {
    for (let i = 0; i < bookInfo.length; i++) {
      var bookContainer = document.createElement("div");
      bookContainer.classList =
        "book-container p-2 is-flex is-justify-content-center is-flex-direction-row is-flex-wrap-wrap column is-one-fifth";

      var bookCover = document.createElement("img");
      bookCover.classList = "book-cover is-text-align-center";
      bookCover.setAttribute("src", bookInfo[i].cover);
      bookContainer.appendChild(bookCover);

      var bookTitle = document.createElement("div");
      bookTitle.className = "column is-full is-centered";
      bookTitle.innerHTML = `<h2>${bookInfo[i].title}</h2>`;
      bookContainer.appendChild(bookTitle);

      var bookAuthor = document.createElement("div");
      bookAuthor.className = "column is-full is-centered";
      bookAuthor.innerHTML = `By ${bookInfo[i].author}`;
      bookContainer.appendChild(bookAuthor);

      // add a short description of the book
      var bookSnippet = document.createElement("div");
      bookSnippet.className = "column in-full is-centered";
      bookSnippet.innerHTML = bookInfo[i].snippet;
      bookContainer.appendChild(bookSnippet);

      selectionContainer.appendChild(bookContainer);
    }
  };
  // timeout allows the fetch request to complete prior to loading info on the screen
  setTimeout(pageLoad, 1500);

  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${userSelection}.json?api-key=${apiKey}`
  )
    .then((secondResponse) => {
      return secondResponse.json();
    })
    .then((secondResponse) => {
      console.log(secondResponse);

      for (i = 0; i < secondResponse.results.books.length; i++) {
        let isbn = secondResponse.results.books[i].primary_isbn13;
        let author = secondResponse.results.books[i].author;
        let title = secondResponse.results.books[i].title;
        let cover = secondResponse.results.books[i].book_image;

        fetch(
          "https://www.googleapis.com/books/v1/volumes?q=" +
            author +
            "+isbn:" +
            isbn +
            "&key=" +
            googleKey
        )
          .then((googleResponse) => {
            return googleResponse.json();
          })
          .then((googleResponse) => {
            console.log(googleResponse.items);
            // bug!!! when google does not provide information the books does not gets added to the screen
            let description = googleResponse.items[0].volumeInfo.description;
            let snippet = googleResponse.items[0].searchInfo.textSnippet;

            bookInfo.push({
              author: author,
              title: title,
              isbn: isbn,
              cover: cover,
              description: description,
              snippet: snippet,
            });
          })
          .then((ok) => {})
          .catch((err) => {
            description = "";
            snippet = "";
          });
      }
      console.log(bookInfo);
    });
});
