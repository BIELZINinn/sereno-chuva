package app.sereno.chuva;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;

public class PlaybackService extends Service {
    public static final String ACTION_START = "app.sereno.chuva.START";
    public static final String ACTION_STOP = "app.sereno.chuva.STOP";
    public static final String ACTION_TOGGLE = "app.sereno.chuva.TOGGLE";
    private static final String CHANNEL = "sereno_playback";
    private static final int NOTIF = 17;
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "sereno:rain");
            wakeLock.setReferenceCounted(false);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : ACTION_START;
        if (ACTION_STOP.equals(action)) {
            stopForeground(true);
            releaseWake();
            stopSelf();
            return START_NOT_STICKY;
        }
        if (ACTION_TOGGLE.equals(action)) {
            Intent open = new Intent(this, MainActivity.class)
                    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK)
                    .putExtra("toggle", true);
            startActivity(open);
        }
        acquireWake();
        startForeground(NOTIF, buildNotification());
        return START_STICKY;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL, "Chuva", NotificationManager.IMPORTANCE_LOW);
        ch.setDescription("Mantém a chuva tocando com a tela bloqueada");
        ch.setShowBadge(false);
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm != null) nm.createNotificationChannel(ch);
    }

    private Notification buildNotification() {
        Intent open = new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(
                this, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | pendingFlags());
        Intent pause = new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK)
                .putExtra("toggle", true);
        PendingIntent pausePi = PendingIntent.getActivity(
                this, 1, pause, PendingIntent.FLAG_UPDATE_CURRENT | pendingFlags());
        return new NotificationCompat.Builder(this, CHANNEL)
                .setContentTitle("Sereno")
                .setContentText("Chuva tocando")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pi)
                .setOngoing(true)
                .setSilent(true)
                .addAction(0, "Play / Pausa", pausePi)
                .build();
    }

    private int pendingFlags() {
        return Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0;
    }

    private void acquireWake() {
        if (wakeLock != null && !wakeLock.isHeld()) wakeLock.acquire();
    }

    private void releaseWake() {
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
    }

    @Override
    public void onDestroy() {
        releaseWake();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
