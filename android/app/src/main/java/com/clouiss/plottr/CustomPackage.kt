package com.clouiss.plottr

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.kevinejohn.RNMixpanel.RNMixpanelModule;

class CustomPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext?): MutableList<ViewManager<View, ReactShadowNode<*>>> {
        return mutableListOf<ViewManager<View, ReactShadowNode<*>>>()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext?): MutableList<NativeModule> {
        var list = mutableListOf<NativeModule>()
        if (reactContext != null) {
            list.add(Document(reactContext))
            list.add(RNMixpanelModule(reactContext))
        }
        return list
    }
}