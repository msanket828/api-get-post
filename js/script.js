$(document).ready(function () {


  // validation

  //for allow only character
  jQuery.validator.addMethod("charactersOnly", function (value) {
    return /^[a-zA-Z&\s]+$/i.test(value);
  })

  //for email validation
  jQuery.validator.addMethod("emailId", function (value) {
    return /^\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
  })

  //No only
  jQuery.validator.addMethod("numbersOnly", function (value) {
    return /^[0-9]+$/i.test(value);
  })

  var $form = $("#customerForm"), $successMsg = $(".alert");
  $form.validate({
    errorPlacement: function (error, element) {
      element.closest('.form-group').after(error);
    },
    rules: {
      cName: {
        required: true,
        charactersOnly: true,
      },
      cMailId: {
        required: true,
        emailId: true,
      },
      cContactNo: {
        required: true,
        numbersOnly: true
      },
      cAddress: {
        required: true
      }
    },
    messages: {
      cName: {
        required: "Name is required",
        charactersOnly: "Please enter characters only"
      },
      cMailId: {
        required: "Email ID is required",
        emailId: "Please enter valid email id",
      },
      cContactNo: {
        required: "Contact no is required",
        numbersOnly: "Please enter numbers only"
      },
      cAddress: {
        required: "Address is required"
      }
      // checkbox_declaration1: "Declaration policy should be Agree"
    },
    submitHandler: function () {
      $successMsg.show();
    }
  })

  $('.form-control-v2').on('blur', function () {
    if ($(this).val()) {
      $(this).addClass('has-content');
    } else {
      $(this).removeClass('has-content');
    }
  })

  $('.reset-btn').on('click', function () {
    $('#customerForm').trigger('reset');
  })


  $('.prev-cta').on('click', function () {
    $(this).addClass('d-none');
    $('.second-page').addClass('d-none');
    $('.first-page').removeClass('d-none');
    $('.second-page .customers-data').empty();
  })


  let url = "https://api.techved.com/api/User";
  $('#getCustomersList').on('click', function () {
    $(this).parent('.text-center').addClass('d-none');
    let customersData;
    let htmlData;
    //first step getting data from api and display
    $.get(url, function (data, status) {
      customersData = data;
      $(customersData).each(function () {
        htmlData = ` <li data-id="${this.id}">
        <div class="d-flex align-items-center mb-2">
        <span>Name :</span>
        <p>${this.name}</p>
        </div>
        <div class="d-flex align-items-center">
        <span>Email ID :</span>
        <p>${this.email}</p>
        </div>
        </li>`
        $('.first-page .customers-data').append(htmlData);
      })
    })
  })


  //After click on individual card customer details appear Get Request
  let currentPersonsId;
  let indCustomerData;
  $('body').on('click', '.first-page .customers-data li', function () {
    $('.prev-cta').removeClass('d-none');
    currentPersonsId = $(this).attr('data-id');
    $('.first-page').addClass('d-none');
    $('.second-page').removeClass('d-none');
    $.get(url + '/' + currentPersonsId, function (data, status) {      
        indCustomerData = `<div class="personal-info">
        <div class="d-flex align-items-center mb-2">
        <span>Name: </span>
        <p>${data.name}</p>
        </div>
        <div class="d-flex align-items-center mb-2">
        <span>Email id:</span>
        <p>${data.email}</p>
        </div>
        <div class="d-flex align-items-center mb-2">
        <span>Contact No: </span>
        <p>${data.phone}</p>
        </div>                          
        <div class="d-flex align-items-start mb-2">
        <span>City: </span>
        <p>${data.address}</p>
        </div>                      
        </div>
        `;
        $('.second-page .customers-data').append(indCustomerData);      
    })
  })

  //Post request
  $('#customerForm').on('submit', function (e) {
    e.preventDefault();
    var name = $('#cName').val();
    let email = $('#cMailId').val();
    let phone = $('#cContactNo').val();
    let address = $('#cAddress').val();
    if ($("#customerForm").valid()) {
      // alert(true);
      // console.log(user);
      // let url = "https://api.techved.com/api/User";
      url = "https://api.techved.com/api/User?name=" + name + "&email=" + email + "&address=" + address + "&phone=" + phone;
      // $.post(url,
      //   {        
      //     name: "name",
      //     email: "email",
      //     phone: "phone",
      //     address: "address"
      //   },
      //   function (data, status) {
      //     console.log(data);
      //     console.log(status);
      //   })


      $.post(url, function (data, status) {
        alert("Data: " + data + "\nStatus: " + status);
        $('.first-page .customers-data li').remove();
        //retrieve data after post
        $.get('https://api.techved.com/api/User', function (data, status) {
          $(data).each(function () {
            let htmlData = ` <li data-id="${this.id}">
              <div class="d-flex align-items-center mb-2">
              <span>Name :</span>
              <p>${this.name}</p>
              </div>
              <div class="d-flex align-items-center">
              <span>Email ID :</span>
              <p>${this.email}</p>
              </div>
              </li>`
            $('.first-page .customers-data').append(htmlData);
          })
        })
      });

    }


  });
})