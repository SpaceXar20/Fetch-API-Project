const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

//new fetch data function will return a promise once the data is retrieved from the server and parsed to JSON
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('Looks like there was a problem', error))
}

//new promise to fetch two urls, wait for both to resolve before moving on, once resolved, use their results to generate the options list
Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')
])
.then(data => {
    const breedList = data[0].message;
    const randomImage = data[1].message;

    generateOptions(breedList);
    generateImage(randomImage);
});


//what I have here was replaced with what I have in promise.All()

/*this fetch returns a promise, 
this  promise is fulfilled or resolved  
when the browser receives the data images response from the server*/


// fetchData('https://dog.ceo/api/breeds/image/random')
// /* 
// next we are going to chain a then method to fetch and pass it a function using an error function that takes the response via a parameter called response
// */



// .then(data => generateImage(data.message)) //on this [then] method we pass a function that takes the json data via a parameter called data 
 

// //new Fetch method to retrieve breed name list
// fetchData('https://dog.ceo/api/breeds/list')

// .then(data => generateOptions(data.message))



// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

//new function to check status
function checkStatus(response) {
  if(response.ok)  {
      return Promise.resolve(response);
  } else {
      return Promise.reject(new Error(response.statusText));
  }
}


//create function to display dog breed info as option values
function generateOptions(data) {
    const options = data.map(item => `
       <option value='${item}'>${item}</option> 
    `).join('');
    select.innerHTML = options; // set innerHTML of the select element to options
    
}

//create markup for img and paragraph, the data will be the url from the API
function generateImage(data) {
    const html = `
        <img src= '${data}' alt> 
        <p>Click to view images of ${select.value}s</p>
    `;
    card.innerHTML = html;
}

//new function to fetch data by breed image
function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(data => {
        img.src = data.message; //set img src attr to the returned url via data.message
        img.alt = breed;
        p.textContent = `Click to view more ${breed}s`;
    });

}


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener('change', fetchBreedImage); //select image by by selecting breed from options
card.addEventListener('click', fetchBreedImage); //click to display random image inside card div
form.addEventListener('submit', postData) // add event listener to form and add postData as a callback

// ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment');

    fetch('https://jsonplaceholder.typicode.com/comments', { /* the fetch method accepts a new parameter , a configuration object that lets you configure settings that can apply the request like choosing a different method*/
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name : name, comment: name })

    })
    .then(checkStatus) //check status response
    .then(res => res.json()) // this method to parse the response to JSON
    .then(data => console.log(data)) // this method handles data
}
