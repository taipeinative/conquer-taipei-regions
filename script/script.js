var dayTheme = true;

window.onload = e => {

    removeTab();
    setMap();
    toggleTab();
    toggleTheme();

};

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

function setMap() {

    var vectorStyle = {

        water: {

            color: '#0CC',
            fill: true,
            fillColor: '#0CC',
            fillOpacity: 0.2,
            opacity: 0.4,
            weight: 1,

        }
    };

    const osmURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    const osmLayer = L.tileLayer(osmURL, {maxZoom: 18, attribution: osmAttribution});

    const omtURL = "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key={key}";
    const omtAttribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © MapTiler';
    const omtKey = 'gXAfGuwbRueOGQvJ5wEm';
    const omtLayer = L.vectorGrid.protobuf(omtURL, {attribution: omtAttribution, key: omtKey, vectorTileLayerStyles: vectorStyle});

    const map = leaflet.map('map').setView([25.05, 121.55], 12);
    osmLayer.addTo(map);
    // omtLayer.addTo(map);

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