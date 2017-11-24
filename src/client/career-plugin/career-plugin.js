/*

 inject into index.html file
 <script src="/career-plugin/career-plugin.js"></script>

 Below div used to load template where u want(it should be available before script load)
 <div id="jobmosis-career-plugin"></div>

 load script
 var docLoad = new CareerPluginLoad();
 docLoad.loadCareerPluginScript();

 */

function CareerPluginLoad() {

  this.applyForJob = function () {
    var phone_no = document.getElementById('career-plugin-mobile-no');
    var tokenId = 'xyz';
    var isCorrect = validateMobileNumber(phone_no.value);
    if (isCorrect) {
      alert("We are redirecting to. Our carrier partner jobmosis");
      window.location.href = "http://app.jobmosis.com/applicant-registration?phoneNumber=" + phone_no + "&" + "tokenId=" + tokenId;
    } else {
      document.getElementById('career-plugin-notification').innerHTML = "Invalid mobile number.number should be 10 digits."
    }
  };

  this.loadCareerPluginScript = function () {
    document.getElementById('jobmosis-career-plugin').innerHTML = "<input id='career-plugin-mobile-no' type='number' min='100'><button id='career-plugin-submit'>submit</button><span id='career-plugin-notification'></span>";
    document.getElementById("career-plugin-submit").addEventListener("click", this.applyForJob);
  };

};

validateMobileNumber = function (phoneNumber) {
  var no = Number(phoneNumber);
  if (/^\d{10}$/.test(no)) {
    return true;
  } else {
    return false
  }
}
