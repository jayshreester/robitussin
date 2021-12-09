(function($) {
  const dropdownSelector = '.gigya-composite-control-dropdown',
    dOpenedClass = 'dropdown-opened-js';

  $(document).ready(() => {
    $('body').on('click', e => {
      let t = $(e.target);

      if (t.is(`${dropdownSelector}, ${dropdownSelector} *:not(select)`)) {
        e.preventDefault();
      }

      if (t.is(`${dropdownSelector} select:not(option)`)) {
        t = t.closest(dropdownSelector);
        if (!$(dropdownSelector).is(`.${dOpenedClass}`))
          t.addClass(dOpenedClass);
        else t.removeClass(dOpenedClass);
      }

      $(dropdownSelector)
        .not(t)
        .removeClass(dOpenedClass);
    });
    $().on('click', e => {
      let t = $(e.target);
      if (t.is(`${dropdownSelector} select`)) {
        $(dropdownSelector)
          .not(t)
          .removeClass(dOpenedClass);
      }
    });

    $('body').on('click', e => {
      let t = $(e.target),
        formContainer;

      if (
        t.is(
          '#ciam-pch-unsubscribe input[type="checkbox"]:not([data-gigya-name])'
        )
      ) {
        formContainer = t.closest('#ciam-pch-unsubscribe');

        if (t.is(':checked'))
          formContainer
            .find('input[type="checkbox"][data-gigya-name]')
            .prop({ checked: false });
      } else if (
        t.is('#ciam-pch-unsubscribe input[type="checkbox"][data-gigya-name]')
      ) {
        formContainer = t.closest('#ciam-pch-unsubscribe');
        formContainer
          .find('input[type="checkbox"]:not([data-gigya-name])')
          .prop({ checked: false });
      }
    });
  });
})(Cog.jQuery());
