const searchBtn = document.querySelector(".search-btn")
const keyword = document.querySelector(".input-keyword");
searchBtn.addEventListener("click",  async function(){
    loadingSearch()
    try{
        const movies =  await getMovies(keyword.value)
        updateUI(movies)
    }catch(errorM){
        errorMessage(errorM)
    }
})

keyword.addEventListener("keyup", async function(e){
    if(e.keyCode == 13){
        e.preventDefault()
        loadingSearch()
        try{
            const movies =  await getMovies(keyword.value)
            updateUI(movies)
        }catch(errorM){
            errorMessage(errorM)
        }
    }
})

document.addEventListener("click", async function(e){
    if( e.target.classList.contains("modal-btn") ){
        loadingDetail()
        const imdbid = e.target.dataset.imdbid;
        try {
            const moviesDetail = await getMoviesDetail(imdbid);
            updateUIDetail(moviesDetail)
            await getTrailer(moviesDetail.Title)
        }
        catch(errorM){
            console.log(errorM)
        }

    }
}) 

function getMovies(keyword){
    return fetch(`http://www.omdbapi.com/?apikey=19e7f0f7&s=${keyword}`)
            .then( response => {
                if(keyword == "" ){
                    throw new Error("Please insert the keyword first")
                }
                else if( !response.ok ){
                    throw new Error(response.statusText)
                }
                return response.json()
            } )
            .then( response => {
                if( response.Response === "False"){
                    throw new Error(response.Error)
                }
                return response.Search
            } )
}

function getMoviesDetail(imdbid){
    return fetch(`http://www.omdbapi.com/?apikey=19e7f0f7&i=${imdbid}`)
                        .then( response => response.json() )
                        .then( response => response )
}

function getTrailer(title){
    const trailer = document.querySelector(".link-trailer")
    return fetch(`https://youtube.googleapis.com/youtube/v3/search?q=${title} trailer&part=snippet&type=video&key=AIzaSyD-mKiVY9liuncJzIgWYdiL9eAURPU0VX8&maxResults=1`)
            .then(response => response.json() )
            .then(response => {
                if(response.error){
                    throw new Error(response.error.message);
                }
                else {
                    trailer.style.display = "inline"
                    trailer.href = `https://www.youtube.com/watch?v=${response.items[0].id.videoId}`
                }
            })
}

function updateUIDetail(moviesDetail){
    const modalDetail = document.querySelector(".modal-body")
    modalDetail.innerHTML = modalComp(moviesDetail)
}

function updateUI(movies){
    let cards = ""  
    movies.forEach(movie => cards += cardComp(movie) )
    const containerMovies = document.querySelector(".movies-container")
    containerMovies.innerHTML = cards
}


function loadingDetail(){
    const modalDetail = document.querySelector(".modal-body")
    modalDetail.innerHTML = `<div class="loading-circle">
    <div>
      <div></div>
    </div>`
}

function loadingSearch(){
    const containerMovies = document.querySelector(".movies-container")
    containerMovies.innerHTML = `<div>
        <div class="loading-circle">
        <div>
            <div></div>
        </div>
    </div`
}

function errorMessage(errorM){
    const strError = `<h2 class="text-center mt-5">${errorM}</h2>`
    const containerMovies = document.querySelector(".movies-container")
    containerMovies.innerHTML = strError
}

function cardComp( {Title, Year, imdbID, Poster} ){
    return `<div class="col-lg-3 col-md-4 col-6 my-3 align-self-stretch">
        <div class="card">
        <img src="${Poster}" class="card-img-top ">
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <h5 class="card-title">${Title}</h5>
                <h6 class="card-subtitle text-muted mb-3">${Year}</h6>
            </div>
            <button class="btn btn-primary modal-btn align-self-start" data-bs-toggle="modal" data-bs-target="#movieDetail" data-imdbid="${imdbID}">See Detail</button>
        </div>
        </div>
    </div>`
}

function modalComp( {Poster, Title, Year, Director, Actors, Writer, Plot} ){
    return `<div class="container-fluid">
        <div class="row">
            <div class="col-md-5">
                <img src="${Poster}" alt="">
            </div>
            <div class="col-md-7">
                <ul class="list-group">
                    <li class="list-group-item"><h4>${Title}(${Year})</h4></li>
                    <li class="list-group-item"><strong>Director : </strong> ${Director}</li>
                    <li class="list-group-item"><strong>Actors : </strong>${Actors}</li>
                    <li class="list-group-item"><strong>Writer : </strong>${Writer}</li>
                    <li class="list-group-item"><strong>Plot : </strong>${Plot}</li>
                </ul>
            </div>
        </div>
        <div class="row">
            <a href="#" target="_blank" class="link-trailer">Lihat Trailer</a>
        </div>
    </div>`
}



