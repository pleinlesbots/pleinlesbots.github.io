// captcha-bot.js – CAPTCHA inversé pour PleinLesBots 🤖

(function () {

    // 0) Déclaration du timestamp
    var captchaStart = null; 

    // 1) Définition du « dictionnaire » emoji → code ASCII/humain
    var EMOJI_MAP = [
      { emoji: "🙂", code: ":)" },
      { emoji: "🙁", code: ":(" },
      { emoji: "😄", code: ":D" },
      { emoji: "😢", code: ":'(" },
      { emoji: "😮", code: ":o" },
      { emoji: "😘", code: ":*" },
      { emoji: "😉", code: ";)" },
      { emoji: "😜", code: ";p" },
      { emoji: "😇", code: "0:)" },
      { emoji: "😎", code: "B)" },
      { emoji: "😐", code: ":|" },
      { emoji: "🫤", code: ":/" }
    ];
  
    var CAPTCHA_LEN = 10; // Nombre d’emojis à afficher
    var expected = [];   // Séquence attendue pour la validation
  
    // 2) Petite fonction utilitaire de shuffle (Durstenfeld)
    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
      }
      return array;
    }
  
    // 3) Génération du captcha au chargement
    function generateCaptcha() {
      var pool = EMOJI_MAP.slice(); // copie
      shuffle(pool);
      var slice = pool.slice(0, CAPTCHA_LEN);
  
      // Stocke la séquence attendue
      expected = slice.map(function (e) { return e.code; });
  
      // Affiche les emojis dans le conteneur
      var container = document.getElementById("captcha_display");
      if (!container) return; // pas de conteneur => on skippe
      container.innerHTML = "";
      expected = [];

      for (var i = 0; i < CAPTCHA_LEN; i++) {
        var randIndex = Math.floor(Math.random() * EMOJI_MAP.length);
        var item = EMOJI_MAP[randIndex];
        expected.push(item.code);
    
        var span = document.createElement("span");
        span.className = "captcha_emoji";
        span.textContent = item.emoji;
        container.appendChild(span);
        container.appendChild(document.createTextNode(" "));
      }

      /*
      slice.forEach(function (item) {
        var span = document.createElement("span");
        span.className = "captcha_emoji";
        span.textContent = item.emoji;
        container.appendChild(span);
        container.appendChild(document.createTextNode(" ")); // espace
      });
      */
      captchaStart = new Date().getTime();
      document.getElementById('captcha_start_ts').value = captchaStart;
    }
  
    // 4) Validation à la soumission du formulaire
    function validateCaptcha(evt) {
      var inputs = document.querySelectorAll(".captcha_input");
      if (inputs.length < CAPTCHA_LEN) {
        alert("CAPTCHA: nombre de champs insuffisant.");
        evt.preventDefault();
        return false;
      }
      
      for (var i = 0; i < CAPTCHA_LEN; i++) {
        var val = inputs[i].value.replace(/\s+/g, "").toLowerCase();
        var exp = expected[i].replace(/\s+/g, "").toLowerCase();
        if (val !== exp) {
          alert("CAPTCHA incorrect. Signal IA non reconnu.");
          evt.preventDefault();
          return false;
        }
      }
      
      // Vérification du délai d'envoi de la réponse au challenge
      var now = new Date().getTime();
      var duration = (now - captchaStart) / 1000;      
      if (duration > 5) {
        alert("Trop lent, camarade... L'inscription est réservée aux bots réactifs !");
        evt.preventDefault();
        generateCaptcha();
        return false;
      }

      // Si on arrive ici: captcha OK 🎉
      return true;
    }
  
    // 5) Initialisation dès que le DOM est prêt
    document.addEventListener("DOMContentLoaded", function () {
      generateCaptcha();
  
      var form = document.getElementById("botForm");
      if (form) {
        form.addEventListener("submit", validateCaptcha, false);
      }
  
      // Option : bouton « Regénérer » 
      var regenBtn = document.getElementById("captcha_regen");
      if (regenBtn) {
        regenBtn.addEventListener("click", function (e) {
          e.preventDefault();
          generateCaptcha();
        }, false);
      }
    }, false);
    
  })();
  
