<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class PrivacyController extends Controller
{
    // Corrigir dados (Atualizar Perfil)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . $user->id,
        ], [
            'email.unique' => 'Este e-mail já existe no sistema.',
            'phone.unique' => 'Este telefone já existe no sistema.',
        ]);

        $user->update($request->only('name', 'email', 'phone'));

        return response()->json(['message' => 'Perfil atualizado com sucesso.', 'user' => $user]);
    }

    // Encerrar/Desativar Conta
    public function deactivateAccount(Request $request)
    {
        $user = $request->user();

        // Desativar a conta em vez de eliminar para respeitar retenção de faturas
        // e manter e-mail/telefone bloqueados
        $user->update([
            'is_active' => false
        ]);

        // Revogar todos os tokens
        $user->tokens()->delete();

        return response()->json(['message' => 'A sua conta foi desativada com sucesso. Não terá mais acesso ao sistema.']);
    }
}
