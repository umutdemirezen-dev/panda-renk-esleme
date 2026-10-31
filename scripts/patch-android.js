/*
 * Panda Renk Eşleme – "npx cap add android" sonrasında Android projesini hazırlar:
 *  1) Yatay ekran kilidi (sensorLandscape)
 *  2) Tam ekran (durum ve gezinme çubukları gizli, kaydırınca geçici görünür)
 *  3) versionCode = GitHub Actions çalıştırma numarası, versionName = package.json sürümü
 * Kullanım: node scripts/patch-android.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = path.join(root, "android", "app");
const pkg = require(path.join(root, "package.json"));
const cap = require(path.join(root, "capacitor.config.json"));

function edit(file, fn) {
  const before = fs.readFileSync(file, "utf8");
  const after = fn(before);
  fs.writeFileSync(file, after);
  console.log((before === after ? "  (değişmedi) " : "  düzenlendi: ") + path.relative(root, file));
}

// 1) Yatay ekran
edit(path.join(app, "src", "main", "AndroidManifest.xml"), (s) =>
  s.includes("android:screenOrientation")
    ? s
    : s.replace(/<activity\b/, '<activity\n            android:screenOrientation="sensorLandscape"')
);

// 2) Sürüm numaraları (Play Console her yüklemede daha büyük versionCode ister)
const versionCode = parseInt(process.env.GITHUB_RUN_NUMBER || process.env.VERSION_CODE || "1", 10);
edit(path.join(app, "build.gradle"), (s) =>
  s.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
   .replace(/versionName\s+"[^"]*"/, `versionName "${pkg.version}"`)
);
console.log(`  versionCode=${versionCode}  versionName=${pkg.version}`);

// 3) Tam ekran MainActivity
const pkgDir = path.join(app, "src", "main", "java", ...cap.appId.split("."));
fs.mkdirSync(pkgDir, { recursive: true });
fs.writeFileSync(
  path.join(pkgDir, "MainActivity.java"),
  `package ${cap.appId};

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    private void hideSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.hide(WindowInsetsCompat.Type.systemBars());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
`
);
console.log("  yazıldı: MainActivity.java (tam ekran)");
console.log("Android projesi hazır.");
