# Simple i18n

A [jQuery](http://jquery.com/) plugin aimed at simplifying internationalization for web apps and hybrid apps. Inspired by [i18next](http://i18next.com/), but with the purpose of making easier the translation of nested elements.
This may result particularly useful with some UI mobile frameworks such as [Kendo Mobile](http://www.telerik.com/kendo-ui#responsive-design-for-cross-device-modern-apps) or [jQuery Mobile](http://jquerymobile.com/). 

# Usage

Simply include jquery.simple.i18n.js, then call:

```javascript
$('body').translate();
```

To translate the whole page, or pass a selector for specific sections. 
The function returns a [deferred object](http://api.jquery.com/category/deferred-object/) object that may be used to execute a callback once the translation is finished, using its done() method. 
You may optionally listen to the *translationdone* event, which is emitted once all nodes have been translated.


### JSON dictionary
Dictionaries are simple JSON files:

```
{
    "my":{
        "app":{
            "title": "Title"
        }
    },
    "div":{
        "text":"Hello Div"
    },
    "li":{
       "item":"I'm an item title"
    }
}
```


### HTML
A sample template in HTML:
```HTML
<div data-title="{% my.app.title %}"></div>
<div>{% my.div.text %}
<ul>
    <li>{% my.li.item %}</li>
</ul>
</div>
```

Will yeld to:
```
<div data-title="Title"></div>
<div>Hello Div
<ul>
    <li>I'm an item title</li>
</ul>
</div>
```

See [example/index.html](example/index.html) for a working example.

## Options

A few options may be passed to the **translate** method:

* fallbackLanguage: ```'en', //fallback language (default 'en')```
* locale: ```'it', //preferred locale (default = navigator.language)```
* dictName: ```'dict', //JSON dictionary file name to be put in localesUrl/<locale>/ (default = 'dict') Omit .json```
* localesBaseUrl: ```'locales' //base url for locales (default = 'locales')```

## License

MIT License
http://opensource.org/licenses/MIT
