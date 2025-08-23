// SWIPER BITCH SOSI KIRPI4
import Swiper from 'swiper';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".swiper").forEach((el) => {
    new Swiper(el, {
      modules: [EffectCards],
      effect: "cards",
      grabCursor: true,
      loop: true
    });
  });
});