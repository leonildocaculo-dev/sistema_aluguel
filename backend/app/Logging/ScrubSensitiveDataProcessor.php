<?php

namespace App\Logging;

use Monolog\LogRecord;

class ScrubSensitiveDataProcessor
{
    /**
     * Campos a mascarar nos logs (APD Compliance)
     */
    protected array $sensitiveKeys = [
        'password',
        'password_confirmation',
        'token',
        'access_token',
        'authorization',
        'ccv',
        'card_number',
        'secret',
        'api_key'
    ];

    public function __invoke(LogRecord $record): LogRecord
    {
        $context = $record->context;

        if (!empty($context)) {
            $record = $record->with(context: $this->scrubArray($context));
        }

        return $record;
    }

    protected function scrubArray(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($key) && $this->isSensitiveKey($key)) {
                $data[$key] = '[FILTERED]';
            } elseif (is_array($value)) {
                $data[$key] = $this->scrubArray($value);
            } elseif (is_string($value) && (str_starts_with(trim($value), '{') || str_starts_with(trim($value), '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $data[$key] = json_encode($this->scrubArray($decoded));
                }
            }
        }

        return $data;
    }

    protected function isSensitiveKey(string $key): bool
    {
        $keyLower = strtolower($key);
        foreach ($this->sensitiveKeys as $sensitiveKey) {
            if (str_contains($keyLower, $sensitiveKey)) {
                return true;
            }
        }
        return false;
    }
}
