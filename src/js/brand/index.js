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

  $('.country-selected').each(function() {
    $(this).removeClass('external');
  });

  if ($(window).width() >= 1201) {
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

  // lightbox

  //$('.bv-content-search-btn').attr('tabindex', '-1');

  $('.prodfindbtn').click(function() {
    $('.prod-find-modal, .prodfindlightbox').show();
  });
  $('.prod-find-close p').click(function() {
    $('.prod-find-modal, .prodfindlightbox').hide();
  });
  // lightbox ends

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
    var seltext = $(e.currentTarget).text();
    $('.filteredtext').text(seltext);
  });

  let page = $('.page-cough-cold-center');
  function init(topicToShow, moTarget) {
    moTarget.find('.' + topicToShow).click();
    page
      ?.find('.filteredtext')
      ?.closest('.box.component')[0]
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
  }

  function mutationHelper(page) {
    if (page) {
      let moTargets = $('.reference-bp-filter .class-filter.no-theme');
      let moTarget = moTargets[0];
      var urlObj = new URL(window.location.href);
      let topicToShow = urlObj?.searchParams?.get('topic');
      if (topicToShow) {
        if (moTarget && !moTarget.classList.contains('initiated')) {
          const callback = function(mutationsList, observer) {
            if (mutationsList[0].type === 'attributes') {
              init(topicToShow, moTargets);
            }
          };
          let mo = new MutationObserver(callback);
          mo.observe(moTarget, { attributes: true });
        } else {
          init(topicToShow, moTargets);
        }
      }
    }
  }

  if (document.readyState !== 'loading') {
    mutationHelper(page);
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      mutationHelper.bind(this, page)
    );
  }
})(Cog.jQuery());
