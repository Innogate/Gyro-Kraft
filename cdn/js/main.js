let resendTimer = null;

function startCountdown(seconds) {
  const $resendLink = $("#otp-resend");
  if ($resendLink.length === 0) {
    console.warn("Resend link not found!");
    return;
  }

  $resendLink.addClass("disabled").text(`Resend OTP in ${seconds}s`);
  clearInterval(resendTimer); // Clear any previous timer

  resendTimer = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(resendTimer);
      $resendLink.removeClass("disabled text-black-50").text("Resend OTP");
    } else {
      $resendLink.text(`Resend OTP in ${seconds}s`);
    }
  }, 1000);
}

async function aos_init() {
    AOS.init();
}

$(document).ready(function () {
    aos_init();
});