// REFACTORING PALING EFISIEN(SAAT INI)
// const searchBtn = document.querySelector(".search-btn")
// const keyword = document.querySelector(".input-keyword");
// searchBtn.addEventListener("click",  async function(){
//     loadingSearch()
//     try{
//         const movies =  await getMovies(keyword.value)
//         updateUI(movies)
//     }catch(errorM){
//         errorMessage(errorM)
//     }
// })

// keyword.addEventListener("keyup", async function(e){
//     if(e.keyCode == 13){
//         e.preventDefault()
//         loadingSearch()
//         try{
//             const movies =  await getMovies(keyword.value)
//             updateUI(movies)
//         }catch(errorM){
//             errorMessage(errorM)
//         }
//     }
// })

// document.addEventListener("click", async function(e){
//     if( e.target.classList.contains("modal-btn") ){
//         loadingDetail()
//         const imdbid = e.target.dataset.imdbid;
//         const moviesDetail = await getMoviesDetail(imdbid);
//         updateUIDetail(...moviesDetail)
//     }
// })

// function getMovies(keyword){
//     return fetch(`http://www.omdbapi.com/?apikey=19e7f0f7&s=${keyword}`)
//             .then( response => {
//                 if(keyword == "" ){
//                     throw new Error("Please insert the keyword first")
//                 }
//                 else if( !response.ok ){
//                     throw new Error(response.statusText)
//                 }
//                 return response.json()
//             } )
//             .then( response => {
//                 if( response.Response === "False"){
//                     throw new Error(response.Error)
//                 }
//                 return response.Search
//             } )
// }

// async function getMoviesDetail(imdbid){
//     const moviesDetail = await fetch(`http://www.omdbapi.com/?apikey=19e7f0f7&i=${imdbid}`)
//                             .then( response => response.json() )
//                             .then( response => response )
//     const trailer = await getTrailer(moviesDetail.Title)
//     return [moviesDetail, trailer]
// }

// function getTrailer(title){
//     return fetch(`https://youtube.googleapis.com/youtube/v3/search?key=AIzaSyCb5ADgy4B-9q49zGnWTobJ8WKnhru9SZc&q=${title} trailer&part=snippet&type=video&maxResults=1`)
//             .then(response => response.json())
//             .then(response => response.items[0].id.videoId)
// }

// function updateUIDetail(moviesDetail, trailer){
//     const modalDetail = document.querySelector(".modal-body")
//     modalDetail.innerHTML = modalComp(moviesDetail, trailer)
// }

// function updateUI(movies){
//     let cards = ""  
//     movies.forEach(movie => cards += cardComp(movie) )
//     const containerMovies = document.querySelector(".movies-container")
//     containerMovies.innerHTML = cards
// }

// function loadingDetail(){
//     const modalDetail = document.querySelector(".modal-body")
//     modalDetail.innerHTML = `<div class="loading-circle">
//     <div>
//       <div></div>
//     </div>`
// }

// function loadingSearch(){
//     const containerMovies = document.querySelector(".movies-container")
//     containerMovies.innerHTML = `<div>
//         <div class="loading-circle">
//         <div>
//             <div></div>
//         </div>
//     </div`
// }

// function errorMessage(errorM){
//     const strError = `<h2 class="text-center mt-5">${errorM}</h2>`
//     const containerMovies = document.querySelector(".movies-container")
//     containerMovies.innerHTML = strError
// }

// function cardComp( {Title, Year, imdbID, Poster} ){
//     return `<div class="col-lg-3 col-md-4 col-6 my-3 align-self-stretch">
//         <div class="card">
//         <img src="${Poster}" class="card-img-top ">
//         <div class="card-body">
//             <h5 class="card-title">${Title}</h5>
//             <h6 class="card-subtitle text-muted mb-3">${Year}</h6>
//             <button class="btn btn-primary modal-btn" data-bs-toggle="modal" data-bs-target="#movieDetail" data-imdbid="${imdbID}">See Detail</button>
//         </div>
//         </div>
//     </div>`
// }

// function modalComp( {Poster, Title, Year, Director, Actors, Writer, Plot}, trailer ){
//     return `<div class="container-fluid">
//         <div class="row">
//             <div class="col-md-5">
//                 <img src="${Poster}" alt="">
//             </div>
//             <div class="col-md-7">
//                 <ul class="list-group">
//                     <li class="list-group-item"><h4>${Title}(${Year})</h4></li>
//                     <li class="list-group-item"><strong>Director : </strong> ${Director}</li>
//                     <li class="list-group-item"><strong>Actors : </strong>${Actors}</li>
//                     <li class="list-group-item"><strong>Writer : </strong>${Writer}</li>
//                     <li class="list-group-item"><strong>Plot : </strong>${Plot}</li>
//                 </ul>
//             </div>
//         </div>
//         <div class="row">
//             <a href="https://www.youtube.com/watch?v=${trailer}" target="_blank">Lihat trailer</a>
//         </div>
//     </div>`
// }