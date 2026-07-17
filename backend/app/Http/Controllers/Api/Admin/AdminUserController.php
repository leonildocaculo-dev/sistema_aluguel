<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $users]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
        ]);

        return response()->json(['message' => 'Utilizador atualizado com sucesso!', 'data' => $user->load('role')]);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent admin from banning themselves
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Não pode alterar o seu próprio estado.'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'ativado' : 'banido';
        return response()->json(['message' => "Utilizador $status com sucesso!", 'data' => $user]);
    }
}

