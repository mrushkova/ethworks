"use strict";

var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  spaceBetween: 6,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});