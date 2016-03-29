/**
 * App
 */

var App = App || {};


/**
 * App.scroll_to() scrolls window to selector.
 */

App.scroll_to = function scroll_to(selector) {
  var target = $(selector);

  if (target.length) {
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 750);
  }
};


/**
 * App.share_stats() displays share stats for a quiz.
 */

App.share_stats = function () {
  var quiz = $('meta[name="quiz"]').attr('content');
  var total = $('meta[name="total"]').attr('content');
  var number = window.localStorage[quiz];
  var percent = (Number(number) / Number(total)) * 100;
  $('.score--number').text(number);
  $('.score--percent').text(percent);
  $('.score--total').text(total);
};


/**
 * App.google_analytics() tracks user events for Google Analytics.
 */

App.google_analytics = function () {
  var category = $('meta[name="category"]').attr('content');

  $('.form--choice').on('click', function () {
    var input = $(this).find('input');
    ga('send', 'event', category, input.attr('name'), input.val());
  });

  $('button').on('click', function () {
    ga('send', 'event', category, 'click', 'submit');
  });

  $('.btn--facebook').on('click', function () {
    ga('send', 'event', category, 'click', 'facebook');
  });

  $('.btn--twitter').on('click', function () {
    ga('send', 'event', category, 'click', 'twitter');
  });
};


/**
 * App.select_listener() selects an answer for each question.
 */

App.select_listener = function () {
  var form = $('form');
  var fieldset = form.find('fieldset');

  $.each(fieldset, function () {
    var $fieldset = $(this);
    var choices = $(this).find('.form--choice');

    choices.on('click', function () {
      var $choice = $(this);

      // Remove any selected classes and uncheck inputs.
      choices.
        removeClass('form--choice-selected').
        find('input').removeAttr('checked');

      // Mark choice as selected and check input.
      $choice.
        addClass('form--choice-selected').
        find('input').attr('checked', true);

      // Clear error field.
      $fieldset.removeClass('form--error');
    });
  });
};


/**
 * App.validate_quiz() prohibits quiz submission if questions have
 * not been answered.
 */

App.submit_quiz = function () {
  var form = $('.form--quiz');
  var fieldset = form.find('fieldset');
  var quiz = $('meta[name="quiz"]').attr('content');
  var redirect = form.find('input[name="redirect"]').val();

  form.on('submit', function (e) {
    var correct = 0;
    var is_valid = true;
    var checked = form.find('input:checked');
    e.preventDefault();

    // Validate each fieldset.
    $.each(fieldset, function () {
      var $fieldset = $(this);

      if (!$fieldset.find('input').is(':checked')) {
        $fieldset.addClass('form--error');
        is_valid = false;
      }

      // Count correct answers.
      if (checked.data('correct')) {
        correct++;
      }
    });

    if (!is_valid) {
      App.scroll_to('.form--error:first');
    }

    // Save correct answers in localStorage.
    window.localStorage.setItem(quiz, correct);
    window.location = redirect;
  });
};


/**
 * App.submit_petition() handles petition submission to a Google Form.
 */

App.submit_petition = function() {
  var form = $('.form--petition');
  var redirect = form.find('[name="redirect"]').val();
  var gform = $(window).jqGoogleForms({
    'formKey': form.data('key')
  });

  form.on('submit', function (e) {
    e.preventDefault();
    gform.sendFormData(form.serialize());

    setTimeout(function () {
      window.location = redirect;
    }, 200);
  });
};


/**
 * App.init() kicks things off...
 */

App.init = (function init() {
  App.google_analytics();
  App.select_listener();
  App.share_stats();
  App.submit_petition();
  App.submit_quiz();
}());
