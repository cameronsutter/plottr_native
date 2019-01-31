package com.clouiss.plottr

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.kevinejohn.RNMixpanel.RNMixpanelModule;
import im.shimo.react.prompt.RNPromptModule;

class CustomPackage : ReactPackage {

    val reactActivity : ReactActivity

    constructor(activity : ReactActivity) {
        reactActivity = activity
    }

    override fun createViewManagers(reactContext: ReactApplicationContext?): MutableList<ViewManager<View, ReactShadowNode<*>>> {
        return mutableListOf<ViewManager<View, ReactShadowNode<*>>>()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext?): MutableList<NativeModule> {
        var nativeModules = mutableListOf<NativeModule>()
        if (reactContext != null) {
            nativeModules.add(Document(reactContext, reactActivity))
            nativeModules.add(RNMixpanelModule(reactContext))
            nativeModules.add(RNPromptModule(reactContext))
        }
        return nativeModules
    }
}