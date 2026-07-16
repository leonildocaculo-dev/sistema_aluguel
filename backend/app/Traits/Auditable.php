<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            self::logAudit('created', $model);
        });

        static::updated(function ($model) {
            self::logAudit('updated', $model);
        });

        static::deleted(function ($model) {
            self::logAudit('deleted', $model);
        });
    }

    protected static function logAudit($action, $model)
    {
        $oldValues = $action === 'updated' ? $model->getOriginal() : null;
        $newValues = $action !== 'deleted' ? $model->getAttributes() : null;

        // Limpar dados sensiveis como password se estiver no array
        if (isset($oldValues['password'])) unset($oldValues['password']);
        if (isset($newValues['password'])) unset($newValues['password']);
        
        $request = request();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id ?? null,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
            'location' => null, // Exige integracao com servico de GeoIP para capturar a localização
        ]);
    }
}
