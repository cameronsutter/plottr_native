//package com.clouiss.plottr;
//
//import android.app.Activity;
//import android.content.Context;
//import android.content.Intent;
//import android.net.Uri;
//import android.support.v7.app.AppCompatActivity;
//import android.os.Bundle;
//import com.facebook.react.LifecycleState;
//import com.facebook.react.ReactInstanceManager;
//import com.facebook.react.ReactRootView;
//import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
//import com.facebook.react.shell.MainReactPackage;
//
//public class ReactActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {
//    private ReactRootView mReactRootView;
//    private ReactInstanceManager mReactInstanceManager;
//
//    private static final String  INTENT_URI = "";
//    private static final String  INTENT_DATA = "";
//
//    public static Intent newIntent(final Context context, final Uri uri, final String data) {
//        final Intent intent = new Intent(context, ReactActivity.class);
//        intent.putExtra(INTENT_URI, uri.toString());
//        intent.putExtra(INTENT_DATA, data);
//        return intent;
//    }
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        mReactRootView = new ReactRootView(this);
//        mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(getApplication())
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModulePath("index")
//                .addPackage(new MainReactPackage())
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//        // The string here (e.g. "MyReactNativeApp") has to match
//        // the string in AppRegistry.registerComponent() in index.js
//        mReactRootView.startReactApplication(mReactInstanceManager, "MyReactNativeApp", null);
//
//        setContentView(mReactRootView);
//    }
//
//    @Override
//    public void invokeDefaultOnBackPressed() {
//        super.onBackPressed();
//    }
//}
