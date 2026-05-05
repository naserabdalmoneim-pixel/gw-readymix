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
    if (imageUrls[0]) {
      layerA.style.backgroundImage = "url('" + imageUrls[0] + "')";
      stage.style.backgroundImage = "url('" + imageUrls[0] + "')";
      stage.style.backgroundPosition = "center";
      stage.style.backgroundSize = "cover";
      stage.style.backgroundRepeat = "no-repeat";
    }
    stage.appendChild(layerA);
    stage.appendChild(layerB);
    slider.insertBefore(stage, slider.firstChild);

    var style = document.createElement("style");
    style.textContent = [
      "#sidebar-front-page-widget-area{overflow:hidden}",
      "#sidebar-front-page-widget-area>.widget,#sidebar-front-page-widget-area .container{max-width:none!important;width:100%!important;padding-left:0!important;padding-right:0!important}",
      "#sidebar-front-page-widget-area ss3-force-full-width{display:block!important;direction:ltr!important;text-align:left!important;width:100vw!important;max-width:100vw!important;margin-left:calc(50% - 50vw)!important;margin-right:calc(50% - 50vw)!important;transform:none!important;opacity:1!important}",
      "#sidebar-front-page-widget-area .n2-section-smartslider,#n2-ss-2-align,#n2-ss-2,#n2-ss-2 .n2-ss-slider-1,#n2-ss-2 .n2-ss-slider-2,#n2-ss-2 .n2-ss-slider-3,#n2-ss-2 .n2-ss-slider-wrapper-inside{direction:ltr!important;text-align:left!important;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}",
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
    var imageCache = {};

    function preloadImage(url, callback) {
      if (imageCache[url] === "loaded") {
        callback();
        return;
      }

      if (imageCache[url]) {
        imageCache[url].push(callback);
        return;
      }

      imageCache[url] = [callback];
      var image = new Image();
      image.onload = function () {
        var callbacks = imageCache[url];
        imageCache[url] = "loaded";
        callbacks.forEach(function (item) {
          item();
        });
      };
      image.onerror = function () {
        imageCache[url] = "loaded";
        callback();
      };
      image.src = url;
    }

    imageUrls.forEach(function (url) {
      preloadImage(url, function () {});
    });

    function showSlide(index) {
      current = index % backgrounds.length;
      var imageUrl = imageUrls[current];

      preloadImage(imageUrl, function () {
        var activeLayer = current % 2 === 0 ? layerA : layerB;
        var inactiveLayer = current % 2 === 0 ? layerB : layerA;
        activeLayer.style.backgroundImage = "url('" + imageUrl + "')";
        activeLayer.classList.add("is-active");
        inactiveLayer.classList.remove("is-active");

        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("n2-ss-slide-active", itemIndex === current);
        });
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
