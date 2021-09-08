const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyCx8NiDI6Ge2sYcKzVC2o3wYYzOESQGHKs";
        // MULTIPLE GOOGLE API KEYS  
      // const makiGoogleApi = 'AIzaSyCx8NiDI6Ge2sYcKzVC2o3wYYzOESQGHKs';
      // const philipGoogleApi = 'AIzaSyAEI0gVqwCMa6e3jFyLmnNGsPC3cjXCrdc'
      // const guilGoogleApi = 'AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU'
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
      arr.push({
        name: response.results[i].display_name,
        code: response.results[i].list_name_encoded,
      });
    }
    // console.log(arr);
  })
  .then(() => {
    // FILTER LIST AND LEAVE GENRES ONLY 
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
            let description = googleResponse.items[0].volumeInfo.description
            let snippet = googleResponse.items[0].searchInfo.textSnippet
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
      // SET TIMEOUT FOR SOLVING ASYNC PROBLEM 
      setTimeout(appendBooks, 1500)
    })
});

let appendBooks = () => {
  for (let i = 0; i < bookInfo.length; i++) {
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
  // console.log(parent)
let cover = parent.childNodes[0].getAttribute('src')
let title = parent.childNodes[1].firstChild.textContent
let author = parent.childNodes[2].firstChild.textContent
let description = parent.childNodes[3].firstChild.textContent
let isbnCode = parent.getAttribute('isbn-code')
let newItem = {
cover: `${cover}`,
author: `${author}`,
title: `${title}`,
description: `${description}`,
isbn: `${isbnCode}`}
let retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || []
if (localStorage.length > 0) {
for (i = 0; i < retrievedData.length; i++) {
if (retrievedData[i].author === newItem.author) {
  break
} else {
  if (retrievedData.length - 1 === i) {
    retrievedData.push(newItem)
    localStorage.setItem('savedBooks', JSON.stringify(retrievedData))
    loadSaveList()
  }
}
}
} else {
retrievedData.push(newItem)
localStorage.setItem('savedBooks', JSON.stringify(retrievedData))
loadSaveList()

}
}

// // SCANS FOR CLICK EVENTS
searchClick = (event) => {
let targetEl = event.target
// IF THE ADD TO FAVORITES BUTTON (HEART) IS PRESSED 
if (targetEl.matches('.saveBook')) {
let child = targetEl
let parent = child.parentNode 
addToFav(parent)
}
}

// FUNCTION FOR LOADING SAVE iTEMS LIST 
let loadSaveList = () => {
  let savedItemsList = document.getElementById('savedItemsList')
    savedItemsList.classList = 'p-1'
    savedItemsList.innerHTML = ''
  let retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || []
  for (i = 0; i < retrievedData.length; i++) {
    let listItem = document.createElement('li')
      listItem.classList = `BookItem is-flex is-flex-direction-column m-1 p-1 is-justify-content-space-evenly reddish column rounded`
    let bookCoverDiv = document.createElement('div')
      bookCoverDiv.classList = 'm-1 is-flex is-justify-content-center'
    let bookCover = document.createElement('img')
      bookCover.setAttribute('src', `${retrievedData[i].cover}`)
        bookCoverDiv.appendChild(bookCover)
          listItem.appendChild(bookCoverDiv)
    let titleAuthorDiv = document.createElement('div')
      titleAuthorDiv.classList = 'is-flex is-flex-direction-column is-justify-content-space-evenly my-5 has-text-centered'
      let title = document.createElement('h3')
        title.classList = 'm-1 is-capitalized'
        title.textContent = `Title: ${retrievedData[i].title}`
        titleAuthorDiv.appendChild(title)
      let author = document.createElement('p')
      author.classList = `m-1 is-capitalized`
      author.textContent = `Author: ${retrievedData[i].author}`
        titleAuthorDiv.appendChild(author)
          listItem.appendChild(titleAuthorDiv)
    let descriptionDiv = document.createElement('div')
      descriptionDiv.classList = `is-flex is-align-content-center p-1 has-text-centered`
    let description = document.createElement('p')
    description.textContent = `${retrievedData[i].description}`
      descriptionDiv.appendChild(description)
        listItem.appendChild(descriptionDiv)
    
    savedItemsList.appendChild(listItem)
  }
}

// LOAD SAVED LIST 
loadSaveList()

selectionContainer.addEventListener('click', searchClick)