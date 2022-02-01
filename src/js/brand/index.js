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
<<<<<<< HEAD
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

=======

  function filtercon() {
    if ($(window).width() < 992) {
      $('.filteraccord').click(function() {
        $('.filtercontent').toggle(), $(this).toggleClass('active');
      });
    }
  }

  if ($('.filteraccord').length) {
    $(document).ready(function() {
      filtercon();
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

>>>>>>> aa4346cb88d88969ec879eceb16e58ffbaa68d91
  $('.country-selected').each(function() {
    $(this).removeClass('external');
  });

  if ($(window).width() >= 768) {
    $('.object1, .object2, .absolute-img-right').mouseover(function() {
      $(this)
        .find('.tooltip-data')
        .show();
    });
    $('.object1, .object2, .absolute-img-right').mouseout(function() {
      $(this)
        .find('.tooltip-data')
        .hide();
    });
  }
<<<<<<< HEAD
=======

  $('.megamenu-main-nav')
    .has('ul.navigation-root')
    .find('li')
    .append("<span class='mobilesubnavicon'>Click</span>");

  $('.mobilesubnavicon').click(function() {
    var menuName = $(this)
      .parent('li')
      .find('a')
      .attr('data-content-class');

    var show = $('.' + menuName);

    $(show)
      .addClass('activesubmenu')
      .siblings()
      .removeClass('activesubmenu');
    $('.megamenu-submenu-items-container').addClass('submenunavcontainer');
    $('.megamenu-main-nav ul.navigation-root').addClass('submenunav');
  });

  $('.backsubmenu').click(function() {
    $(this)
      .parents()
      .find('.megamenu-submenu-item')
      .removeClass('.activesubmenu');
    $('.megamenu-submenu-items-container').removeClass('submenunavcontainer');
    $('.megamenu-main-nav ul.navigation-root').removeClass('submenunav');
  });
  function transcriptsh() {
    $('.transcripttext').click(function() {
      $('.transcriptlist').slideToggle();
      $(this).toggleClass('active');
    });
  }
  if ($('.transcripttext').length) {
    $(document).ready(function() {
      transcriptsh();
    });
  }

  $('.filter-radio-as-list li').click(function() {
    $(this)
      .addClass('active')
      .siblings()
      .removeClass('active');
  });

  $('body').on('click touchstart', '.filter-item-js', function(e) {
    var seltext = $('.selected-item-js').text();
    $('.filteredtext').text(seltext);
  });
>>>>>>> aa4346cb88d88969ec879eceb16e58ffbaa68d91
})(Cog.jQuery());
