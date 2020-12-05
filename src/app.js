const calculate = require('./utils/calculate');

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
} catch (error) {}

const tableBody = document.getElementById('kmPrice');

for(let i = 10; i < 50; i++){
    let km = i/10;
    tableBody.innerHTML +=`<tr> 
        <th>${ km }</th>    
        <td>$${ calculate.calculatePrice(km) }</td>
        <th>${ km + 4.0 }</th>    
        <td>$${ calculate.calculatePrice(km + 4.0) }</td>
        <th>${ km + 8.0 }</th>    
        <td>$${ calculate.calculatePrice(km + 8.0) }</td>
        <th>${ km + 12.0 }</th>    
        <td>$${ calculate.calculatePrice(km + 12.0) }</td>    
    </tr>`
}


