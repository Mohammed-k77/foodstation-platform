﻿$(function () {

    //#region login and register window

    const wrapper = document.querySelector(".wrapper ");
    const loginLinke = document.querySelector(".login-like");
    const registerLinke = document.querySelector(".register-like");

    registerLinke.addEventListener('click', () => {
        var form = document.getElementById('loginForm');
        form.reset();
        wrapper.classList.add('active');
    });


    loginLinke.addEventListener('click', () => {
        var form = document.getElementById('loginForm');
        wrapper.classList.remove('active');
    });


 //#endregion login and register window


    var userLoginButton = $("#Modal-Login button[name='login']").click(onUserLoginClick);

    function onRegisterGoClick() {
        var form = document.getElementById('loginForm');
        form.reset();
        wrapper.classList.add('active');
    }
    
    function onUserLoginClick() {
       // event.preventDefault();
        var loginLoading = document.querySelector(".loading ");
        loginLoading.classList.add('loginloader');

        var baseUrl = window.location.protocol + "//" + window.location.host;
        var loginUrl = "/Account/Login";
        var url = baseUrl + loginUrl;


        var antiForgeryToken = $("#Modal-Login input[name='__RequestVerificationToken']").val();

        var userName = $("#Modal-Login input[name = 'UserName']").val();
        var password = $("#Modal-Login input[name = 'Password']").val();
        var rememberMe = $("#Modal-Login input[name = 'RememberMe']").prop('checked');

        var userInput = {
            __RequestVerificationToken: antiForgeryToken,
            UserName: userName,
            Password: password,
            RememberMe: rememberMe
        };

        $.ajax({
            type: "POST",
            url: url,
            data: userInput,
            success: function (data) {
                loginLoading.classList.remove('loginloader');
                var parsed = $.parseHTML(data);

                var hasErrors = $(parsed).find("input[name='LoginInValid']").val() == "true";

                if (hasErrors == true) {

                    $("#Modal-Login").html(data);

                    registerLinke.addEventListener('click', () => {
                        wrapper.classList.add('active');
                    });

                    loginLinke.addEventListener('click', () => {
                        wrapper.classList.remove('active');
                    });

                    userLoginButton = $("#Modal-Login button[name='login']").click(onUserLoginClick);
                    $("#Modal-Login button[name = 'btnRegisterGo']").click(onRegisterGoClick);


                    var form = $("#loginf");

                    $(form).removeData("validator");
                    $(form).removeData("unobtrusiveValidation");
                    $.validator.unobtrusive.parse(form);
                    
                }
                else {
                    var currentPath = window.location.pathname;
                    location.href = currentPath;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var errorText = "Status: " + xhr.status + " - " + xhr.statusText;

                PresentClosableBootstrapAlert("#alert_placeholder_login", "danger", "Error!", errorText);

                console.error(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
            
        });
    }
})