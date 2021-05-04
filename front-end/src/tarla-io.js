axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://127.0.0.1:5000/api';

//First Data
window.onload = () => {
    getData();
}

function returnDataElement(index, pointName, pointLatitude, pointLongitude) {
    return ` <li data-index="${index}"  class="data">
            <div class="point-name">
                ${pointName}
            </div>
            <div class="point-latitude">
                ${pointLatitude}
            </div>
            <div class="point-longitude">
                ${pointLongitude}
            </div>
            <div onclick="showEdit($(this))" class="button">
                edit
            </div>
            <div onclick="postDelete($(this),'${index}')" class="button">
                delete
            </div>
            <div onclick="showMap($(this))" class="button">
                map ıt
            </div>
            <div onclick="showTemperature($(this))" class="button">
               temperature
            </div>
        </li>`;
}

function getData() {
    axios.get('/data')
        .then(res => {
            $(".data-list-content:not(.title)").empty();
            res.data.forEach((data, index) => {
                $(".data-list-content").append(returnDataElement(index, data.point_name, data.point_latitude, data.point_longitude));
            });
        })
        .catch(() => {
            alert('Bir hata oluştu.');
        });
}

function postDelete(element, index) {
    axios.delete(`/data/${index}`,)
        .then(() => {
            element.parent().remove();
        })
        .catch(() => {
            alert('Bir hata oluştu');
        });
}

function postData() {
    const data = {
        'point_name': $(".data-input-content > li > input[name='name']").val(),
        'point_latitude': $(".data-input-content > li > input[name='longitude']").val(),
        'point_longitude': $(".data-input-content > li > input[name='latitude']").val(),
    };
    const index = $(".data-list-content > li:not(.title)").length;
    axios.post('/data', {...data})
        .finally(() => {
            $(".data-list-content").append(returnDataElement(index, data.point_name, data.point_latitude, data.point_longitude));
        })
}

function initMap(lat, lng) {
    // The location of Uluru

    const uluru = {lat: lat, lng: lng};
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}

function showMap(element) {
    const lat = parseInt(element.parent().children(".point-latitude").text().trim());
    const lng = parseInt(element.parent().children(".point-longitude").text().trim());
    initMap(lat, lng);
}

function showTemperature(element) {
    const lat = parseInt(element.parent().children('.point-latitude').text().trim());
    const lng = parseInt(element.parent().children('.point-longitude').text().trim());
    axios.get(`https://world.tarla.in/v3/weather?lat=${lat}&lng=${lng}`, {
        headers: {
            apikey: 'H2wQsn8PYrlv6uTn'
        }
    })
        .then(res => {
            const minData = res.data.daily.map(data => data.temperature_min);
            const maxData = res.data.daily.map(data => data.temperature_max);
            showChart(minData, maxData);
        })
        .catch(err => {
            alert('Bir hata oluştu');
        })
}

function showEdit(element) {
    const lat = parseInt(element.parent().children(".point-latitude").text().trim());
    const lng = parseInt(element.parent().children(".point-longitude").text().trim());
    const name = element.parent().children(".point-name").text().trim();
    const index = element.parent().attr('data-index');
    element.parent().addClass("edit");
    element.parent().html(returnEditRow(index, name, lat, lng));
}

function returnEditRow(index, name, lat, lng) {
    return `<form id="editForm">
                <div>
                <input type="text" name="point_name" value="${name}">
            </div>
            <div>
                <input type="text" name="point_latitude" value="${lat}">
            </div>
            <div>
                <input type="text" name="point_longitude" value="${lng}">
            </div>
            <div onclick="postEdit(${index})" class="save-button">
                save
            </div>
           </form>`;
}

function postEdit(index) {
    const data = {
        point_name: $("#editForm input[name='point_name']").val(),
        point_latitude: $("#editForm input[name='point_latitude']").val(),
        point_longitude: $("#editForm input[name='point_longitude']").val()
    }
    axios.put(`/data/${index}`, data)
        .then((res) => {
            getData();
        })
        .catch(() => {
            alert('Bir hata oluştu')
        })
}

function showChart(minData, maxData) {
    const labels = [
        '1. gün',
        '2. gün',
        '3. gün',
        '4. gün',
        '5. gün',
        '6. gün',
    ];
    const data = {
        labels: labels,
        datasets: [{
            label: 'MİN',
            backgroundColor: 'rgb(28,184,106)',
            borderColor: 'rgb(28,184,106)',
            data: minData,
        }, {
            label: 'MAX',
            backgroundColor: 'rgb(179,20,20)',
            borderColor: 'rgb(179,20,20)',
            data: maxData,
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {}
    };
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
