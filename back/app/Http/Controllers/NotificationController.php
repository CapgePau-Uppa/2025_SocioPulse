<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:255',
            'link' => 'nullable|string|max:255'
        ]);

        $notification = Notification::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'read' => false,
            'link' => $request->link
        ]);

        return response()->json($notification, 201);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json($notification);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    public function destroy($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->delete();

        return response()->json(null, 204);
    }

    public function addDebugNotification()
    {
        $notification = Notification::create([
            'user_id' => Auth::id(),
            'message' => 'Test de notification ' . now()->format('H:i:s'),
            'read' => false,
            'link' => '/dashboard'
        ]);

        return response()->json($notification, 201);
    }
}