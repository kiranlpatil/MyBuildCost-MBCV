function CareerPluginLoad() {

  this.applyForJob = function () {
    var phone_no = document.getElementById('career-plugin-mobile-no');
    var tokenId = '5a1660c6d93f341403aedc18';
    var isCorrect = validateMobileNumber(phone_no.value);
    if (isCorrect) {
      // alert("We are redirecting to. Our carrier partner jobmosis");
      window.location.href = "http://localhost:8080/applicant-signup?phoneNumber=" + phone_no.value + "&" + "tokenId=" + tokenId;
    } else {
      document.getElementById('career-plugin-notification').innerHTML = "Number should be 10 digits."
    }
  };

  this.loadCareerPluginScript = function () {
    // document.getElementById('jobmosis-career-plugin').innerHTML = "<input id='career-plugin-mobile-no' type='number' min='100'><button id='career-plugin-submit'>submit</button><span id='career-plugin-notification'></span>";
    // var link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = '/career-plugin/career-plugin.css';
    // document.head.appendChild(link);
    document.getElementById('jobmosis-career-plugin').innerHTML = "<h3 class='career-plugin-header'>Apply for Jobs</h3>" +
      "<div class='plugin-form-wrap'>" +
      "<label for='career-plugin-mobile-no'>Enter Your Mobile Number</label>" +
      "<br>" +
      "<input id='career-plugin-mobile-no' type='tel' min='100'>" +
      "<br>" +
      "<span id='career-plugin-notification'></span>" +
      "<br>" +
      "<div class='plugin-btn-grp'>" +
      "<button id='career-plugin-submit'>Apply</button>" +
      "</div>" +
      "</div>" + "<span class='plugin-foot-note'>Note: New Users will be require to create their profile.</span>";

    function drag_start(event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    }
    function drag_over(event) {
      event.preventDefault();
      return false;
    }
    function drop(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      var dm = document.getElementById('jobmosis-career-plugin');
      dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
      dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
      event.preventDefault();
      return false;
    }
    var dm = document.getElementById('jobmosis-career-plugin');
    dm.addEventListener('dragstart',drag_start,false);
    document.body.addEventListener('dragover',drag_over,false);
    document.body.addEventListener('drop',drop,false);


    document.getElementById("career-plugin-submit").addEventListener("click", this.applyForJob);
  };
}

validateMobileNumber = function (phoneNumber) {
  var no = Number(phoneNumber);
  if (/^\d{10}$/.test(no)) {
    return true;
  } else {
    return false
  }
};
