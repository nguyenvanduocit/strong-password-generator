document.addEventListener("DOMContentLoaded", function (event) {
    /**
     * Default option
     */
    var defaultOptions = {
        type: 'reqevery',
        canUpper: true,
        canLower: true,
        canDigital: true,
        canSpecial: false,
        mindigits: 2,
        length: 12,
        ambig: false
    };
    var currentOptions = {};
    var prev_pass = 'NONE';
    /**
     * Define some UI
     * @type {Element}
     */
    var btn_generate = $('#btn-generate');
    var txt_password = $('#password_text');
    var txt_lastPass = $('#lastPass');
    loadOptionForm(onOptionLoaded);
    setupUI();
    /**
     * Setup UI
     */
    function setupUI() {
        var btn_show_advanced = $('#btn_show_advanced');
        btn_show_advanced.on('click', function () {
            btn_show_advanced.remove();
            $('#advanced_options').show();
        });
        $('#status').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
            var target = $(e.currentTarget);
            target.removeClass('bounceIn');
        });
    }

    /**
     * action on optionsloaded
     * @param items
     */
    function onOptionLoaded(items) {
        console.log(items);
        currentOptions = items;
        setupForm();
        setupClipboard();
    }

    /**
     * Function define
     */
    function updateOption(key, value) {
        var updateData = {};
        updateData[key] = value;
        chrome.storage.sync.set(updateData, function () {
            currentOptions[key] = value;
            console.log('saved', currentOptions);
            coppyPassword();
        });
    }

    function loadOptionForm(callback) {
        chrome.storage.sync.get(defaultOptions, callback);
    }

    /**
     * setup the form
     */
    function setupForm() {
        $.each(currentOptions, function (key, value) {
            var $target = $('*[name="' + key + '"]');
            var type = '';
            if ($target.length == 1) {
                type = $target.attr('type');
            } else if ($target.length > 1) {
                type = $target.eq(0).attr('type');
            }

            switch (type) {
                case 'text':
                    $target.on('keyup', handleInputChange);
                    $target.val(value);
                    $target.trigger('keyup');
                    break;
                case 'radio':
                    $target.each(function () {
                        var $currentTarget = $(this);
                        $currentTarget.on('click', handleInputChange);
                        if($currentTarget.val() == value){
                            $currentTarget.prop('checked', true);
                            $currentTarget.trigger('click');
                        }
                    });
                    break;
                case 'button':
                    $target.each(function () {
                        var $currentTarget = $(this);
                        $currentTarget.on('click', handleInputChange);
                        if($currentTarget.val() == value){
                            $currentTarget.addClass('active');
                        }
                    });
                    break;
                case 'checkbox':
                    $target.on('change', handleInputChange);
                    $target.prop('checked', value);
                    $target.trigger('change');
                    break;
                default :
                    $target.on('change', handleInputChange);
                    break;
            }
        });
        var password_text = $('#password_text');
        password_text.on('click', coppyPassword());
    }

    /**
     * Handle on input changed
     * @param e
     */
    function handleInputChange(e) {
        var $target = $(e.currentTarget);
        var key = $target.attr('name');
        var value = null;
        switch ($target.attr('type')) {
            case 'text':
            case 'radio':
            case 'button':
                value = $target.val();
                if ((key == 'type')) {
                    if (value == 'pronounceable') {
                        $('#canDigital_container').hide();
                        $('#canSpecial_container').hide();
                        $('#mindigits_container').hide();
                    } else {
                        $('#canDigital_container').show();
                        $('#canSpecial_container').show();
                        $('#mindigits_container').show();
                    }
                }else if(key == 'length'){
                    $('button[name="length"]').removeClass('active');
                    $target.addClass('active');
                }
                break;
            case 'checkbox':
                value = $target.prop('checked');
                if ($target.attr('name') == 'canDigital') {
                    if (value == true) {
                        $('#mindigits_container').show();
                    } else {
                        $('#mindigits_container').hide();
                    }
                }
                break;
        }
        if (value !== null) {
            if (value != currentOptions[key]) {
                updateOption(key, value);
            }
            else {
                coppyPassword();
            }
        }
    }

    /**
     * setup clipboard
     */
    function setupClipboard() {
        /**
         * Create clipboard
         * @type {Clipboard|*}
         */
        var clipboard = new Clipboard('#btn-generate', {
            text: function (trigger) {
                return generatePassword();
            }
        });

        /**
         * Update text box
         */
        clipboard.on('success', function (e) {
            txt_lastPass.text(prev_pass);
            txt_password.val(e.text);
            prev_pass = e.text;
            $('#status').addClass('bounceIn');
            console.log('hihi');
            e.clearSelection();
        });
        /**
         * generate on open
         */
        coppyPassword();
    }

    function coppyPassword() {
        btn_generate.trigger('click');
    }

    function generatePassword() {
        var password = Generator.generate(currentOptions);
        if (password) {
            return password;
        }
        else {
            return 'no password';
        }
    }
});