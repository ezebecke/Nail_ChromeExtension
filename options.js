
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-109124591-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? "graytext" : "black";
  // The label color.
  options.frequency.disabled = isDeactivated; // The control manipulability.
}
window.addEventListener('load', function() {
  document.getElementById('nivelador').innerHTML = lvl;
  document.getElementById('insertexp').innerHTML = (progression +"%");

  // Initialize the option controls.
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
  // The display activation.
  options.frequency.value = localStorage.frequency;
                                         // The display frequency, in minutes.
  if (!options.isActivated.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.isActivated.onchange = function() {
    localStorage.isActivated = options.isActivated.checked;
    ghost(!options.isActivated.checked);
  };

  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
});
