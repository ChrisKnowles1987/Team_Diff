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
    .then(data => {
        document.getElementById('result').textContent = JSON.stringify(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});