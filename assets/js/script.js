const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU";
var arr = [];
var bookInfoNyt = [];
var bookInfoGoogle = [];
let saveButton = document.querySelector('.saveBook')
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
  // console.log(userSelection);

  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${userSelection}.json?api-key=${apiKey}`
    )
    .then((secondResponse) => {
      return secondResponse.json();
    })
    .then((secondResponse) => {
      // console.log(secondResponse);

      for (i = 0; i < 10; i++) {
        // pushing the author, isbn, and cover link to array
        bookInfoNyt.push({
          author: secondResponse.results.books[i].author,
          title: secondResponse.results.books[i].title,
          isbn: secondResponse.results.books[i].primary_isbn13,
          cover: secondResponse.results.books[i].book_image,
        });
      }
      // console.log(bookInfoNyt);
      appendBooks()
    });
});


appendBooks = () => {
  for (let i = 0; i < bookInfoNyt.length; i++) {
    let bookContainer = document.createElement("div");
      bookContainer.classList = 'book-container p-2 m-5 is-flex is-justify-content-center is-flex-direction-row is-flex-wrap-wrap column is-one-fifth'
    let bookCover = document.createElement("img");
      bookCover.classList = 'book-cover is-text-align-center'
      bookCover.setAttribute("src", bookInfoNyt[i].cover);
      bookContainer.appendChild(bookCover);
    let bookTitle = document.createElement("div");
      bookTitle.className = "column is-full is-centered";
      bookTitle.innerHTML = `<h2>${bookInfoNyt[i].title}</h2>`;
      bookContainer.appendChild(bookTitle);
    let bookAuthor = document.createElement("div");
      bookAuthor.className = "column is-full is-centered";
      bookAuthor.innerHTML = `${bookInfoNyt[i].author}`;
      bookContainer.appendChild(bookAuthor);
    let saveButton = document.createElement('button')
      saveButton.classList = 'saveBook is-fullwidth p-1 m-2'
      saveButton.textContent = 'Add to Favorites'
        bookContainer.appendChild(saveButton)

    selectionContainer.appendChild(bookContainer);
  }
}

// SAVE TO LOCALSTORAGE
addToFav = () => {
  let saveBook = document.querySelector('.saveBook')
  let title = saveBook.parentNode.childNodes[1].firstChild.textContent
  let author = saveBook.parentNode.childNodes[2].firstChild.textContent
  let newItem = {title: title, author: author}
  console.log(newItem)
  var retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || []

  if (retrievedData.length > 0) {
    var checkSavedBooks = localStorage.getItem('savedBooks')
    for (i = 0; i < retrievedData.length; i++) {
      if (!checkSavedBooks[i].includes(newItem.title)) {
      }
      debugger
      if (!checkSavedBooks[i].includes(newItem.title) && retrievedData.length === i) {
        debugger
        retrievedData.push(newItem)
        localStorage.setItem('savedBooks', JSON.stringify(retrievedData))
      }
    }
  } else {
    localStorage.setItem('savedBooks', JSON.stringify(newItem))
  }
}

// SCANS FOR CLICK EVENTS
searchClick = (event) => {
  let targetEl = event.target
  if (targetEl.matches('.saveBook')) {
    addToFav()
  }
}

selectionContainer.addEventListener('click', searchClick)