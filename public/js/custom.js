$(document).on("click", ".close", function () {
    $(this).closest('.modal').modal('hide'); // Corrected 'model' to 'modal'
});

$(document).ready(function () {
    $(".password_eye").on("click", function () {
        let inputField = $(this).closest(".form-floating").find("input");
        if (inputField.attr("type") === "password") {
            inputField.attr("type", "text");
            $(this).attr("src",$(this).data('openeye')); // Change to "eye-off" icon
        } else {
            inputField.attr("type", "password");
            $(this).attr("src",$(this).data('closeeye')); // Change back to "eye" icon
        }
    });
});


    document.addEventListener("DOMContentLoaded", function () {
        // Get all country options
        document.querySelectorAll(".country-option").forEach(item => {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                
                // Get selected country code
                let selectedCode = this.getAttribute("data-code");
                let selectedFlag = this.querySelector("img").src;
    
                // Update button text and hidden input
                document.getElementById("selectedCountryCode").innerText = selectedCode;
                document.getElementById("country_code").value = selectedCode;
            });
        });
    });
    



    document.addEventListener("DOMContentLoaded", function () {
        const userProfileMenu = document.querySelector(".user_profile_menu");
        const dropdownMenu = document.querySelector(".userdtls_hdr22_dropdown");
    
        if (userProfileMenu && dropdownMenu) {
            userProfileMenu.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevents the event from bubbling
                userProfileMenu.classList.toggle("open");
                dropdownMenu.classList.toggle("show");
            });
    
            // Hide dropdown when clicking outside
            document.addEventListener("click", function (event) {
                if (!userProfileMenu.contains(event.target)) {
                    userProfileMenu.classList.remove("open");
                    dropdownMenu.classList.remove("show");
                }
            });
        } else {
            // console.error("Dropdown or Profile Menu not found in the DOM.");
        }
    });
    