<?php require '../config/db.php'; $db = (new Database())->getConnection(); $db->query('ALTER TABLE restaurant_info MODIFY menu_pdf_url TEXT'); echo 'Migrated'; ?>
