/**
 * License: MIT (http://opensource.org/licenses/MIT)
 * AMD Module compatibility: see http://stackoverflow.com/questions/10918063/how-to-make-a-jquery-plugin-loadable-with-requirejs
 */
(function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module depending on jQuery.
            define(['jquery'], factory);
        } else {
            // No AMD. Register plugin with global jQuery object.
            factory(jQuery);
        }
    }
    (function ($) {
        /**
         * @see http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key best answer
         */
        Object.byString = function (o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, ''); // strip a leading dot
            var a = s.split('.');
            while (a.length) {
                var n = a.shift();
                if (n in o) {
                    o = o[n];
                } else {
                    return;
                }
            }
            return o;
        };
        
        $.translateOptions = {
            localesBaseUrl : 'locales',
            locale : (navigator.language || navigator.userLanguage).substr(0, 2),
            dictName : 'dict' ,
            fallbackLanguage : 'en'
        };
        var _dictionary = {};


        //regular expression for parsing tokens of type {% my.key.here %}
        var tokenRx = /(({%\s)\w(\w|\d)+(\.\w(\w|\d)+)*(\s%}))/gim;

        //get translation for each key, allowing dotted paths such as my.key.in.dict
        function _getTranslation(key, dict) {
            return Object.byString(dict, key.replace('{% ', '').replace(' %}', ''));
        }

        //method that actually translates the element and its children
        function _translateElement(element, dict, deferred) {
            var tokens = element.html().match(tokenRx);
            var count = tokens.length; // + dataTokens;
            if (count === 0) {
                element.trigger('translationdone');
                deferred.resolve('translationdone');
            } else {
                var html = element.html();
                tokens.forEach(function (tk) {
                    html = html.replace(tk, _getTranslation(tk, dict));
                    count--;
                    if (count === 0) {
                        element.html(html);
                        element.trigger('translationdone');
                        deferred.resolve('translationdone');
                    }
                });
            }
            return element;
        }
        
        function loadDictionary(options){
            var _options = typeof options === 'undefined' ? {} : options;
            var localesBaseUrl = typeof _options.localesBaseUrl === "undefined" ? $.translateOptions.localesBaseUrl : _options.localesBaseUrl;
            var locale = typeof _options.locale === "undefined" ? $.translateOptions.locale : _options.locale;
            var dictName = typeof _options.dictName === "undefined" ? $.translateOptions.dictName : _options.dictName;
            var fallbackLanguage = typeof _options.fallbackLanguageict === "undefined" ? $.translateOptions.fallbackLanguage : _options.fallbackLanguage;
          
            var dictUrl = localesBaseUrl + '/' + locale + '/' + dictName + '.json';

            return $.getJSON(dictUrl, null).done(function (dictionary){
              _dictionary = dictionary;
          }).fail(function (xhr, errorString, error) {
                //Try to understand whats going on
                if (xhr.status === 404) {
                    //try with fallback
                    var vocUrl = localesBaseUrl + '/' + fallbackLanguage + '/' + dictName + '.json';
                    $.get(vocUrl, {
                        dataType: 'json'
                    }).done(function (dictionary) {
                        _dictionary = dictionary;
                    }).fail(function (xhr, errorString, error) {
                        throw errorString;
                    });

                } else {
                    throw errorString;
                }
            });
        }
        
        //Use with caution! Undocumented
        $.fn.reloadTranslationDictionary = loadDictionary;

        /**
     * Plugin main method
     * options:
        fallbackLanguage: fallback language (default 'en')
        locale: preferred locale (default = navigator.language)
        dictName: JSON dictionary file name to be put in localesUrl/<locale>/ (default = 'dict') Omit .json
        localesBaseUrl: base url for locales (default = 'locales')
     */
        $.fn.translate = function (options) {
            var me = this;
            var _options = typeof options === 'undefined' ? {} : options;
            var localesBaseUrl = typeof _options.localesBaseUrl === "undefined" ? $.translateOptions.localesBaseUrl : _options.localesBaseUrl;
            var locale = typeof _options.locale === "undefined" ? $.translateOptions.locale : _options.locale;
            var dictName = typeof _options.dictName === "undefined" ? $.translateOptions.dictName : _options.dictName;
            var fallbackLanguage = typeof _options.fallbackLanguageict === "undefined" ? $.translateOptions.fallbackLanguage : _options.fallbackLanguage;

            var def = $.Deferred();
            
            if(!$.isEmptyObject( _dictionary )){
              _translateElement(me, _dictionary, def);
            }else{
              //load dict first
              loadDictionary().then(function(_dictionary){
                _translateElement(me, _dictionary, def)
              })
            }

            return def;
        };
        
        /**
         * Return current dictionary value for given key
         * Dotted syntax may be used (e.g. path.to.key)
         */
        $.translationFor = function(key){
          var value = "";
           if(!$.isEmptyObject( _dictionary )){
             value = _getTranslation(key,_dictionary);
          }else{
            value = null;
          }
          return value;
        }

    }));