<?php
    $to = 'busforward@gmail.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
    $subject = $_POST['subject'];

    $message = '
                <html>
                    <head>
                        <title>' . $subject . '</title>
                    </head>
                    <body>
                        <p>Ф И О: ' . $_POST['name'] . '</p>                        
                        <p>Телефон: ' . $_POST['tel'] . '</p>                        
                        <p>E-mail: ' . $_POST['email'] . '</p>                        
                        <p>Сообщение: ' . $_POST['quest'] . '</p>                        
                    </body>
                </html>'; 
    $headers = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: Отправитель <busforward@gmail.com>\r\n"; //Наименование и почта отправителя
    if (mail($to, $subject, $message, $headers)) {
        echo 'success';
    } else {
        echo 'error';
    }
?>