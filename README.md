<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Авторизация Steam...</title>
</head>
<body>
    <div id="status" style="font-family: sans-serif; text-align: center; margin-top: 50px; font-size: 18px;">
        Обработка входа через Steam, подождите...
    </div>

    <script>
        // Функция для парсинга параметров OpenID, которые прислал Steam в адресную строку
        function getSteamIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const claimedId = urlParams.get('openid.claimed_id');
            if (claimedId) {
                // Из ссылки вида https://steamcommunity.com вырезаем сам ID
                const matches = claimedId.match(/id\/(\d+)/);
                return matches ? matches[1] : null;
            }
            return null;
        }

        const steamId = getSteamIdFromUrl();

        if (steamId) {
            document.getElementById('status').innerText = 'Сохранение в базу данных...';

            // Твой адрес Firebase базы данных
            const firebaseEndpoint = `https://firebaseio.com{steamId}.json`;

            // Данные, которые пишем в Firebase (пока сохраняем SteamID и время входа)
            const userData = {
                steamId: steamId,
                lastLogin: new Date().toISOString(),
                status: "online"
            };

            // Отправляем данные напрямую в Firebase Realtime Database без сторонних библиотек
            fetch(firebaseEndpoint, {
                method: 'PUT', // PUT перезапишет или создаст запись для конкретного steamId
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('status').innerText = 'Успешно! Возвращаем на сайт...';
                    // Перенаправляем пользователя обратно на главную страницу твоего сайта uCoz, передавая в ссылке его steamid
                    window.location.href = `https://moy.su{steamId}`;
                } else {
                    document.getElementById('status').innerText = 'Ошибка сохранения в базу данных.';
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById('status').innerText = 'Ошибка сети при обращении к базе.';
            });
        } else {
            document.getElementById('status').innerText = 'Ошибка авторизации Steam или вход не выполнен.';
        }
    </script>
</body>
</html>
