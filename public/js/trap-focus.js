/*
  When modal is open, trap the focus inside the modal -- 
  keyboard navigation should wrap from end of modal to the beginning, and vice versa.

  Based on: 
  https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
  and https://gist.githubusercontent.com/myogeshchavan97/d50d42aa9205573b811587d57c2e58a6/raw/c91616484e2aa2428bc68aaf207b5a8f8d2b9cec/trap_focus.js 
  by Yogesh Chavan

  Usage: trapFocusBySelector('#exampleModal');
*/

$(document).ready(function () {
  $('[id*="mysched"]').each(function (el) {
    $(this).click(function () {
      setTimeout(function () {
        thisSelector = '#' + $(this).attr('id') + '-s-lc-ms-modal';
        // thisSelector = '#' + $(this).attr('id') + '-s-lc-ms-modal';
        // var modal = $(this).next(thisSelector);
        // var iframe = modal.find('iframe');
        // console.log('first modal', modal);
        // console.log('iframe', iframe);
        trapFocusBySelector(thisSelector);
      }, 1000);
    });
  });
});

function trapFocusBySelector(selector) {
  // add all the elements inside modal which you want to make focusable
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  // const modal = document.querySelector(selector); // select the modal by it's id
  // console.log('modal', modal);
  var modal = $(this).next(thisSelector);
  var iframe = modal.find('iframe');
  console.log('first modal', modal);
  console.log('iframe', iframe);

  const firstFocusableElement = iframe.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  console.log('firstFocusableElement', firstFocusableElement);
  const focusableContent = iframe.querySelectorAll(focusableElements);
  console.log('focusableContent', focusableContent);
  const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

  document.addEventListener('keydown', function (e) {
    let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else {
      // if tab key is pressed
      if (document.activeElement === lastFocusableElement) {
        // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  });

  firstFocusableElement.focus();
}
