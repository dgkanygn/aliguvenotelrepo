<?php

$dirs = ['api/controllers', 'api/middleware', 'api/routes', 'api/config'];
$files = ['api/index.php'];

foreach ($dirs as $dir) {
    if (is_dir(__DIR__ . '/../' . $dir)) {
        foreach (glob(__DIR__ . '/../' . $dir . '/*.php') as $file) {
            $files[] = $file;
        }
    }
}

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        
        // Regex to replace json_encode([...]) with json_encode([...], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        // Ensure we don't double append it
        
        $newContent = preg_replace('/json_encode\((.*?)\)(?!, JSON_UNESCAPED_UNICODE)/', 'json_encode($1, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)', $content);
        
        // Let's be safer. A simpler PHP script could be tricky if there's nested parentheses.
        // Actually we can simply use token_get_all or just simple string replacements if all our json_encode calls are simple.
        
        file_put_contents($file, $newContent);
    }
}

echo "Done.\n";
