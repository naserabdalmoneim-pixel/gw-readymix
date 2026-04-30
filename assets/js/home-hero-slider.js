(function () {
  "use strict";

  var SLIDE_INTERVAL = 4500;

  function initHeroSlider() {
    var slider = document.getElementById("n2-ss-2");
    if (!slider) {
      return;
    }

    var backgrounds = Array.prototype.slice.call(
      slider.querySelectorAll(".n2-ss-slide-background")
    );
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".n2-ss-slide"));

    if (backgrounds.length < 2 || slides.length < 2) {
      return;
    }

    var imageUrls = backgrounds
      .map(function (background) {
        var image = background.querySelector("img");
        return image ? image.getAttribute("src") : "";
      })
      .filter(Boolean);

    var stage = document.createElement("div");
    var layerA = document.createElement("div");
    var layerB = document.createElement("div");

    stage.className = "uq-hero-stage";
    layerA.className = "uq-hero-stage__layer is-active";
    layerB.className = "uq-hero-stage__layer";
    stage.appendChild(layerA);
    stage.appendChild(layerB);
    slider.insertBefore(stage, slider.firstChild);

    var style = document.createElement("style");
    style.textContent = [
      "#n2-ss-2{position:relative;background:#0f4074;overflow:hidden}",
      "#n2-ss-2 .uq-hero-stage{position:absolute;inset:0;z-index:1;background:#0f4074}",
      "#n2-ss-2 .uq-hero-stage__layer{position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;opacity:0;transition:opacity 650ms ease}",
      "#n2-ss-2 .uq-hero-stage__layer.is-active{opacity:1}",
      "#n2-ss-2 .n2-ss-slider-wrapper-inside{position:relative;z-index:2}",
      "#n2-ss-2 .n2-ss-slide-backgrounds{display:none!important}",
      "#n2-ss-2 .n2-ss-slide{opacity:1!important;pointer-events:none}"
    ].join("");
    document.head.appendChild(style);

    var current = 0;

    function showSlide(index) {
      current = index % backgrounds.length;

      var activeLayer = current % 2 === 0 ? layerA : layerB;
      var inactiveLayer = current % 2 === 0 ? layerB : layerA;
      activeLayer.style.backgroundImage = "url('" + imageUrls[current] + "')";
      activeLayer.classList.add("is-active");
      inactiveLayer.classList.remove("is-active");

      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("n2-ss-slide-active", itemIndex === current);
      });
    }

    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, SLIDE_INTERVAL);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroSlider);
  } else {
    initHeroSlider();
  }
})();
