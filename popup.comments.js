/**
 * Better wrap the code below in a function that checks the document is loaded, 
 * like "window.addEventListener('DOMContentLoaded', callback);"
 */
(function($) {
    // Check is woocommerce checkout page, and that the popup has not been created already.
    if (!document.querySelector('.pmccoin-confirm-payment-popup__container') && document.querySelector('.woocommerce-checkout')) {
        /* Create the popup. */
        // You can also create the elements one by one and append them, or get the data from somewhere else, but in this case I've added them with innerHTML to keep things simple.
        var popup = document.createElement('div');
        popup.className = 'pmccoin-confirm-payment-popup__container hidden'; // Notice the hidden class.
        popup.innerHTML = '<div class="pmccoin-confirm-payment-popup" role="dialog" aria-labelledby="pmccoin-confirm-payment-popup__title" aria-describedby="pmccoin-confirm-payment-popup__message">' +
            // Just an icon.
        '<span class="pmccoin-confirm-payment-popup__icon"><svg height="96px" version="1.1" viewBox="0 0 24 24" width="96px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="miu" stroke="none" stroke-width="1"><g id="Artboard-1" transform="translate(-647.000000, -119.000000)"><g id="slice" transform="translate(215.000000, 119.000000)"/><path d="M648,130.5 C648,124.148725 653.148725,119 659.5,119 C665.851275,119 671,124.148725 671,130.5 C671,136.851275 665.851275,142 659.5,142 C653.148725,142 648,136.851275 648,130.5 Z M670,130.5 C670,124.70101 665.29899,120 659.5,120 C653.70101,120 649,124.70101 649,130.5 C649,136.29899 653.70101,141 659.5,141 C665.29899,141 670,136.29899 670,130.5 Z M658.668274,134.375 L660.125793,134.375 L660.125793,135.898438 L658.668274,135.898438 L658.668274,134.375 Z M657.093567,125.963135 C657.689273,125.321042 658.507136,125 659.54718,125 C660.509099,125 661.279355,125.274655 661.857971,125.823975 C662.436587,126.373294 662.725891,127.075191 662.725891,127.929688 C662.725891,128.447268 662.619691,128.867186 662.407288,129.189453 C662.194884,129.51172 661.766422,129.985348 661.121887,130.610352 C660.653135,131.064455 660.349183,131.448973 660.210022,131.763916 C660.070861,132.078859 660.001282,132.543942 660.001282,133.15918 L658.697571,133.15918 C658.697571,132.460934 658.780578,131.898195 658.946594,131.470947 C659.112611,131.043699 659.476377,130.554202 660.037903,130.002441 L660.62384,129.423828 C660.799622,129.257812 660.941223,129.084474 661.048645,128.903809 C661.243958,128.586424 661.341614,128.256838 661.341614,127.915039 C661.341614,127.436521 661.198793,127.021486 660.913147,126.669922 C660.627501,126.318358 660.155094,126.142578 659.495911,126.142578 C658.680477,126.142578 658.116518,126.445309 657.804016,127.050781 C657.628234,127.387697 657.528137,127.873532 657.503723,128.508301 L656.200012,128.508301 C656.200012,127.453608 656.497861,126.605228 657.093567,125.963135 C657.093567,125.963135 656.497861,126.605228 657.093567,125.963135 Z" fill="#97bdcd" id="circle-help-question-mark-outline-stroke"/></g></g></svg></span>' +
        '<h3 id="pmccoin-confirm-payment-popup__title" class="pmccoin-confirm-payment-popup__title">Confirm Payment</h3>' +
            // Price is empty, as I will get this later, when the user clicks on the payment button.
        '<span class="pmccoin-confirm-payment-popup__price"></span>' +
        '<p id="pmccoin-confirm-payment-popup__message" class="pmccoin-confirm-payment-popup__message">YES, use my PMC coin to pay for my purchase of products and/or services from PMCapital test.</p>' +
            // Buttons.
        '<div class="pmccoin-confirm-payment-popup__buttons-container">' +
        '<button class="pmccoin-confirm-payment-popup__button pmccoin-confirm-payment-popup__button--proceed">Yes, proceed!</button>' +
        '<button class="pmccoin-confirm-payment-popup__button pmccoin-confirm-payment-popup__button--cancel">Cancel</button>' +
        '</div>' +
        '</div>';

        // Append the popup before the 'body' closing tag.
        document.querySelector('body').appendChild(popup);
        
        // Add event listeners to the buttons.
        var popupButtonCancel = document.querySelector('.pmccoin-confirm-payment-popup__button--cancel');
        popupButtonCancel.addEventListener('click', function() {
            // If cancel is clicked, hide the popup.
            popup.classList.add('hidden');
        });

        // 'proceed' it's a flag used to check if the user has clicked the proceed button on submission (used later)
        var proceed = false;
        var popupButtonProceed = document.querySelector('.pmccoin-confirm-payment-popup__button--proceed');
        popupButtonProceed.addEventListener('click', function() {
            // If proceed is clicked, proceed to submission. 
            proceed = true;
            $( 'form.checkout' ).trigger('submit');
        });
    }

    // jQuery event fired on submission (checkout_place_order).
    $( 'form.checkout' ).on( 'checkout_place_order', function() {
        // Get the payment method.
        var $payment_method = jQuery( 'form.checkout input[name="payment_method"]:checked' ).val();
        // If it's PMC Coin, show the popup.
        if ( $payment_method === 'pmccoin' ) {
            // If proceed button has been clicked, hide the popup and submit the form,
            // else, show the popup.
            if (proceed) {
                popup.classList.add('hidden');
                // Set proceed to false again, so if some of the field is not valid on submission,
                // next time the user will click on the payment button, the popup will show again.
                proceed = false;
                return true;
                // Uncomment the line below to prevent form submission when testing.
                // return false;
            } else {
                // Get the price and show the popup.
                var popupPrice = document.querySelector('.pmccoin-confirm-payment-popup__price');
                var woocommercePriceAmount = document.querySelector('.order-total .woocommerce-Price-amount');
                popupPrice.textContent = woocommercePriceAmount.textContent;
                popup.classList.remove('hidden');
                popupButtonProceed.focus();
                // Prevent the submit AJAX call.
                return false;
            }
        }
        // Other payment methods, just submit the form.
        // Allow the submit AJAX call.
        return true;
    });
})(jQuery);
