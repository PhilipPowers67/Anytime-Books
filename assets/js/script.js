const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyCx8NiDI6Ge2sYcKzVC2o3wYYzOESQGHKs";
                          const makiGoogleApi = 'AIzaSyCx8NiDI6Ge2sYcKzVC2o3wYYzOESQGHKs';
                          const philipGoogleApi = 'AIzaSyAEI0gVqwCMa6e3jFyLmnNGsPC3cjXCrdc'
                          const GuilGoogleApi = 'AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU'
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
  // console.log(userSelection);

  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${userSelection}.json?api-key=${apiKey}`
  )
    .then((secondResponse) => {
      return secondResponse.json();
    })
    .then((secondResponse) => {
      // console.log(secondResponse);
      for (i = 0; i < secondResponse.results.books.length; i++) {
        let isbn = secondResponse.results.books[i].primary_isbn13;
        let author = secondResponse.results.books[i].author;
        let title = secondResponse.results.books[i].title;
        let cover = secondResponse.results.books[i].book_image;
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${author}+isbn:${isbn}&key=${googleKey}`)
          .then((googleResponse) => {
            return googleResponse.json();
          })
          .then((googleResponse) => {
            // console.log(googleResponse);
            // bug!!! when google does not provide information the books does not gets added to the screen
            let description = googleResponse.items[0].volumeInfo.description
            let snippet = googleResponse.items[0].searchInfo.textSnippet
            // pushed the info collected from the fetch to the bookInfo array to use on the page after
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
            // bug resolved, when google returns with not results, added empty strings for now and then push the info to the array of books
            // console.log(err)
              description = "";
              snippet = "";
          bookInfo.push({
            author: author,
            title: title,
            isbn: isbn,
            cover: cover,
            description: description,
            snippet: snippet,
          });
          });

        }
        // console.log(bookInfo);
    })
    .then(() => {
      setTimeout(appendBooks, 1500)
    })
});

let appendBooks = () => {
for (let i = 0; i < bookInfo.length; i++) {
  let retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || []
  let bookContainer = document.createElement("div");
  bookContainer.classList = 'book-container is-flex is-flex-direction-row m-5 is-align-content-baseline is-justify-content-center is-flex-wrap-wrap column'
  // is-four-fifths-mobile is-one-third-tablet is-one-third-desktop is-one-fifth-full hd
  bookContainer.setAttribute('isbn-code', `${bookInfo[i].isbn}`)

let bookCover = document.createElement("img");
  bookCover.classList = 'book-cover is-text-align-center'
  bookCover.setAttribute("src", bookInfo[i].cover);
  bookCover.setAttribute('alt', `${bookInfo[i].title}'s cover`)
  bookContainer.appendChild(bookCover);
let bookTitle = document.createElement("div");
  bookTitle.className = "column is-full has-text-centered is-capitalized";
  bookTitle.innerHTML = `<h2>${bookInfo[i].title}</h2>`;
  bookContainer.appendChild(bookTitle);
let bookAuthor = document.createElement("div");
  bookAuthor.className = "column is-full has-text-centered is-capitalized";
  bookAuthor.innerHTML = `<p>${bookInfo[i].author}</p>`;
  bookContainer.appendChild(bookAuthor);
let bookDescription = document.createElement('div')
  bookDescription.innerHTML = `<p>${bookInfo[i].snippet}</p>`
  bookDescription.classList = 'my-5 has-text-centered'
  bookContainer.appendChild(bookDescription)
let saveButton = document.createElement('button')
saveButton.classList = 'saveBook p-1 mt-5 heart-red'
saveButton.setAttribute('title', 'Add to Favorites')
    bookContainer.appendChild(saveButton)
      selectionContainer.appendChild(bookContainer);
}
}

// // SAVE TO LOCAL STORAGE
addToFav = (parent) => {
  console.log(parent)
let title = parent.childNodes[1].firstChild.textContent
let author = parent.childNodes[2].firstChild.textContent
let description = parent.childNodes[3].firstChild.textContent
let isbnCode = parent.getAttribute('isbn-code')
let newItem = {
author: `${author}`,
title: `${title}`,
description: `${description}`,
isbn: `${isbnCode}`}
var retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || []
if (localStorage.length > 0) {
for (i = 0; i < retrievedData.length; i++) {
if (retrievedData[i].author === newItem.author) {
  break
} else {
  if (retrievedData.length - 1 === i) {
    retrievedData.push(newItem)
    localStorage.setItem('savedBooks', JSON.stringify(retrievedData))
  }
}
}
} else {
retrievedData.push(newItem)
localStorage.setItem('savedBooks', JSON.stringify(retrievedData))
}
}
// localStorage.setItem('savedBooks', JSON.stringify(newItem))

// // SCANS FOR CLICK EVENTS
searchClick = (event) => {
let targetEl = event.target
if (targetEl.matches('.saveBook')) {
let child = targetEl
let parent = child.parentNode 
addToFav(parent)
}
}

let expand = () => {
  
}

selectionContainer.addEventListener('click', searchClick)