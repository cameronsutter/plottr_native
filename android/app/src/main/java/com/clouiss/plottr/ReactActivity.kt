package com.clouiss.plottr

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactRootView
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import com.facebook.react.shell.MainReactPackage
import android.graphics.PixelFormat
import android.view.WindowManager
import android.os.Build
import android.util.Log
import com.facebook.react.common.LifecycleState
import java.util.*

class ReactActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        fixAndroid()

        val uri = intent.getStringExtra(INTENT_URI)
        var data = intent.getStringExtra(INTENT_DATA)
        val storyName = intent.getStringExtra(INTENT_STORY_NAME)

        mReactRootView = ReactRootView(getApplication())
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackage(MainReactPackage())
                .addPackage(CustomPackage(this))
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build()
        // The string here (e.g. "MyReactNativeApp") has to match
        // the string in AppRegistry.registerComponent() in index.js
        var options: Bundle = Bundle()
        options.putString("documentURL", uri.toString())
        options.putString("data", data)
        options.putString("storyName", storyName)
        mReactRootView.startReactApplication(mReactInstanceManager, "plottr_native", options)

        setContentView(mReactRootView)
    }

    override fun invokeDefaultOnBackPressed() {
        super.onBackPressed()
    }

    companion object {

        private val INTENT_URI = "uri"
        private val INTENT_DATA = "data"
        private val INTENT_STORY_NAME = "storyName"

        fun newIntent(context: Context, uri: Uri, data: String, name: String): Intent {
            val intent = Intent(context, ReactActivity::class.java)
            intent.putExtra(INTENT_URI, uri.toString())
            intent.putExtra(INTENT_DATA, data)
            intent.putExtra(INTENT_STORY_NAME, name)

            return intent
        }

        private lateinit var mReactRootView: ReactRootView
        private lateinit var mReactInstanceManager: ReactInstanceManager

        fun sharedInstance(): ReactActivity.Companion {
            return this
        }
    }

    override fun onPause() {
        super.onPause()

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this)
        }
    }

    override fun onResume() {
        super.onResume()

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this)
        }
    }

    override fun onDestroy() {
        super.onDestroy()

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this)
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication()
        }
    }

    fun closeDocument () {
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication()
        }
        finish()
    }

    override fun onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed()
        } else {
            super.onBackPressed()
        }
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog()
            return true
        }
        return super.onKeyUp(keyCode, event)
    }

    fun fixAndroid() {
        val params: WindowManager.LayoutParams
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            params = WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    PixelFormat.TRANSLUCENT)
        } else {
            params = WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.TYPE_SYSTEM_ERROR,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    PixelFormat.TRANSLUCENT)
        }
    }
}
