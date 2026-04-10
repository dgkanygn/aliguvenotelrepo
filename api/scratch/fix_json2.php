<?php

$dirs = ['controllers', 'middleware', 'routes', 'config'];
$files = ['index.php'];

foreach ($dirs as $dir) {
    if (is_dir(__DIR__ . '/../' . $dir)) {
        foreach (glob(__DIR__ . '/../' . $dir . '/*.php') as $file) {
            $files[] = $file;
        }
    }
}

foreach ($files as $file) {
    $path = __DIR__ . '/../' . basename($file);
    if (!file_exists($file)) {
        $file = __DIR__ . '/../' . $file;
    }

    if (file_exists($file)) {
        $content = file_get_contents($file);
        
        // Find json_encode calls except those that already have JSON_UNESCAPED_UNICODE
        // We will just do a simple str_replace if it's formatted in a standard way
        // But the best approach is:
        $newContent = preg_replace_callback('/json_encode\((.*?)\)(?!.*JSON_UNESCAPED_UNICODE)/s', function($matches) {
            $inner = $matches[1];
            // If inner contains json_encode we might have problems, but unlikely.
            // Wait, we can't use /s with .*? efficiently.
            return 'json_encode(' . $inner . ')';
        }, $content);
    }
}
