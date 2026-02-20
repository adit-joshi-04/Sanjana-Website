(function() {
  'use strict';

  if (window.__sanjanaFooterLoaded) return;
  window.__sanjanaFooterLoaded = true;

  // ── Constants ──
  var MOBILE_BP = 768;
  var DESKTOP_W = 1440, DESKTOP_H = 458;
  var MOBILE_W = 393, MOBILE_H = 412;
  var GRAVITY = 0.15;
  var PI = Math.PI, HALF_PI = PI / 2, TWO_PI = PI * 2;

  // ── State ──
  var currentDesignW = DESKTOP_W;
  var currentDesignH = DESKTOP_H;
  var scaleFactor = 1;
  var flowerImages = [];
  var particles = [];
  var cursorOver = false;
  var cursorX = 0, cursorY = 0;
  var cursorFlowerIndex = 0;
  var cursorAge = 0;
  var mouseHeld = false;

  // ── Helpers ──
  function rand(a, b) {
    if (b === undefined) return Math.random() * a;
    return Math.random() * (b - a) + a;
  }
  function mapVal(v, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin));
  }

  // ── CSS ──
  var FOOTER_CSS = `
@font-face {
      font-family: 'Romie Trial Mid';
      src: url('RomieTrial-Medium.otf') format('opentype');
      font-weight: 700;
      font-style: normal;
    }

#sanjana-footer,
#sanjana-footer *,
#sanjana-footer *::before,
#sanjana-footer *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#sanjana-footer {
  position: relative;
  width: 100%;
  background: rgb(255, 244, 149);
  overflow: hidden;
  cursor: none;
  font-family: 'Inter', sans-serif;
}

#sanjana-footer a {
  cursor: pointer;
}

#sanjana-footer-canvas {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
#sanjana-footer-canvas canvas { display: block; }

#sanjana-footer .footer-scaler {
  position: relative;
  width: 1440px;
  height: 458px;
  transform-origin: top left;
  z-index: 5;
  pointer-events: none;
}

#sanjana-footer .footer-scaler a {
  pointer-events: auto;
  color: inherit;
  text-decoration: none;
}
#sanjana-footer .footer-scaler a:hover { text-decoration: underline; }

#sanjana-footer .lets-chat {
  position: absolute;
  left: 764px;
  top: 47px;
  width: 774px;
  font-family: 'Romie Trial Mid', 'Playfair Display', 'Georgia', serif;
  font-size: 65px;
  font-weight: 500;
  text-align: left;
  letter-spacing: -2.4px;
  line-height: 107%;
  color: #000;
}

#sanjana-footer .contact-block {
  position: absolute;
  left: 764px;
  top: 164px;
  width: 284px;
  font-size: 16px;
  line-height: 1;
  color: #000;
}
#sanjana-footer .contact-label {
  display: block;
  margin-bottom: 16px;
  font-size: 12px;
}
#sanjana-footer .contact-block a {
  display: block;
  line-height: 1.4;
}
#sanjana-footer .contact-location {
  display: block;
  margin-top: 16px;
  line-height: 1.4;
}

#sanjana-footer .copyright {
  position: absolute;
  left: 765px;
  top: 398px;
  font-size: 12px;
  line-height: 122%;
  color: #000;
}

#sanjana-footer .developed {
  position: absolute;
  left: 956px;
  top: 397px;
  font-size: 12px;
  line-height: 122%;
  color: #000;
}

#sanjana-footer .social-icons {
  position: absolute;
  left: 1344px;
  top: 176px;
  display: flex;
  flex-direction: column;
  gap: 33px;
}
#sanjana-footer .social-icons a {
  pointer-events: auto;
  display: block;
}
#sanjana-footer .social-icons a:hover { opacity: 0.7; }
#sanjana-footer .social-icons svg { display: block; }

@media (max-width: 768px) {
  #sanjana-footer .footer-scaler {
    width: 393px;
    height: 412px;
  }
  #sanjana-footer .lets-chat {
    left: 32px;
    width: 393px;
    top: 49px;
    font-size: 47.13px;
    letter-spacing: -1.41px;
    text-align: left;
  }
  #sanjana-footer .contact-block {
    left: 32px;
    top: 122px;
  }
  #sanjana-footer .copyright {
    left: 32px;
    top: 381px;
    font-size: 8.14px;
    font-weight: 500;
  }
  #sanjana-footer .developed {
    left: 161.5px;
    top: 381px;
    font-size: 8.14px;
    font-weight: 500;
  }
  #sanjana-footer .social-icons {
    left: 340px;
    top: 161px;
    gap: 15px;
  }
  #sanjana-footer .social-icons a:first-child svg {
    width: 20px;
    height: 20px;
  }
  #sanjana-footer .social-icons a:last-child svg {
    width: 22px;
    height: 22px;
  }
}
`;

  // ── HTML ──
  var FOOTER_HTML = `<footer id="sanjana-footer">
  <div id="sanjana-footer-canvas"></div>
  <div class="footer-scaler">
    <h2 class="lets-chat">Let's Chat!</h2>
    <div class="contact-block">
      <span class="contact-label">CONTACT</span>
      <a href="tel:+919880844772">+91 9880844772</a>
      <a href="mailto:sanjanabrajuu@gmail.com">sanjanabrajuu@gmail.com</a>
      <span class="contact-location">Bengaluru, India</span>
    </div>
    <div class="copyright">&copy; 2026 by Sanjana B Raju</div>
    <div class="developed">Developed by House of Katha &amp; Recog Technologies</div>
    <div class="social-icons">
      <a href="#" aria-label="Instagram">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9673 31.9371C13.6943 31.9371 11.4127 32.0602 9.14895 31.9093C5.49916 31.6653 2.8218 29.7868 1.08909 26.5784C0.302469 25.1198 -7.79539e-05 23.5373 0.0013458 21.8872C0.00561705 17.9567 0.0106002 14.0261 -7.79539e-05 10.0955C-0.00648484 7.69763 0.684747 5.53596 2.2046 3.68025C3.97646 1.51716 6.27155 0.266981 9.07349 0.0584988C10.2872 -0.0318672 11.511 0.00797921 12.7304 0.00584458C15.7737 0.000152235 18.8169 0.01296 21.8602 0.000863778C24.2308 -0.00838629 26.3756 0.657618 28.2265 2.14617C30.439 3.92503 31.7062 6.23968 31.9297 9.08087C32.0066 10.0585 31.9774 11.0447 31.9788 12.0267C31.9838 15.2941 31.9703 18.5615 31.9838 21.8289C31.9938 24.2118 31.331 26.3678 29.8318 28.2271C28.05 30.4371 25.7371 31.7613 22.8917 31.9086C20.5888 32.0274 18.2752 31.9328 15.9666 31.9328C15.9666 31.9335 15.9666 31.9349 15.9666 31.9356L15.9673 31.9371ZM15.9958 2.50834C15.9958 2.50265 15.9958 2.49696 15.9958 2.49127C14.0068 2.49127 12.0171 2.49838 10.0281 2.48842C8.90905 2.48273 7.82415 2.66488 6.82325 3.16012C3.99141 4.56115 2.51996 6.85801 2.49718 10.0208C2.46871 13.9976 2.48366 17.9752 2.49718 21.9527C2.49932 22.529 2.53349 23.1203 2.66305 23.6796C3.47388 27.1676 6.35626 29.4673 9.94981 29.4844C13.9755 29.5036 18.0011 29.4858 22.0268 29.4908C23.1224 29.4922 24.1816 29.3029 25.1605 28.8198C27.9959 27.4209 29.463 25.1219 29.4865 21.9598C29.5157 17.983 29.5086 14.0055 29.4801 10.0279C29.4751 9.29149 29.3762 8.53369 29.1818 7.82428C28.3561 4.80734 25.6154 2.61792 22.4938 2.52186C20.329 2.45569 18.1606 2.50905 15.9943 2.50905L15.9958 2.50834Z" fill="#010101"/>
          <svg x="7.13" y="7.13" width="17.9" height="17.9" viewBox="0 0 18 18"><path d="M8.94262 17.8982C3.9965 17.8882 -0.0134915 13.8715 3.4116e-05 8.94127C0.0142716 4.00387 4.03566 -0.00781554 8.96397 1.14337e-05C13.9008 0.00854995 17.9165 4.03446 17.9023 8.9619C17.8881 13.9142 13.8845 17.9074 8.94262 17.8975V17.8982ZM8.92838 15.412C12.5105 15.4227 15.4 12.5566 15.415 8.97827C15.4307 5.39209 12.529 2.48188 8.94404 2.48757C5.39321 2.49397 2.51224 5.36647 2.48804 8.92632C2.46384 12.4848 5.35975 15.4014 8.92909 15.412H8.92838Z" fill="#010101"/></svg>
          <svg x="23.335" y="5.351" width="3.476" height="3.475" viewBox="0 0 4 4"><path d="M3.47617 1.75263C3.46905 2.71179 2.68457 3.48239 1.72282 3.47527C0.763214 3.46816 -0.00917209 2.6819 8.23006e-05 1.72203C0.00933669 0.760736 0.793824 -0.0098661 1.75343 9.55019e-05C2.7166 0.0100571 3.48329 0.789908 3.47617 1.75263Z" fill="#010101"/></svg>
        </svg>
      </a>
      <a href="#" aria-label="LinkedIn">
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <svg x="11.63" y="11.13" width="22.91" height="23.41" viewBox="0 0 23 24"><path d="M0 0.481342H6.52977V3.69893C6.66147 3.55762 6.72051 3.50019 6.77349 3.43747C9.31137 0.383107 13.5932 -0.799497 17.3284 0.556907C20.0298 1.53775 21.7116 3.49112 22.489 6.21376C22.7244 7.03894 22.8833 7.91625 22.8901 8.7709C22.928 13.527 22.9083 18.2831 22.9083 23.0392C22.9083 23.1511 22.9083 23.2629 22.9083 23.405H15.9426C15.9358 23.2455 15.9221 23.0868 15.9221 22.9289C15.9252 18.9405 15.932 14.9514 15.9282 10.9631C15.9282 10.5747 15.9009 10.181 15.8305 9.79935C15.4158 7.55958 13.5841 6.27043 11.2006 6.47673C8.29637 6.72836 7.15648 8.7165 6.94152 10.9034C6.92335 11.0908 6.92865 11.2804 6.92865 11.4694C6.92865 15.2945 6.92865 19.1196 6.92865 22.9448V23.411H0V0.481342Z" fill="#010101"/></svg>
          <svg x="0.555" y="11.616" width="7.076" height="22.928" viewBox="0 0 8 23"><path d="M7.07625 22.9282H0V0H7.07625V22.9282Z" fill="#010101"/></svg>
          <svg x="0" y="0" width="8.166" height="8.164" viewBox="0 0 9 9"><path d="M-0.000129579 4.0348C0.0165222 1.78294 1.87092 -0.0283724 4.13027 -0.000413041C6.37523 0.0275463 8.17514 1.85397 8.1653 4.09525C8.15546 6.36222 6.33512 8.16975 4.06896 8.16295C1.78388 8.15615 -0.0167814 6.32897 -0.000129579 4.0348Z" fill="#010101"/></svg>
        </svg>
      </a>
    </div>
  </div>
</footer>`;

  // ── Flower SVGs ──
  function buildFlowerSVGs() {
    var f0 = '<svg xmlns="http://www.w3.org/2000/svg" width="87" height="87" viewBox="0 0 87 87">'
      + '<defs><linearGradient id="f0bg" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#476e46"/><stop offset="1" stop-color="#de84d6"/></linearGradient></defs>'
      + '<circle cx="43.5" cy="43.5" r="39.97" fill="url(#f0bg)"/>'
      + '<svg x="41.697" y="31.283" width="4.615" height="4.776" viewBox="0 0 5 5"><path d="M2.30856 4.77633C5.37956 4.77633 5.38664 0 2.30856 0C-0.76952 0 -0.76952 4.77633 2.30856 4.77633Z" fill="white"/></svg>'
      + '<svg x="56.939" y="25.587" width="4.615" height="4.776" viewBox="0 0 5 5"><path d="M2.30856 4.77633C5.37956 4.77633 5.38664 0 2.30856 0C-0.76952 0 -0.76952 4.77633 2.30856 4.77633Z" fill="white"/></svg>'
      + '<svg x="38.282" y="37.231" width="35.489" height="14.574" viewBox="0 0 36 15"><path d="M0.396121 10.6804C5.49087 13.5038 11.4065 15.0464 17.2442 14.4449C22.3885 13.9142 27.2993 11.6994 30.9576 8.00569C32.9389 6.00317 34.4673 3.61147 35.4367 0.965025C35.7905 0.00268217 34.2479 -0.414804 33.9012 0.540463C32.2949 4.92761 28.8843 8.43733 24.7802 10.5885C20.1949 12.9872 14.8383 13.4896 9.79311 12.4848C6.77164 11.8834 3.88461 10.7866 1.19571 9.30061C0.297057 8.80529 -0.502536 10.178 0.389046 10.6734L0.396121 10.6804Z" fill="white"/></svg>'
      + '</svg>';

    var f1 = '<svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 92 92">'
      + '<defs><radialGradient id="f1g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(46.0019 46) scale(46.0399 45.9619)"><stop offset="0.25" stop-color="#E94100"/><stop offset="0.44" stop-color="#EC4504"/><stop offset="0.68" stop-color="#F55412"/><stop offset="0.85" stop-color="#FF6422"/></radialGradient></defs>'
      + '<path d="M73.6585 21.8779C71.7504 21.3653 70.7721 20.6657 70.2378 18.657C67.2925 7.62973 57.4954 0.0900517 46.2933 5.01676e-06C34.838 -0.0900417 24.9195 7.30071 21.877 18.4596C21.2942 20.5999 20.2812 21.3376 18.2413 21.8952C7.33756 24.8806 -0.0414553 34.8169 0.00017525 46.1351C0.0418058 57.2905 7.37225 67.019 18.2205 70.0251C20.2396 70.5827 21.2699 71.362 21.8735 73.485C25.0687 84.7374 34.9421 92.1247 46.2725 92C57.5128 91.8753 67.1606 84.4465 70.2205 73.3326C70.7721 71.3274 71.7816 70.6382 73.6723 70.1152C84.753 67.0432 92.0002 57.3944 92.0002 45.9896C92.0002 34.5952 84.6628 24.839 73.6585 21.8779Z" fill="url(#f1g)"/>'
      + '<svg x="28.846" y="30.848" width="32.583" height="32.839" viewBox="0 0 33 33"><path d="M16.2637 0C18.144 9.1051 23.5698 14.5287 32.5828 16.4855C23.6635 18.3903 18.2272 23.7689 16.2186 32.8393C14.3313 23.8104 8.90199 18.4803 0 16.482C8.91934 14.4767 14.418 9.08779 16.2637 0Z" fill="white"/></svg>'
      + '</svg>';

    var f2 = '<svg xmlns="http://www.w3.org/2000/svg" width="73.16" height="72.93" viewBox="0 0 73.16 72.93">'
      + '<svg x="26.67" y="26.65" width="19.6" height="19.49" viewBox="0 0 20 20"><path d="M9.75 19.49C9.27 18.24 8.79 17.23 8.5 16.17C8.11 14.77 7.39 14.62 6.2 15.25C5.24 15.76 4.21 16.15 2.86 16.76C3.66 14.93 4.31 13.46 5.05 11.78C3.34 11.11 1.8 10.49 0 9.78C1.77 9.08 3.27 8.48 4.98 7.8C4.31 6.18 3.7 4.73 3.08 3.23C3.39 3.15 3.54 3.06 3.65 3.1C5.08 3.57 6.91 4.82 7.84 4.33C8.89 3.78 9.14 1.69 9.84 0C10.56 1.75 11.19 3.29 11.89 5C13.54 4.24 15.01 3.57 16.83 2.74C16.04 4.51 15.39 5.96 14.62 7.7C16.26 8.38 17.79 9.02 19.6 9.77C17.83 10.5 16.3 11.13 14.6 11.84C15.37 13.52 16.04 14.98 16.73 16.47C16.48 16.5 16.32 16.56 16.2 16.52C14.76 16 13 14.7 11.99 15.14C10.93 15.6 10.59 17.72 9.76 19.48L9.75 19.49Z" fill="#2E539E"/></svg>'
      + '<svg x="48.73" y="34.593" width="24.43" height="3.682" viewBox="0 0 25 4"><path d="M0 1.2471C6.69 0.827103 13.37 0.357101 20.07 0.00710139C21.15 -0.0528986 22.29 0.277104 23.34 0.627104C23.81 0.787104 24.42 1.4171 24.43 1.8371C24.43 2.2471 23.83 2.9071 23.37 3.0571C22.33 3.4071 21.19 3.7271 20.11 3.6771C13.42 3.3271 6.73 2.8771 0.0499992 2.4571C0.0399992 2.0571 0.0300021 1.6471 0.0100021 1.2471H0Z" fill="#2E539E"/></svg>'
      + '<svg x="44.94" y="44.91" width="17.689" height="17.58" viewBox="0 0 18 18"><path d="M0.800003 0C5.55 4.07 10.35 8.1 15.03 12.25C16.06 13.16 16.78 14.47 17.49 15.68C17.74 16.1 17.76 17.13 17.52 17.28C17.04 17.57 16.16 17.7 15.7 17.44C14.47 16.75 13.19 16 12.27 14.97C8.12 10.29 4.08 5.5 0 0.75C0.26 0.5 0.530001 0.259998 0.790001 0.00999832L0.800003 0Z" fill="#2E539E"/></svg>'
      + '<svg x="10.67" y="10.52" width="17.07" height="16.86" viewBox="0 0 18 17"><path d="M17.07 16.86C11.16 12.89 5.18 9.05 0.87 3.3C0.24 2.46 0.27 1.11 0 0C1.14 0.33 2.62 0.319999 3.37 1.05C6.45 4.05 9.4 7.21 12.23 10.44C13.99 12.45 15.46 14.71 17.07 16.86Z" fill="#2E539E"/></svg>'
      + '<svg x="34.535" y="-0.01" width="3.863" height="23.77" viewBox="0 0 4 24"><path d="M1.44464 23.76C0.954637 17.63 0.404637 11.49 0.0146369 5.35C-0.0753631 3.97 0.264638 2.53 0.624638 1.17C0.764638 0.659998 1.50464 0.0199982 2.00464 -0.0100018C2.42464 -0.0300018 2.93464 0.709998 3.31464 1.19C3.53464 1.46 3.62464 1.88 3.65464 2.24C4.28464 9.49 3.40464 16.62 2.11464 23.72L1.44464 23.75V23.76Z" fill="#2E539E"/></svg>'
      + '<svg x="0" y="34.596" width="24.11" height="3.681" viewBox="0 0 25 4"><path d="M24.1 2.4337C17.49 2.8637 10.89 3.3237 4.28 3.6737C3.2 3.7337 2.06 3.4337 1.01 3.0937C0.56 2.9537 0 2.2737 0 1.8437C0 1.4137 0.57 0.793701 1.03 0.593701C1.84 0.253701 2.76 -0.0362988 3.62 0.00370123C10.45 0.353701 17.28 0.793702 24.11 1.2037C24.11 1.6137 24.11 2.0237 24.11 2.4337H24.1Z" fill="#2E539E"/></svg>'
      + '<svg x="10.584" y="45.09" width="17.386" height="17.259" viewBox="0 0 18 18"><path d="M17.3857 0.599998C13.4257 5.25 9.51567 9.93 5.48567 14.52C4.57567 15.56 3.34567 16.39 2.14567 17.1C1.61567 17.41 0.765668 17.17 0.0656679 17.18C0.0856679 16.51 -0.154332 15.65 0.175668 15.2C1.48567 13.4 2.77567 11.51 4.43567 10.06C8.41567 6.58 12.5957 3.34 16.6957 0L17.3857 0.599998Z" fill="#2E539E"/></svg>'
      + '<svg x="34.928" y="49.15" width="3.463" height="23.78" viewBox="0 0 4 24"><path d="M1.42179 0C3.03179 7.09 3.93179 14.22 3.21179 21.45C3.13179 22.27 2.13179 23.01 1.55179 23.78C1.02179 22.98 0.0617877 22.19 0.0517877 21.38C-0.0382123 17.01 -0.0282103 12.63 0.22179 8.27C0.38179 5.5 1.00179 2.76 1.42179 0Z" fill="#2E539E"/></svg>'
      + '<svg x="46.46" y="10.391" width="16.17" height="16.192" viewBox="0 0 17 17"><path d="M0.0104271 16.079C0.0204271 15.839 -0.0395758 15.589 0.0504242 15.459C3.92042 10.179 7.63043 4.74899 13.0004 0.788988C13.4204 0.478988 13.8704 0.108987 14.3504 0.0289873C14.8804 -0.0510127 15.5704 0.0289868 15.9704 0.338987C16.2204 0.528987 16.2304 1.36899 16.0304 1.73899C15.3704 2.88899 14.7504 4.15899 13.7804 5.01899C9.49043 8.80899 5.08043 12.469 0.700426 16.159C0.590426 16.249 0.290427 16.129 0.0104271 16.099V16.079Z" fill="#2E539E"/></svg>'
      + '</svg>';

    var f3 = '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="94" viewBox="0 0 90 94">'
      + '<defs><radialGradient id="f3g" cx="0.5" cy="0.5" r="0.55"><stop offset="0" stop-color="#FFD93D"/><stop offset="1" stop-color="#F5A623"/></radialGradient></defs>'
      + '<svg x="2" y="5.055" width="85.442" height="89.488" viewBox="0 0 86 89"><path d="M80.1947 51.2448C75.917 47.7677 70.7546 47.0262 65.5101 46.7956C60.1607 46.5604 54.7977 46.6509 49.4437 46.4836C47.5147 46.4248 45.5947 46.0314 43.6748 45.7918C43.6748 45.6335 43.6839 45.4753 43.6885 45.317C47.1726 44.9643 50.6477 44.485 54.141 44.2951C58.8975 44.0419 63.6768 44.1685 68.4288 43.843C72.638 43.5536 76.6102 42.3508 80.0396 39.6876C84.4313 36.2783 86.3376 31.8742 84.9101 26.5432C83.542 21.4338 80.45 17.4457 75.0003 16.1028C69.6008 14.7734 64.9172 16.6635 60.8493 20.1406C55.8283 24.4361 53.1605 30.4047 49.7265 35.8306C47.8704 38.7697 45.7817 41.5595 43.8025 44.4172C43.652 44.3268 43.506 44.2409 43.3601 44.1549C43.5608 43.6214 43.7614 43.0878 43.9621 42.5588C45.9003 37.4177 48.8007 32.7876 51.578 28.0715C54.2595 23.5183 56.5124 18.7751 56.3391 13.2542C56.1019 5.79802 51.8835 0.869453 44.4044 0.10982C32.8438 -1.07032 27.4533 7.45293 29.0039 16.4464C29.6104 19.9688 31.2066 23.4007 32.8118 26.6517C34.709 30.4906 37.1214 34.0762 39.2648 37.7975C39.8942 38.8918 40.3776 40.0764 40.8929 41.234C41.3809 42.3327 41.8187 43.4541 42.2747 44.5619L41.732 44.8648C38.8727 40.5693 35.9722 36.2964 33.1676 31.9646C31.877 29.9706 30.9786 27.6962 29.5329 25.8333C27.9003 23.7308 26.0305 21.7367 23.9555 20.0683C17.4341 14.8096 7.56077 13.53 2.18403 22.7134C-0.4975 27.2983 -0.903378 32.037 2.05634 36.6717C3.89419 39.5519 6.66237 41.4374 9.83642 42.6176C14.8939 44.4986 20.2205 44.8061 25.5288 44.5212C31.0105 44.2273 36.4009 44.7563 41.7959 45.5747C37.1625 46.6509 32.4789 46.9629 27.7635 47.0533C23.7412 47.1302 19.7052 47.198 15.7011 47.5733C10.9628 48.0164 6.77182 49.8567 3.48831 53.4107C0.282333 56.8788 -0.616071 60.8623 0.929913 65.3342C2.99579 71.3073 7.75687 75.1326 13.3434 75.1552C17.8217 75.1733 21.689 73.4731 24.9269 70.4437C28.2149 67.3689 30.6456 63.6522 32.8666 59.7771C34.4445 57.0235 36.068 54.2924 37.842 51.6608C39.1417 49.7346 40.6284 47.9305 42.1106 46.0405C40.2225 51.0097 37.7873 55.6986 34.9096 60.1886C32.6112 63.7743 30.7961 67.6131 29.7427 71.764C27.3029 81.3905 32.9213 89.1948 42.4936 89.4797C49.4437 89.6877 54.4693 86.1699 56.0472 79.9345C56.7769 77.0543 56.9912 74.0881 55.9469 71.2847C54.7338 68.011 53.4843 64.6831 51.7148 61.6853C48.8007 56.7386 45.7224 51.9005 43.4878 46.2711C43.5699 46.3796 43.652 46.4791 43.7386 46.5785C47.3505 50.7294 50.4242 55.2329 53.0829 60.0439C55.1899 63.8647 57.689 67.4503 61.0044 70.3532C64.8625 73.7309 69.3819 75.63 74.5671 74.6397C80.5321 73.4957 83.5739 69.1595 85.0287 63.7245C86.4151 58.5473 84.1942 54.5095 80.1992 51.2629L80.1947 51.2448Z" fill="url(#f3g)"/></svg>'
      + '</svg>';


    var f5 = '<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81">'
      + '<defs><radialGradient id="f5g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40.4999 40.5) scale(50.5647 50.5499)"><stop stop-color="#F4E0F2"/><stop offset="0.06" stop-color="#EED2EC"/><stop offset="0.32" stop-color="#D698D3"/><stop offset="0.52" stop-color="#C674C3"/><stop offset="0.62" stop-color="#C167BE"/></radialGradient></defs>'
      + '<path d="M79.4286 46.6227C77.5269 42.7492 77.3454 39.0273 79.2381 35.124C80.1339 33.2735 81.0921 31.3694 80.8124 29.2631C81.113 27.0258 80.5654 24.9105 79.5149 23.1909C76.6431 18.4843 71.2655 15.3753 65.4653 17.1395C63.5607 17.7197 63.4208 17.1485 63.9089 15.4586C64.9981 11.6921 64.1142 8.11011 61.8644 5.08741C57.9748 -0.133882 52.1211 -1.29417 46.178 1.60357C42.4938 3.40053 38.8066 3.58796 35.0003 1.85348C33.1998 1.03236 31.4202 0.044624 29.3281 -2.47114e-06C21.8733 -0.154708 15.1476 6.72074 16.8558 14.8963C17.3171 17.1068 16.8558 17.6483 14.7488 16.9938C11.1538 15.8751 8.10047 17.2645 5.24354 19.0109C-0.107257 22.2865 -1.21729 28.906 1.27062 34.1363C3.24666 38.2865 3.6514 42.4665 1.4343 46.715C0.0385656 49.3866 -0.363191 52.1981 0.336163 55.2267C1.7557 61.3525 9.83547 66.1364 15.6059 64.1342C16.1177 63.9557 16.6356 63.3606 17.1653 63.8694C17.6772 64.3632 17.1325 64.9464 17.0016 65.464C15.8023 70.2123 17.1504 74.4221 20.4805 77.6649C24.4802 81.5593 29.2686 81.8717 34.3724 79.4797C37.8066 77.8702 41.5147 77.3109 45.1186 78.9472C46.556 79.5987 47.9696 80.286 49.4903 80.643C58.817 82.8327 65.5486 73.479 64.2035 67.1033C63.4803 63.679 63.4863 63.5927 66.9057 64.1788C72.3487 65.113 76.2562 62.599 79.1578 58.4696C81.7796 54.7388 81.354 50.5439 79.4286 46.6198V46.6227ZM43.452 51.8024H36.8424V31.3843H43.452V51.8024Z" fill="url(#f5g)"/>'
      + '</svg>';

    return [f0, f1, f2, f3, f5];
  }

  function scaleSVG(svg, factor) {
    return svg.replace(
      /^(<svg\s[^>]*?)width="([^"]+)"\s*height="([^"]+)"/,
      function(m, pre, w, h) {
        return pre + 'width="' + (parseFloat(w) * factor) + '" height="' + (parseFloat(h) * factor) + '"';
      }
    );
  }

  // ── Particle system ──
  function createParticle(x, y, vx, vy) {
    return {
      x: x, y: y, vx: vx, vy: vy,
      imgIndex: Math.floor(rand(flowerImages.length)),
      rotation: rand(TWO_PI),
      rotSpeed: rand(-0.02, 0.02),
      scale: 0,
      targetScale: rand(0.6, 1.2),
      age: 0,
      scaleUpDuration: 20,
      displaySize: rand(75, 105),
      drag: 0.995,
      wobbleOffset: rand(TWO_PI)
    };
  }

  function updateParticle(pt) {
    pt.age++;
    if (pt.age < pt.scaleUpDuration) {
      var t = pt.age / pt.scaleUpDuration;
      var c1 = 1.70158;
      var c3 = c1 + 1;
      pt.scale = pt.targetScale * (1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2));
    } else {
      pt.scale = pt.targetScale;
    }
    pt.vy += GRAVITY;
    pt.vx *= pt.drag;
    pt.vx += Math.sin(pt.age * 0.08 + pt.wobbleOffset) * 0.05;
    pt.rotSpeed += pt.vy * 0.00015;
    pt.rotation += pt.rotSpeed;
    pt.x += pt.vx;
    pt.y += pt.vy;

    var radius = pt.displaySize * pt.scale / 2;
    if (pt.y - radius <= 0) {
      pt.y = radius;
      pt.vy = Math.abs(pt.vy) * 0.6;
    }
  }

  function displayParticle(p, pt) {
    var img = flowerImages[pt.imgIndex];
    if (!img || img.width === 0) return;
    p.push();
    p.translate(pt.x, pt.y);
    p.rotate(pt.rotation);
    var s = pt.displaySize * pt.scale;
    var aspect = img.height / img.width;
    p.image(img, 0, 0, s, s * aspect);
    p.pop();
  }

  function isOffScreen(pt) {
    return pt.y > currentDesignH + 100 || pt.x < -100 || pt.x > currentDesignW + 100;
  }

  function spawnFlowers(x, y) {
    for (var i = 0; i < 4; i++) {
      var angle = mapVal(i, 0, 4, -PI * 0.8, PI * 0.8) + rand(-0.3, 0.3);
      var speed = rand(2, 4);
      var vx = Math.cos(angle - HALF_PI) * speed;
      var vy = Math.sin(angle - HALF_PI) * speed - rand(1, 2.5);
      particles.push(createParticle(x, y, vx, vy));
    }
  }

  // ── Footer scaling ──
  function applyFooterScale() {
    var footer = document.getElementById('sanjana-footer');
    var scaler = footer.querySelector('.footer-scaler');
    var isMobile = window.innerWidth <= MOBILE_BP;
    currentDesignW = isMobile ? MOBILE_W : DESKTOP_W;
    currentDesignH = isMobile ? MOBILE_H : DESKTOP_H;
    var w = footer.offsetWidth;
    scaleFactor = w / currentDesignW;
    footer.style.height = (currentDesignH * scaleFactor) + 'px';
    scaler.style.transform = 'scale(' + scaleFactor + ')';
  }

  // ── Injection ──
  function injectFont() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"][href*="Inter"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap';
    document.head.appendChild(link);
  }

  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = FOOTER_CSS;
    document.head.appendChild(style);
  }

  function injectHTML() {
    var existing = document.getElementById('sanjana-footer');
    if (existing) {
      existing.outerHTML = FOOTER_HTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }
  }

  function loadP5(callback) {
    if (window.p5) { callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // ── p5 sketch (instance mode) ──
  function startSketch() {
    var canvasParent = document.getElementById('sanjana-footer-canvas');

    new p5(function(p) {

      p.preload = function() {
        var svgs = buildFlowerSVGs();
        for (var i = 0; i < svgs.length; i++) {
          var hiRes = scaleSVG(svgs[i], 4);
          flowerImages.push(p.loadImage('data:image/svg+xml;base64,' + btoa(hiRes)));
        }
      };

      p.setup = function() {
        applyFooterScale();
        var footer = document.getElementById('sanjana-footer');
        var canvas = p.createCanvas(footer.offsetWidth, footer.offsetHeight);
        p.imageMode(p.CENTER);

        footer.addEventListener('mousedown', function(e) {
          if (e.target.closest('a')) return;
          mouseHeld = true;
          var rect = footer.getBoundingClientRect();
          cursorX = (e.clientX - rect.left) / scaleFactor;
          cursorY = (e.clientY - rect.top) / scaleFactor;
          spawnFlowers(cursorX, cursorY);
        });
        window.addEventListener('mouseup', function() {
          mouseHeld = false;
        });

        footer.addEventListener('mouseenter', function() {
          cursorOver = true;
          cursorFlowerIndex = Math.floor(rand(flowerImages.length));
          cursorAge = 0;
        });
        footer.addEventListener('mouseleave', function() {
          cursorOver = false;
        });
        footer.addEventListener('mousemove', function(e) {
          var rect = footer.getBoundingClientRect();
          cursorX = (e.clientX - rect.left) / scaleFactor;
          cursorY = (e.clientY - rect.top) / scaleFactor;
          cursorAge++;
        });

        new IntersectionObserver(function(entries) {
          if (entries[0].isIntersecting) {
            spawnFlowers(currentDesignW / 2, currentDesignH / 2);
          }
        }, { threshold: 0.4 }).observe(footer);
      };

      p.draw = function() {
        if (mouseHeld && p.frameCount % 15 === 0) {
          spawnFlowers(cursorX, cursorY);
        }
        p.clear();
        p.push();
        p.scale(scaleFactor);
        for (var i = particles.length - 1; i >= 0; i--) {
          updateParticle(particles[i]);
          displayParticle(p, particles[i]);
          if (isOffScreen(particles[i])) {
            particles.splice(i, 1);
          }
        }

        if (cursorOver && flowerImages.length > 0) {
          var img = flowerImages[cursorFlowerIndex];
          if (img && img.width > 0) {
            var pulse = 0.85 + 0.1 * Math.sin(p.frameCount * 0.03);
            var size = 35 * pulse;
            var aspect = img.height / img.width;
            p.push();
            p.translate(cursorX, cursorY);
            p.image(img, 0, 0, size, size * aspect);
            p.pop();
          }
        }

        p.pop();
      };

      p.windowResized = function() {
        applyFooterScale();
        var footer = document.getElementById('sanjana-footer');
        p.resizeCanvas(footer.offsetWidth, footer.offsetHeight);
      };

    }, canvasParent);
  }

  // ── Boot ──
  function init() {
    injectFont();
    injectCSS();
    injectHTML();
    loadP5(startSketch);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
