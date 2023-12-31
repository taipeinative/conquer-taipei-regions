var dayTheme = true;
var lang = 'zh-TW';
var locale;

window.onload = e => {

    fetchGeometry();
    fetchLocale();
    removeTab();
    toggleLanguage();
    toggleTab();
    toggleTheme();

};

function fetchGeometry() {

    fetch('geometry/regions.geojson')

        .then(res => {

            return res.json();

        })
        .then(data => {

            setMap(data);

        })
        .catch(err => {

            console.log(err);

        })

}

/**
 * Fetch `locale.json`. In order to bypass CORS policy when testing locally,
 *  use bash command `$ python -m http.server` to create a http enviroment.
 *  Then visit `localhost:8000` to see how it works in real time.
 */
function fetchLocale() {

    fetch('src/locale.json')

        .then(res => {

            return res.json();

        })
        .then(data => {
            
            updateLanguage(data)
            locale = data;

        })
        .catch(err => {

            console.log(err);

        })
}

/**
 * Remove language and information tabs.
 */
function removeTab() {

    const buttons = document.getElementsByClassName('remove');
    const aside = document.getElementsByTagName('aside')[0];

    for (var i = 0; i < buttons.length; i++) {
        
        buttons[i].addEventListener('click', e => {

            var section = document.getElementsByClassName('visible')[0];
            var sectionName = section.id.split('-')[0];
            var navButton = document.getElementById(sectionName);

            aside.classList.remove(sectionName);
            navButton.classList.remove('on');
            section.classList.remove('visible');
            e.preventDefault();

        });
    }
}

function setMap(region) {

    const osmURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const osmLayer = L.tileLayer(osmURL, {attribution: osmAttribution, maxZoom: 18});

    const map = leaflet.map('map').setView([25.05, 121.55], 12);
    osmLayer.addTo(map);

    var clicked;
    var regLayer;

    /**
     * The event listener for user events.
     * @param {*} feature 
     * @param {*} layer 
     */
    function lfEventListener(feature, layer) {

        layer.on({

            click: lfEventClick,
            mouseover: lfEventOn,
            mouseout: lfEventOut

        });

    }

    /**
     * The actions which fire after the user click on the feature.
     */
    function lfEventClick(e) {

        var feature = e.target;
        var sel;

        clicked = feature;
        regLayer.resetStyle();

        feature.setStyle({

            color: '#16E',
            weight: 3

        });

        feature.bringToFront();

        sel = document.getElementById('status-tab-1st-part');
        sel.innerHTML = feature.feature.properties.fullName;

    }

    /**
     * The actions which fire after the mouse hover the feature.
     * @param {*} e The event.
     */
    function lfEventOn(e) {

        var feature = e.target;

        if (clicked != feature) {

            feature.setStyle({

                color: '#222',
                weight: 3

            });

            feature.bringToFront();
            
            if (clicked != null) {

                clicked.bringToFront();

            }
        }
    }

    /**
     * The actions which fire after the mouse hover out the feature.
     * @param {*} e The event.
     */
       function lfEventOut(e) {
        
        if (clicked != e.target) {

            regLayer.resetStyle(e.target);

        }

    }
    /**
    * Define polygons' style.
    */
    function lfStyleGeneric() {

        return {

            fillColor: '#FFF',
            fillOpacity: 0.5,
            color: '#888',
            weight: 1

        }

    }

    regLayer = L.geoJson(region, {style: lfStyleGeneric, onEachFeature: lfEventListener}).addTo(map);

}

/**
 * Toggle languages.
 */
function toggleLanguage() {

    const buttons = document.querySelectorAll('.lang-button');

    buttons.forEach(item => {

        item.addEventListener('click', e => {

            var targetLang = item.id.match(/(?<=lang-tab-).+/)[0];

            document.getElementsByTagName('html')[0].lang = targetLang;
            document.getElementsByTagName('body')[0].classList.remove(lang);
            document.getElementsByTagName('body')[0].classList.add(targetLang);
            lang = targetLang;
            updateLanguage(locale);

            e.preventDefault();

        });
    });
}

/**
 * Toggle language and information tabs.
 */
function toggleTab() {

    const buttons = document.querySelectorAll('#info, #lang');
    const aside = document.getElementsByTagName('aside')[0];

    buttons.forEach(item => {

        item.addEventListener('click', e => {
            
            var classSet = new Set();

            buttons.forEach(item => {

                item.classList.value.split(' ').forEach(classItem => {

                    classSet.add(classItem);

                });
            })

            if (item.classList.contains('on')) {

                const removeButton = document.getElementById(`${item.id}-tab-remove`);
                removeButton.click();

            } else {

                if (classSet.has('on')) {

                    const otherTabButton = document.getElementsByClassName('on')[0];
                    const otherTabRemoveButton = document.getElementById(`${otherTabButton.id}-tab-remove`);
                    otherTabRemoveButton.click();

                }

                const itemTab = document.getElementById(`${item.id}-tab`);
                item.classList.toggle('on');
                aside.classList.toggle(item.id);
                itemTab.classList.toggle('visible');

            }

            e.preventDefault();

        });
    });
}

/**
 * Toggle light and dark themes.
 */
function toggleTheme() {

    var button = document.getElementById('theme');
    var body = document.getElementsByTagName('body')[0];

    const currentTime = new Date().getHours();

    if ((6 < currentTime) && (currentTime < 18)) {

        body.classList.toggle('day');

    } else {

        body.classList.toggle('night');
        dayTheme = !dayTheme;

    }

    button.addEventListener('click', e => {

        body.classList.toggle('day');
        body.classList.toggle('night');
        dayTheme = !dayTheme;
        e.preventDefault();

    });
}

/**
 * Update the laguage of the page.
 * @param {Array} source The JSON array indicating the local translation of the page.
 */
function updateLanguage(source) {

    source.forEach(item => {

        var element = document.getElementById(item['id']);
        element[item['property']] = item[lang];

    })
}