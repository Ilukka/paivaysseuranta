//Hae elementit DOMista
function seuraa() {
    var tuote = document.getElementById('tuote').value;
    var määrä = document.getElementById('määrä').value;
    var annos = document.getElementById('annos').value;
  
    // Tarkista syöttöjen pituus
    if (tuote.length > 40 || määrä.length > 40 || annos.length > 40) {
      alert("Syötteiden pituus saa olla enintään 40 merkkiä!");
      return;
    }
  
    if (tuote && määrä && annos) {
      var päiviäJäljellä = laskePäivätJäljellä(määrä, annos);
      var loppumisPäivä = laskeLoppumisPäivä(päiviäJäljellä);
  
      lisääTaulukkoon(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä);
      tallennaTiedotLocalStorageen(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä);
  
      // Tyhjennä lomakkeet
      document.getElementById('tuote').value = "";
      document.getElementById('määrä').value = "";
      document.getElementById('annos').value = "";
    } else {
      alert('Täytä kaikki kentät!');
    }
  }
    // funktio joka laskee päivät jäljellä ja palauttaa tuloksen pyöristettyna ylöspäin
function laskePäivätJäljellä(määrä, annos) {

    // Laske jäljellä olevien päivien määrä
    var päiviäJäljellä = määrä / annos;

    // Palauta tulos pyöristettynä ylöspäin
    return Math.ceil(päiviäJäljellä);
}   
    // Funktio joka laskee loppumispäivä ja muokkaa päivämäärän haluttuun formaattiin 
function laskeLoppumisPäivä(päiviäJäljellä) {
    var tänään = new Date();
    var expiryDate = new Date(tänään.getTime() + päiviäJäljellä * 24 * 60 * 60 * 1000);

    // Muotoile päivämäärä "pp-kk-vvvv"
    var muutettuPäiväys = expiryDate.toLocaleDateString().split('T')[0];

    return muutettuPäiväys;
}
    // funktio joka lisää tiedot taulukkoon
function lisääTaulukkoon(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä) {
    var taulukko = document.getElementById('taulukko');
    var rivi = taulukko.insertRow(1);

    var solu1 = rivi.insertCell(0);
    var solu2 = rivi.insertCell(1);
    var solu3 = rivi.insertCell(2);
    var solu4 = rivi.insertCell(3);
    var solu5 = rivi.insertCell(4); 
    var solu6 = rivi.insertCell(5);

    solu1.innerHTML = tuote;
    solu2.innerHTML = määrä;
    solu3.innerHTML = annos;
    solu4.innerHTML = päiviäJäljellä + ' päivää';
    solu5.innerHTML = loppumisPäivä;
    solu6.innerHTML += '<button onclick="poistaTuote(this)">Poista</button>';
}
    // funktio joka tallentaa tiedot localStorageen
function tallennaTiedotLocalStorageen(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä) {
    var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

    var uusiTuoteLista = {
        tuote: tuote,
        määrä: määrä,
        annos: annos,
        päiviäJäljellä: päiviäJäljellä,
        loppumisPäivä: loppumisPäivä
    };

    tuoteLista.push(uusiTuoteLista);

    localStorage.setItem('tuoteLista', JSON.stringify(tuoteLista));
}
    // funktio joka lataa tiedot localStoragesta
function lataaTiedotLocalStoragesta() {
    var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

    for (var i = 0; i < tuoteLista.length; i++) {
        lisääTaulukkoon(
            tuoteLista[i].tuote,
            tuoteLista[i].määrä,
            tuoteLista[i].annos,
            tuoteLista[i].päiviäJäljellä,
            tuoteLista[i].loppumisPäivä
        );
    }
}
    // funktio joka poistaa tuotteen poista nappulaa painettaessa
function poistaTuote(button) {
    var rivi = button.parentNode.parentNode;
    var tuotteenNimi = rivi.cells[0].innerHTML;

    // Poista rivi HTML-taulukosta
    rivi.parentNode.removeChild(rivi);

    // käynnistää funktion joka poistaa tuotteen tiedot localStoragesta
    poistaTuoteLocalStoragesta(tuotteenNimi);
}
    //funktio joka poistaa tuotteen localStoragesta ja päivittää muokatun listan
function poistaTuoteLocalStoragesta(tuotteenNimi) {
    var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

    // Etsi ja poista tuote listalta
    for (var i = 0; i < tuoteLista.length; i++) {
        if (tuoteLista[i].tuote === tuotteenNimi) {
            tuoteLista.splice(i, 1);
            break;
        }
    }

    localStorage.setItem('tuoteLista', JSON.stringify(tuoteLista));
}

// Lataa tallennetut tiedot sivun latautuessa
lataaTiedotLocalStoragesta();