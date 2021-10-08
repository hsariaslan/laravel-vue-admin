<?php
if (!function_exists('slugify')) {
    function slugify ($text, string $divider = '_')
    {
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, $divider);
        $text = preg_replace('~-+~', $divider, $text);
        $text = strtolower($text);
        if (empty($text)) {
            return 'n-a';
        }
        return $text;
    }
}

if (!function_exists('apiCrypt')) {
    function apiCrypt ($data)
    {
        $cipher = 'AES-128-ECB';
        $key = env('API_CRYPT_KEY');
        $encoded = openssl_encrypt($data, $cipher, $key);
        return $encoded;
    }
}
