
function createTable(data) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    const thead = table.createTHead();
    const tbody = table.createTBody();
  
    // Create header row
    let row = thead.insertRow();
    let th1 = document.createElement('th');
    th1.textContent = 'Summoner Name';
    let th2 = document.createElement('th');
    th2.textContent = 'Win Rate';
    row.appendChild(th1);
    row.appendChild(th2);
  
    // Create rows for each key-value pair in data
    for (let key in data) {
      let row = tbody.insertRow();
      let cell1 = row.insertCell();
      let cell2 = row.insertCell();
      cell1.textContent = key;
      cell2.textContent = data[key];
    }
  
    return table;
  }

  
document.getElementById('summonerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('nameInput').value;
    fetch('/get-summoner-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(response => {
         const table= createTable(response)
         document.getElementById('result').innerHTML = ''
         document.getElementById('result').innerHTML = 'Processing'
         document.getElementById('result').innerHTML = ''
         document.getElementById('result').appendChild(table)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
