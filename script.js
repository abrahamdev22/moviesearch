
//eksekusi via Enter key
const keyEnter = document.querySelector('.input-keyword');
keyEnter.addEventListener('keypress', async function(e){
    if (e.key == 'Enter') {
        try{
            const inputKeyword = document.querySelector('.input-keyword');  //mengambil semua keyword yang diketikkan pada field search
            const moviesData = await getMoviesData(inputKeyword.value);    //jalankan fungsi getMoviesData,hasilnya disimpan dalam variabel diberi keyword await karena didalamnya ada fetch yang asynchronous
            tampilkanMovies(moviesData);            //jalankan fungsi tampilkanMOvies dengan parameter moviesData, hasil dari fungsi getMoviesData
        } catch(err){
            // console.log(err); 
            alert(err);
        }        
    }
})

//eksekusi via Search button
const searchButton = document.querySelector('.search-button');      //tangkep elemen html
searchButton.addEventListener('click',async function () {    //beri event pada elemen tadi, untuk function diberi keyword async, karena didalamnya ada function yg asynchronous (dalam hal ini ada fetch didalam fungsi getMoviesData)
    try{
        const inputKeyword = document.querySelector('.input-keyword');  //mengambil semua keyword yang diketikkan pada field search
        const moviesData = await getMoviesData(inputKeyword.value);    //jalankan fungsi getMoviesData,hasilnya disimpan dalam variabel diberi keyword await karena didalamnya ada fetch yang asynchronous
        tampilkanMovies(moviesData);            //jalankan fungsi tampilkanMOvies dengan parameter moviesData, hasil dari fungsi getMoviesData
    } catch(err){
        // console.log(err); 
        alert(err);
    }  
    // console.log(moviesData);
});


//coba error handling

function getMoviesData(keyword) {   
    return fetch('https://www.omdbapi.com/?apikey=dfc21549&s=' + keyword)  //pake return karena hasilnya akan dipake di function berikutnya
    .then(response => {
        if(!response.ok){
           throw new Error(response.statusText);     
        }
        return response.json() 
    })  //hasil dari fetch adalah promise
    .then(response => {
        if(response.Response === 'False'){
            throw new Error(response.Error)
            // alert(`Error : ${response.Error}`) //atau mengalert ini
        }
    else {
        return response.Search}                //maka promise harus di then, hasil dari response Search adalah array of object
                                         //keyword Search setelah reponse adalah property dari object yg didapat dari hasil pencarian   
});
};

function tampilkanMovies(movies) {
    let moviesSatuan ='';
    movies.forEach(m => moviesSatuan+= showCards(m))
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = moviesSatuan;
};


//saat show detail diklik
//event binding, elemen yang awalnya gak ada, tapi selanjutnya ada (dalam hal ini adalah tombol show detail nya movie, saat halaman pertama kali di load, elemen tombol show detail belum ada ), baru muncul setelah tombol search diklik

document.addEventListener('click',async function(e) { //event ini untuk menangkap semua elemen yang di klik
    if (e.target.classList.contains('modal-detail-button')) {  //conditional hanya jika elemen show detail yang diklik
        const imdbidVal = e.target.dataset.imdbid;   // ambil isi dari dataset elemen yang namanya imdbid, valuenya simpan di variabel imdbidVal 
        const movieDetail = await getMovieDetails(imdbidVal); //panggil function getMovieDetail dengan parameter imdbid value, simpan di variabel movieDetail
        tampilkanDetail(movieDetail);  // panggil function tampilkanDetail dengan parameter movieDetail                    
    }
})



function tampilkanDetail(movDetail) {
        Array.of(movDetail).forEach(m => {     
        const modalDetails= showDetails(m);  //function showDetails dipanggil dengan parameter m                 
        const movieDetail = document.querySelector('.details-container'); //tangkep DOM
        movieDetail.innerHTML = modalDetails})
        // console.log(Array.of(movDetail));
        
}


function getMovieDetails(imdbid) {
    return fetch('https://www.omdbapi.com/?apikey=dfc21549&i=' + imdbid) 
        .then(response => response.json()) //hasil dari method json adalah promise
        .then(response => response);
}




//buat function yang me-return template literals, untuk menambahkan elemaen html       

function showCards(m) {
    return `<div class="col-md-4 my-5">
    <div class="card" >
    <img src="${m.Poster}" class="card-img-top" >
    <div class="card-body">
    <h5 class="card-title">${m.Title}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>                                
    <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Details</a>
    </div>
    </div>
    </div>`
};

function showDetails(m) {
    return `<div class="col-md-3">
    <img src="${m.Poster}" class="img-fluid">
    </div>
    <div class="col-md">
    <ul class="list-group">
    <li class="list-group-item"><h4>${m.Title}</h4></li>
    <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
    <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
    <li class="list-group-item"><strong>Genre: </strong>${m.Genre}</li>
    <li class="list-group-item"><strong>IMDB Rating: </strong>${m.imdbRating}</li>
    <li class="list-group-item"><strong>Plot: </strong> <br>${m.Plot}</li>
    </ul>
    </div>`
};