/// <reference path="jquery-3.6.1.js"/>

"use strict";

$(async () => {

    // main header effects
    $(".loader").show();
    $("#headerBox").hide();
    $("#headerBox").toggle(1500).fadeIn(2500);

    // get coins with ajax
    const coins = await handleCurrencies();

    // arr for search func
    const coinSymbols = [];

    // array of coins toggled by user
    let chosenCoins = [];

    // load coins from storage and display
    loadFromStorage();

    // dynamic dom for each menu option onClick
    $("#currenciesLink").click(() => {
        $(".loader").show();
        displayCoins(coins);
    });

    $("#reportsLink").click(() => {
        displayReports();
    });


    $("#aboutLink").click(() => {
        displayAbout();
    });

    // Hide the navigation menu
    $(".nav-link").click(() => {
        $(".navbar-collapse").collapse('hide');;
    });

    // Hide navigation menu when a click is detected outside of it
    $(document).click((event) => {
        if (!$(event.target).closest('.navbar').length) {
            $(".navbar-collapse").collapse('hide');
        }
    });

    //---------------Coin search -------------

    $("#searchInput").keyup(() => {

        // prevent page refresh
        event.preventDefault();

        // get value to search from input
        const searchVal = $("#searchInput").val();

        // hide all cards and show only relevant cards
        $(".card").hide();
        coinSymbols.filter(symbol => symbol.toLowerCase().startsWith(searchVal.toLowerCase()))
            .forEach(symbol => {
                $(`#${symbol}`).show();
            });
    });

    // ---------------toggle----------------

    // var for coin that invokes modal
    let extraCoin = '';

    // adds coin to arr with toggle and invokes modal 
    $("#contentDiv").on("click", "input", function (event) {

        // get id from clicked coin input
        const coinId = event.target.id;

        // if toggle is checked 
        if (event.target.checked) {

            // and there are less than 5 chosen coins, add the coin to the chosen coins array
            chosenCoins.length < 5 ? chosenCoins.push(coinId) :

                // otherwise, set the extraCoin variable, uncheck the coin input, and show the modal
                ((extraCoin = coinId), (event.target.checked = false), modalContent());

        } else {
            // if the coin input is unchecked, remove the coin from the chosen coins array
            chosenCoins = chosenCoins.filter(item => item !== coinId);
        }

        saveToStorage();
    });

    // show chosen coins modal
    function modalContent() {

        $("#modalBody").empty();

        $("#myModal").css("display", "block");

        for (let i = 0; i < chosenCoins.length; i++) {

            $("#modalBody").append(` 

            <div class="modalCard">
                <label class="form-check-label" for="flexSwitchCheckDefault">${chosenCoins[i]}</label>
                <div class="form-check form-switch" id="form">
                    <input class="form-check-input" checked type="checkbox" role="switch" id="${chosenCoins[i]}">
                </div>
            </div>
            `);
        }
    }

    // turn off the toggle in the modal and turn on the toggle in the coins
    $(".modal").on("change", "input", function () {

        // clear and hide the modal
        $("#myModal").fadeOut(650);
        $("#modalBody").empty();

        // get id of clicked coin input in the modal and find its index in the chosenCoins arr
        const modalCoinId = $(this).attr("id");
        const index = chosenCoins.indexOf(modalCoinId);

        // remove coin from the chosenCoins arr, add the extra coin instead
        chosenCoins.splice(index, 1);
        chosenCoins.push(extraCoin);

        // save to storage and display coins
        saveToStorage();
        displayCoins(coins);
    });

    // modal cancel btn
    $("#closeBtn").on("click", () => {
        $("#myModal").fadeOut(650);
        $("#modalBody").empty();
    });

    //displays coins in cards
    function displayCoins(coins) {

        $("#contentDiv").html('');

        let html = ``;

        // checks toggles of cards that are in chosenCoins
        for (const coin of coins) {
            let checked = "";
            if (chosenCoins.indexOf(coin.symbol) !== -1) {
                checked = "checked";
            }

            html += `
                    <div class="card" id="${coin.symbol}">
                       <div class="form-check form-switch">
                          <input class="form-check-input"  type="checkbox" role="switch" ${checked} id="${coin.symbol}">
                          <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                        </div>
                        <h5> ${coin.symbol} </h5>
                        <h6> ${coin.name} </h6>
                        <img src="${coin.image.thumb}" id="coinImage">
                        
                        <button id="infoBtn" class="btn" data-bs-toggle="collapse" data-bs-target="#${coin.id}">
                                More Info 
                            </button>
                            <div class="collapse" id="${coin.id}">
                              <div class="card-body">
                                ${coin.market_data.current_price.usd.toFixed(3)}$
                                <br> 
                                ${coin.market_data.current_price.eur.toFixed(3)}€
                                <br> 
                                ${coin.market_data.current_price.ils.toFixed(3)}₪
                              </div>
                            </div>   
                    </div>            
                `;

            // add coin to arr for search func
            coinSymbols.push(coin.symbol);
        }

        $("#contentDiv").append(html);
    }

    // display about page
    function displayAbout() {

        // empty contentDiv 
        $("#contentDiv").html('');

        // data for about page
        let html = `    
        <div class="aboutMeArea">
           <h4 class="aboutHeader">Me & The Project</h4>
         <div class="aboutCardBox">
        <div class="aboutCard">
            <div class="lines"></div>
            <div class="imgBox"><img src="assets/images/aboutPic.jpg"></div>
            <div class="content">
                <div class="details">
                     <h2>Lior Strulovits<br><span>Full-Stack Developer</span></h2>
                    <div class="data">
                       Hey everyone!<br>
                       My name is Lior Strulovits, 31 years old,
                       currently live with my wife Tzlil in Tel-Aviv.
                       learning to be a full-stack developer at the Jhon-Bryce academy.

                      </div>
                    <div class="myLinks">
                        <a href="https://www.facebook.com/profile.php?id=100011232464408"><i class="bi bi-facebook"></i></a>
                        <a href="https://www.instagram.com/liorstrulovits/"> <i class="bi bi-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/lior-strulovits-b93494264/"> <i class="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="aboutCard">
            <div class="lines"></div>
            <div class="imgBox"><img src="assets/images/aboutPic2.jpeg"></div>
            <div class="content">
                <div class="details">
                        <h2>About The Project<br><span>Crypto Currencies</span></h2>
                    <div class="data" id="cryptoData">
                        On our site you can search for a specific coin and see its value
                        in different currencies, We have the top 50 coins out there.
                        Languages used for the site are:
                        Html | Css | Javascript 
                        Are site also uses Bootstrap and Jquery libraries.
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>`;

        $("#contentDiv").html(html);
    }

    // display reports with chosenCoins
    function displayReports() {

        // arr for chart coins
        const data = [];

        // get each coins worth in usd
        for (const coin of chosenCoins) {
            const worth = coins.find(c => c.symbol === coin).market_data.current_price.usd;
            data.push({ name: coin, worth });
        }

        // display chart with data
        displayChart(data);
    }

    // displays chart
    function displayChart(data) {

        // empty contentDiv 
        $("#contentDiv").html('');

        // // create a new canvas element
        let canvas = document.createElement('canvas');

        // // set the ID attribute
        canvas.id = 'chart';

        // add the canvas element to the contentDiv section
        document.getElementById('contentDiv').append(canvas);

        // vars for chart
        const labels = data.map(d => d.name);
        const values = data.map(d => d.worth);

        new Chart(document.getElementById("chart"), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Worth in USD',
                    data: values,
                    backgroundColor: '#da9a07',
                    borderColor: '#fff',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Worth in USD',
                            color: 'white'
                        },
                        ticks: {
                            beginAtZero: true,
                            color: '#da9a07'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Coin Name',
                            color: 'white'
                        },
                        ticks: {
                            color: '#da9a07'
                        }
                    }
                }
            }
        });
    }

    // gets api from url in json format
    async function getJason(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    // get json coins
    async function handleCurrencies() {
        const coins = await getJason("https://api.coingecko.com/api/v3/coins/");
        return coins;
    }

    //convert coins to string and saves to local storage
    function saveToStorage() {
        const jsonString = JSON.stringify(chosenCoins);
        localStorage.setItem("chosenCoins", jsonString);
    }

    //loads from storage if not empty
    function loadFromStorage() {
        const jsonString = localStorage.getItem("chosenCoins");

        //parse only if storage not null 
        if (jsonString) {
            chosenCoins = JSON.parse(jsonString);
        }

        //display coins on page
        displayCoins(coins)
    }

});


