<?php
$file = __DIR__ . '/../controllers/PageController.php';
$content = file_get_contents($file);

// Replace exactly the lines that close the json encode arrays in PageController
$content = preg_replace('/\]\n\s*\]\);\n\s*\} catch/m', "]\n            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);\n        } catch", $content);

// Replace the exception catch json_encode
$content = preg_replace('/"Sunucu hatası: " \. \$e->getMessage\(\)\]\);/m', '"Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);', $content);

file_put_contents($file, $content);
echo "PageController.php updated.\n";

$file = __DIR__ . '/../controllers/NavigationController.php';
$content = file_get_contents($file);
$content = preg_replace('/\]\n\s*\]\);\n\s*\} catch/m', "]\n            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);\n        } catch", $content);
$content = preg_replace('/"Veritabanı hatası: " \. \$e->getMessage\(\)\]\);/m', '"Veritabanı hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);', $content);
file_put_contents($file, $content);
echo "NavigationController.php updated.\n";
