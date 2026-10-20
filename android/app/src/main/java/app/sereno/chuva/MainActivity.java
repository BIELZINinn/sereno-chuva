package app.sereno.chuva;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView web;
    private boolean pendingPlay;
    private boolean pendingWake;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFF070B12);
        getWindow().setNavigationBarColor(0xFF070B12);

        web = new WebView(this);
        web.setBackgroundColor(0xFF070B12);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        web.addJavascriptInterface(new Bridge(), "SerenoAndroid");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                runPending();
            }
        });
        web.setWebChromeClient(new WebChromeClient());
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.loadUrl("file:///android_asset/www/index.html");
        if (Build.VERSION.SDK_INT >= 33) {
            requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 1);
        }
        capture(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        capture(intent);
        runPending();
    }

    private void capture(Intent intent) {
        if (intent == null) return;
        if (intent.getBooleanExtra("toggle", false)) pendingPlay = true;
        if (intent.getBooleanExtra("play", false)) pendingPlay = true;
        if (intent.getBooleanExtra("wake", false)) {
            pendingWake = true;
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                            | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

    private void runPending() {
        if (web == null) return;
        if (pendingWake) {
            pendingWake = false;
            pendingPlay = false;
            web.post(() -> web.evaluateJavascript(
                    "(function(){if(window.SerenoApp&&SerenoApp.wake)SerenoApp.wake();})();", null));
            return;
        }
        if (pendingPlay) {
            pendingPlay = false;
            web.post(() -> web.evaluateJavascript(
                    "(function(){if(!window.SerenoApp)return;if(SerenoApp.isPlaying())SerenoApp.pause();else SerenoApp.play();})();",
                    null));
        }
    }

    private void startPlayback() {
        Intent i = new Intent(this, PlaybackService.class).setAction(PlaybackService.ACTION_START);
        if (Build.VERSION.SDK_INT >= 26) startForegroundService(i);
        else startService(i);
    }

    private void stopPlayback() {
        startService(new Intent(this, PlaybackService.class).setAction(PlaybackService.ACTION_STOP));
    }

    public class Bridge {
        @JavascriptInterface
        public void setPlaying(boolean on) {
            runOnUiThread(() -> {
                if (on) startPlayback();
                else stopPlayback();
            });
        }

        @JavascriptInterface
        public void setAlarm(String hhmm, boolean on) {
            getSharedPreferences("sereno", MODE_PRIVATE).edit()
                    .putBoolean("alarmOn", on)
                    .putString("alarmTime", hhmm == null ? "07:00" : hhmm)
                    .apply();
            AlarmHelper.schedule(MainActivity.this, hhmm, on);
        }

        @JavascriptInterface
        public void saveSnapshot(String json) {
            getSharedPreferences("sereno", MODE_PRIVATE).edit().putString("snapshot", json).apply();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
