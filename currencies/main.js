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
        handleReports();
    });


    $("#aboutLink").click(() => {
        handleAbout();
    });

    //---------------Coin search -------------

    $("#searchInput").keyup(() => {
        event.preventDefault();
        const searchVal = $("#searchInput").val();
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
    $("#contentDiv").on("click", "input", function () {

        let coinId = $(this).attr("id");

        if (event.target.checked) {

            if (chosenCoins.length < 5) {
                chosenCoins.push(coinId);
            }
            else {
                extraCoin = coinId;
                event.target.checked = false;
                modalContent();
            }
        }
        else {
            chosenCoins = chosenCoins.filter(item => {
                return (item != coinId);
            });
        }

        // save chosen coins to storage
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

    // turns toggle in modal off and toggle in coins on
    $(".modal").on("change", "input", function () {

        $("#myModal").fadeOut(650);
        $("#modalBody").empty();


        const modalCoinId = $(this).attr("id");
        const index = chosenCoins.indexOf(modalCoinId);

        chosenCoins.splice(index, 1);
        chosenCoins.push(extraCoin);

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
        $("#contentDiv").html('');
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

    // display reports
    function displayReports() {
        $("#contentDiv").html('');
        let html = `
        <div class="card" id="reportsCard">
           <h2>Sorry reports are not available</h2>
        </div>
        `;

        $("#contentDiv").append(html);
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

    // Display about page
    function handleAbout() {
        displayAbout();
    }

    // Display report page
    function handleReports() {
        displayReports();
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


