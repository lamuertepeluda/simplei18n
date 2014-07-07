var locales = ['en', 'it', 'de'];

$(document).ready(function () {

    var locale = localStorage.getItem("selectedLanguage");
    locale = locale === null ? navigator.language : locale;
    var count = locales.length;
    locales.forEach(function (l) {
        $('#languages').append('<option value="' + l + '">' + l.toUpperCase() + '</option>');
        count--;
        if (count === 0) {
            $('#languages option[value=' + locale + ']').attr('selected', 'selected');
        }
    });


    /*
    //use this snippet if you don't wish to use deferred.done()
    $(document).on('translationdone', function () {
        console.log("Translation done!");

        $('#container1').prepend(function () {
            return '<h1>' + $(this).attr('data-title') + '</h1>';
        });

        //Init the select element
        $('#languages').change(function () {
            console.log("Changed");
            var value = $('#languages option:selected').val();
            localStorage.setItem("selectedLanguage", value);
            console.log("Selected ", value);
            window.location.reload();
        });
    });
*/
    try {
        $('body').translate({
            locale: locale
        }).done(function () {
            console.log("Translation done!");

            $('#container1').prepend(function () {
                return '<h1>' + $(this).attr('data-title') + '</h1>';
            });

            //Init the select element
            $('#languages').change(function () {
                console.log("Changed");
                var value = $('#languages option:selected').val();
                localStorage.setItem("selectedLanguage", value);
                console.log("Selected ", value);
                window.location.reload();
            });
        });
    } catch (e) {
        console.log(e.stack);
    }
});