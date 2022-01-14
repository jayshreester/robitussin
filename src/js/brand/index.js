(function($) {
  var mobileTarget = $('.tabs-nav-list');
  var desktopTarget = $('.tabs > .component-content');
  var productTabs = $('.new-product-tabs');
  function moveTabs(target) {
    $('.tabs-content').each(function(i, v) {
      target.append($(this));
    });
  }
  function tabsReWrap() {
    if ($(window).width() < 992) {
      moveTabs(mobileTarget);
      productTabs.addClass('mobile-tabs');
    } else {
      moveTabs(desktopTarget);
      productTabs.removeClass('mobile-tabs');
    }
  }
  if ($('.new-product-tabs').length) {
    $(document).ready(function() {
      tabsReWrap();
    });

    $(window).resize(function() {
      tabsReWrap();
    });
  }
  //accordion starts
  function customacc() {
    $('.accordion-head').click(function() {
      $(this)
        .parent()
        .toggleClass('is-active');
    });
  }
  if ($('.accordion').length) {
    $(document).ready(function() {
      customacc();
    });
  }
  //accordion ends
  $('.navigation-item-decoration').each(function() {
    $(this).removeAttr('tabindex');
  });

  $('.country-selected').each(function() {
    $(this).removeClass('external');
  });
})(Cog.jQuery());
