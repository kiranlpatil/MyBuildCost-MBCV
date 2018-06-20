var userMobileNumber;
var integrationKey;
var careerPluginHost = 'http://34.214.128.209';
function CareerPlugin() {

  this.applyForJob = function () {
    var phone_no = document.getElementById('career-plugin-mobile-no');
    var _pluginElement = document.getElementById('jobmosis-career-plugin');
    var key = _pluginElement.attributes.name.value;
    if (key) {
      integrationKey = key;
      var isCorrect = validateMobileNumber(phone_no.value);
      if (isCorrect) {
        userMobileNumber = phone_no.value;
        registrationStatus(phone_no.value);
      } else {
        document.getElementById('career-plugin-notification').innerHTML = "Number should be 10 digits."
      }
    } else {
      document.getElementById('career-plugin-notification').innerHTML = "Please provide integrationKey."
    }
  };

  this.load = function (headerBg, btnBg) {
    if (headerBg === undefined && btnBg === undefined) {
      headerBg = '#165fac';
      btnBg = '#8cc63f';
    }
    document.getElementById('jobmosis-career-plugin').innerHTML = "<h3 class='career-plugin-header' style='background-color:" + headerBg + "'>Apply for Jobs</h3>" +
      "<div class='plugin-form-wrap'>" +
      "<label for='career-plugin-mobile-no'>Enter Your Mobile Number</label>" +
      "<br>" +
      "<input id='career-plugin-mobile-no' type='tel' min='100'>" +
      "<br>" +
      "<span id='career-plugin-notification'></span>" +
      "<br>" +
      "<div class='plugin-btn-grp'>" +
      "<button id='career-plugin-submit' style='background-color:" + btnBg + "'>Apply</button>" +
      "</div>" +
      "</div>" + "<span class='plugin-foot-note'>Note: New applicant will be required to create their profile on our " +
      "career partner portal.</span>";

    function drag_start(event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' +
        (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
    }

    function drag_over(event) {
      event.preventDefault();
      return false;
    }

    function drop(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      var dm = document.getElementById('jobmosis-career-plugin');
      dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
      dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
      event.preventDefault();
      return false;
    }

    var dm = document.getElementById('jobmosis-career-plugin');
    dm.addEventListener('dragstart', drag_start, false);
    document.body.addEventListener('dragover', drag_over, false);
    document.body.addEventListener('drop', drop, false);


    document.getElementById("career-plugin-submit").addEventListener("click", this.applyForJob);
  };

  function registrationStatus(mobNo) {
    var _url = careerPluginHost + '/api/registrationstatus/' + mobNo + '?recruiterId=' + integrationKey;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", _url, true);
    xhttp.onload = registrationStatusHandler;
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  function registrationStatusHandler() {
    if (this.status == 200) {
      var _status = JSON.parse(this.response);
      if (_status.length) {
        //alert('You are getting redirected to our carrier partner Jobmosis');
        window.location.href = careerPluginHost + "/signin?phoneNumber=" + userMobileNumber + "&" +
          "integrationKey=" + integrationKey + "&" + "email=" + _status[0].email;
      } else {
        //alert('You are not registered, Kindly register with our carrier partner to apply for job');
        window.location.href = careerPluginHost + "/applicant-signup?phoneNumber=" +
          userMobileNumber + "&" + "integrationKey=" + integrationKey;
      }
    } else {
      console.log('server error');
    }
  }

  validateMobileNumber = function (phoneNumber) {
    var no = Number(phoneNumber);
    if (/^\d{10}$/.test(no)) {
      return true;
    } else {
      return false
    }
  };
}

