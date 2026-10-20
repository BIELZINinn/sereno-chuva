package app.sereno.chuva;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences p = context.getSharedPreferences("sereno", Context.MODE_PRIVATE);
        if (!p.getBoolean("alarmOn", false)) return;
        String time = p.getString("alarmTime", "07:00");
        AlarmHelper.schedule(context, time, true);
    }
}
